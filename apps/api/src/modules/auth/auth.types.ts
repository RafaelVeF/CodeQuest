import type { AuthUser } from '@codequest/shared';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
  rememberMe: boolean;
}

export interface AuthResult extends AuthTokens {
  user: AuthUser;
}

export interface RequestMeta {
  userAgent?: string;
  ip?: string;
}

export interface AccessTokenPayload {
  sub: string;
  sid: string;
  type: 'access';
}
