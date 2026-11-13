# Rapport Task 1 — Contrat partagé et politique de mot de passe

## Implémentation

L’implémentation issue du commit `9d8c988` ajoute le contrat partagé d’authentification :

- `PASSWORD_MIN_LENGTH` fixé à 12 ;
- `PASSWORD_POLICY_MESSAGE` en français ;
- `isStrongPassword` ;
- les interfaces `AuthUser` et `AuthResponse`.

## Correction demandée par la revue

La revue a identifié que `isStrongPassword` exigeait à tort un chiffre avec `/[0-9]/`. La politique exige un chiffre **ou** un symbole. La validation utilise désormais `/[^A-Za-z]/`, et le JSDoc décrit correctement cette règle.

Les tests couvrent également :

- un mot de passe contenant un symbole sans chiffre (`CodeQuestOnly!`) ;
- un mot de passe sans chiffre ni symbole (`CodeQuestOnly`) ;
- la longueur minimale exacte de 12 caractères.

## Tests

- RED capturé après l’ajout des tests de correction, avant le changement de production : 1 test échouait (`CodeQuestOnly!` reçu `false`, attendu `true`), 4 tests passaient.
- GREEN : `corepack pnpm@9 vitest run packages/shared/src/auth.spec.ts` — 1 fichier, 5 tests passés.
- Build : `corepack pnpm@9 --filter @codequest/shared run build` — succès (`tsc`).

Le RED de l’implémentation initiale du commit `9d8c988` n’a pas été capturé dans cette session.

## Fichiers

- `packages/shared/src/index.ts` — correction de la politique et de son JSDoc.
- `packages/shared/src/auth.spec.ts` — assertion corrigée et cas de couverture ajoutés.
- `.superpowers/sdd/2026-11-13-auth-login/task-1-report.md` — présent rapport.

## Auto-revue et préoccupations

- La modification est limitée au contrat et aux tests concernés.
- Les caractères non ASCII sont acceptés comme symbole par le contrat `/[^A-Za-z]/`, conformément au comportement demandé.
- Aucun autre fichier utilisateur préexistant n’a été modifié.
- La suite complète n’a pas été demandée par la revue ; seule la suite ciblée et le build partagé ont été exécutés.
