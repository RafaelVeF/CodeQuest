/**
 * CodeQuest — Shared Domain Models and Contracts
 * Basé sur les spécifications fonctionnelles et techniques v1.0
 */

// ==========================================
// 1. RÔLES ET AUTHENTIFICATION (RBAC)
// ==========================================
export enum UserRole {
  VISITOR = 'VISITOR',
  PLAYER = 'PLAYER',
  CAPTAIN = 'CAPTAIN',     // Rôle contextuel à une équipe
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export type Permission =
  | 'challenge:read'
  | 'challenge:write'
  | 'submission:create'
  | 'team:manage'
  | 'chat:moderate'
  | 'user:ban'
  | 'admin:access';

export interface UserProfile {
  id: string;
  email: string;
  pseudo: string;
  avatarUrl?: string;
  preferredLanguage: SupportedLanguage;
  soundEnabled: boolean;
  theme: 'neon-dark' | 'neon-light';
  hp: number;              // 0 à 100 max
  isKo: boolean;
  koUntil?: string;        // ISO date
  bitsBalance: number;     // Solde dérivé du registre immuable
  roles: UserRole[];
  createdAt: string;
}

// ==========================================
// 2. DÉFIS & EXÉCUTION
// ==========================================
export type SupportedLanguage = 'python' | 'javascript' | 'java' | 'cpp';

export enum ChallengeType {
  SORTING = 'SORTING',             // Algorithmique / tris
  DEBUGGING = 'DEBUGGING',         // Correction de bugs
  DECRYPTION = 'DECRYPTION',       // Cryptographie (instance à seed)
  STEGANOGRAPHY = 'STEGANOGRAPHY', // Texte caché dans image (LSB...)
  QR_CODE = 'QR_CODE',             // QR code dégradé/caché
}

export enum DifficultyLevel {
  LEVEL_1 = 1,
  LEVEL_2 = 2,
  LEVEL_3 = 3,
  LEVEL_4 = 4,
  LEVEL_5 = 5,
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;       // Les tests cachés ne sont JAMAIS envoyés au client
}

export interface Challenge {
  id: string;
  themeId: string;
  type: ChallengeType;
  difficulty: DifficultyLevel;
  title: string;
  statement: string;
  basePoints: number;      // ex: 100 * difficulté
  perfMax: number;         // Points max de performance
  tOptMs: number;          // Temps optimal de référence
  tMaxMs: number;          // Temps limite bonus
  isEvent: boolean;
  isBoss: boolean;
  prerequisites: string[]; // IDs des défis requis (DAG)
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

// ==========================================
// 3. SOUMISSIONS & SCORING
// ==========================================
export enum SubmissionStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  ERROR = 'ERROR',
  TIMEOUT = 'TIMEOUT',
}

export interface TestResultItem {
  testId: string;
  passed: boolean;
  durationMs: number;
  output?: string;
  error?: string;
}

export interface SubmissionResult {
  submissionId: string;
  challengeId: string;
  userId: string;
  teamId?: string;
  status: SubmissionStatus;
  allPassed: boolean;
  passRatio: number;       // 1.0 = 100% de réussite obligatoire pour score
  cpuTimeMedianMs: number; // Médiane calculée sur 5 runs
  runsCpuTimeMs: number[]; // Les 5 mesures brutes
  score: number;           // basePoints + pointsPerf
  pointsBase: number;
  pointsPerf: number;
  bitsAwarded: number;
  hpDelta: number;         // Dégâts subis (-10 à -25 sur Boss en cas d'échec)
  bossHpDelta?: number;    // Dégâts infligés au Boss
  createdAt: string;
}

/**
 * Calcul du score conforme à la spécification (section 4.3)
 */
export function calculatePerformanceScore(
  tMeasured: number,
  tOpt: number,
  tMax: number,
  perfMax: number,
  tolerance = 0.05
): number {
  if (tMax <= tOpt) return 0;
  // Tolérance ±5 %
  const effectiveT = tMeasured <= tOpt * (1 + tolerance) ? tOpt : tMeasured;
  const ratio = (effectiveT - tOpt) / (tMax - tOpt);
  const clamped = Math.max(0, Math.min(1, 1 - ratio));
  return Math.round(perfMax * clamped);
}

// ==========================================
// 4. BULLMQ JOB CONTRACTS (Runner & API)
// ==========================================
export interface ExecutionJobData {
  submissionId: string;
  challengeId: string;
  userId: string;
  teamId?: string;
  language: SupportedLanguage;
  code: string;
  tests: TestCase[];       // Contient tests visibles + cachés injectés par le serveur
  cpuLimitMs: number;
  memoryLimitMb: number;
  nbRuns: number;          // Fixé à 5 pour retenir la médiane
}

export interface ExecutionJobResult {
  submissionId: string;
  success: boolean;
  runs: {
    runIndex: number;
    cpuTimeMs: number;
    tests: TestResultItem[];
  }[];
  medianCpuTimeMs: number;
  allTestsPassed: boolean;
  errorMessage?: string;
}

// ==========================================
// 5. BOSS & SANTÉ JOUEUR (Vitalité)
// ==========================================
export const MAX_PLAYER_HP = 100;
export const KO_RECOVERY_MINUTES = 30;
export const PASSIVE_REGEN_INTERVAL_MINUTES = 6; // +1 PV toutes les 6 min

export interface BossEntity {
  id: string;
  name: string;
  totalHp: number;
  currentHp: number;
  phases: {
    phaseIndex: number;
    challengeId: string;
    damageMultiplier: number;
  }[];
}

// ==========================================
// 6. ÉQUIPES & BATTLE ROYALE
// ==========================================
export interface TeamEntity {
  id: string;
  name: string;
  tag: string;             // ex: [CYBR]
  captainId: string;
  memberIds: string[];     // 2 à 5 membres
}

export interface BattleRoyaleRound {
  roundNumber: number;
  challengeId: string;
  startedAt: string;
  endsAt: string;
  eliminatedUserIds: string[];
}

// ==========================================
// 7. WEBSOCKET / TEMPS RÉEL (Socket.IO Events)
// ==========================================
export interface SocketServerToClientEvents {
  'submission:status': (data: { submissionId: string; status: SubmissionStatus }) => void;
  'submission:completed': (result: SubmissionResult) => void;
  'chat:message': (data: { channelId: string; sender: string; text: string; sentAt: string }) => void;
  'team:collaborator_cursor': (data: { userId: string; position: { line: number; column: number } }) => void;
  'boss:hp_update': (data: { bossId: string; currentHp: number; maxHp: number }) => void;
  'battle_royale:tick': (data: { remainingSeconds: number; roundNumber: number }) => void;
}

export interface SocketClientToServerEvents {
  'chat:send': (data: { channelId: string; text: string }) => void;
  'team:cursor_move': (data: { teamId: string; position: { line: number; column: number } }) => void;
}

// ==========================================
// 8. AUTHENTIFICATION & POLITIQUE DE MOT DE PASSE
// ==========================================

/** Longueur minimale requise pour un mot de passe (contrat partagé API / web). */
export const PASSWORD_MIN_LENGTH = 12;

/** Message d'erreur affiché à l'utilisateur quand la politique de mot de passe n'est pas respectée. */
export const PASSWORD_POLICY_MESSAGE =
  'Le mot de passe doit contenir au moins 12 caractères, une minuscule, une majuscule et un chiffre ou un symbole.';

/**
 * Vérifie qu'un mot de passe respecte la politique :
 * longueur minimale, une minuscule, une majuscule et un chiffre.
 * Un chiffre est exigé : un symbole seul ne suffit pas.
 */
export function isStrongPassword(value: string): boolean {
  return (
    value.length >= PASSWORD_MIN_LENGTH &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /[0-9]/.test(value)
  );
}

/** Utilisateur exposé par l'API d'authentification. */
export interface AuthUser {
  id: string;
  email: string;
  pseudo: string;
  avatarUrl?: string;
  preferredLanguage: SupportedLanguage;
  theme: string;
  soundEnabled: boolean;
  roles: UserRole[];
  createdAt: string;
}

/** Réponse de l'API d'authentification (connexion / inscription). */
export interface AuthResponse {
  user: AuthUser;
}

