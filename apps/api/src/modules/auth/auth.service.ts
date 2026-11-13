import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { AuthUser, SupportedLanguage, UserRole } from '@codequest/shared';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ACCESS_TOKEN_TTL_MS,
  INVALID_CREDENTIALS_MESSAGE,
  LOCK_DURATION_MS,
  MAX_LOGIN_ATTEMPTS,
  REFRESH_SHORT_TTL_MS,
  REFRESH_TTL_MS,
} from './auth.constants';
import { generateRefreshToken, hashPassword, hashRefreshToken, verifyPassword } from './password';
import type { AuthResult, AuthTokens, RequestMeta } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto, meta: RequestMeta): Promise<AuthResult> {
    const email = dto.email.toLowerCase();
    const pseudo = dto.pseudo.toLowerCase();
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { pseudoNormalized: pseudo }] },
    });
    if (existing) {
      throw new ConflictException('E-mail ou pseudo déjà utilisé.');
    }

    const role = await this.prisma.role.upsert({
      where: { name: 'PLAYER' },
      update: {},
      create: { name: 'PLAYER' },
    });
    const passwordHash = await hashPassword(dto.password);
    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          email,
          pseudo,
          pseudoNormalized: pseudo,
          passwordHash,
          preferredLanguage: dto.preferredLanguage ?? 'python',
          roles: { create: [{ roleId: role.id }] },
        },
        include: { roles: { include: { role: true } } },
      });
    } catch (error: unknown) {
      if (
        error !== null &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('E-mail ou pseudo déjà utilisé.');
      }
      throw error;
    }
    const tokens = await this.createSession(user.id, true, meta);
    return { ...tokens, user: this.toAuthUser(user) };
  }

  async login(dto: LoginDto, meta: RequestMeta): Promise<AuthResult> {
    const normalized = dto.identifier.toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: normalized }, { pseudoNormalized: normalized }] },
      include: { roles: { include: { role: true } } },
    });

    if (
      !user ||
      (user.lockedUntil && user.lockedUntil > new Date()) ||
      user.status !== 'ACTIVE' ||
      user.deletedAt
    ) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordValid = await verifyPassword(user.passwordHash, dto.password);
    if (!passwordValid) {
      const nextAttempts = (user.failedLoginAttempts ?? 0) + 1;
      const data =
        nextAttempts >= MAX_LOGIN_ATTEMPTS
          ? {
              failedLoginAttempts: MAX_LOGIN_ATTEMPTS,
              lockedUntil: new Date(Date.now() + LOCK_DURATION_MS),
            }
          : { failedLoginAttempts: nextAttempts };
      await this.prisma.user.update({ where: { id: user.id }, data });
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
    });
    const tokens = await this.createSession(user.id, dto.remember ?? true, meta);
    return { ...tokens, user: this.toAuthUser(user) };
  }

  async createSession(userId: string, rememberMe: boolean, meta: RequestMeta): Promise<AuthTokens> {
    const refreshToken = generateRefreshToken();
    const refreshExpiresAt = new Date(
      Date.now() + (rememberMe ? REFRESH_TTL_MS : REFRESH_SHORT_TTL_MS),
    );
    const session = await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash: hashRefreshToken(refreshToken),
        expiresAt: refreshExpiresAt,
        rememberMe,
        userAgent: meta.userAgent,
        ip: meta.ip,
      },
    });
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, sid: session.id, type: 'access' },
      { expiresIn: '15m' },
    );
    return { accessToken, refreshToken, refreshExpiresAt, rememberMe };
  }

  private toAuthUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      pseudo: user.pseudo,
      ...(user.avatarUrl ? { avatarUrl: user.avatarUrl } : {}),
      preferredLanguage: user.preferredLanguage as SupportedLanguage,
      theme: user.theme,
      soundEnabled: user.soundEnabled,
      roles: user.roles.map((entry: any) => entry.role.name as UserRole),
      createdAt: user.createdAt.toISOString(),
    };
  }
}
