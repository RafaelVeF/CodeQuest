import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';

const prismaMock = {
  user: { findFirst: vi.fn(), create: vi.fn(), update: vi.fn() },
  role: { upsert: vi.fn() },
  session: { create: vi.fn(), findFirst: vi.fn(), update: vi.fn(), updateMany: vi.fn() },
};

const playerRole = { id: 'role-player', name: 'PLAYER' };
const userRecord = {
  id: 'user-1',
  email: 'demo@codequest.gg',
  pseudo: 'demo_runner',
  pseudoNormalized: 'demo_runner',
  avatarUrl: null,
  preferredLanguage: 'python',
  theme: 'neon-dark',
  soundEnabled: true,
  status: 'ACTIVE',
  deletedAt: null,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  roles: [{ role: playerRole }],
};

function createService() {
  return new AuthService(prismaMock as any, new JwtService({ secret: 'test-secret' }));
}

describe('AuthService.register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.user.findFirst.mockResolvedValue(null);
    prismaMock.role.upsert.mockResolvedValue(playerRole);
    prismaMock.user.create.mockResolvedValue(userRecord);
    prismaMock.session.create.mockResolvedValue({ id: 'session-1' });
  });

  it('crée un utilisateur, hache le mot de passe et ouvre une session', async () => {
    const service = createService();
    const result = await service.register(
      { email: 'Demo@CodeQuest.gg', pseudo: 'Demo_Runner', password: 'CodeQuest2026!' },
      { userAgent: 'vitest', ip: '127.0.0.1' },
    );

    const createArgs = prismaMock.user.create.mock.calls[0][0];
    expect(createArgs.data.email).toBe('demo@codequest.gg');
    expect(createArgs.data.pseudoNormalized).toBe('demo_runner');
    expect(createArgs.data.passwordHash).not.toBe('CodeQuest2026!');
    expect(await argon2.verify(createArgs.data.passwordHash, 'CodeQuest2026!')).toBe(true);
    expect(prismaMock.session.create).toHaveBeenCalledOnce();
    expect(result.user.pseudo).toBe('demo_runner');
    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
  });

  it('refuse un e-mail ou pseudo déjà utilisé', async () => {
    prismaMock.user.findFirst.mockResolvedValue(userRecord);
    const service = createService();

    await expect(
      service.register(
        { email: 'demo@codequest.gg', pseudo: 'demo_runner', password: 'CodeQuest2026!' },
        {},
      ),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
