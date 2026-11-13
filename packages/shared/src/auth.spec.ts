import { describe, it, expect } from 'vitest';
import { isStrongPassword, PASSWORD_MIN_LENGTH } from './index';

describe('isStrongPassword', () => {
  it('accepte un mot de passe conforme', () => {
    expect(isStrongPassword('CodeQuest2026!')).toBe(true);
  });

  it('refuse moins de 12 caractères', () => {
    expect(PASSWORD_MIN_LENGTH).toBe(12);
    expect(isStrongPassword('Abcdef1!')).toBe(false);
  });

  it('refuse sans minuscule, sans majuscule ou sans chiffre/symbole', () => {
    expect(isStrongPassword('CODEQUEST2026!')).toBe(false);
    expect(isStrongPassword('codequest2026!')).toBe(false);
    expect(isStrongPassword('CodeQuestOnly!')).toBe(true);
  });

  it('refuse sans chiffre ni symbole', () => {
    expect(isStrongPassword('CodeQuestOnly')).toBe(false);
  });

  it('accepte exactement la longueur minimale', () => {
    expect(isStrongPassword('Abcdefghij1!')).toBe(true);
  });
});
