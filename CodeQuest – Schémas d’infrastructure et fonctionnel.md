# CodeQuest — Schémas d’architecture

Basés sur la spécification v1.0 du 23 octobre 2026 (sections 5, 8, 9, 10, 11, 14). 1) Infrastructure finale, 2) Schéma fonctionnel.

[1. Infrastructure](#infra)[Flux](#flux)[2. DFD](#dfd)[3. Fonctionnel](#fonc)

## 1 · Schéma d’infrastructure (réseau, flux, audit)

Un seul serveur Docker Compose au départ (section 11.1), runners sur hôte dédié (section 8). LiveKit est exposé directement en UDP : WebRTC ne passe pas par Nginx.

Flux applicatifFlux secondaire / voixFlux runner (TLS, ACL)Audit, logs, sauvegardes

## Table des flux et points d’audit

| # | Source → destination | Port / protocole | Contenu | Sécurité & audit |
| --- | --- | --- | --- | --- |
| 1 | Navigateur → Edge | 443 TCP HTTPS/WSS | REST JSON, cookies HttpOnly, frames Socket.IO | TLS, HSTS, rate limit IP + compte, Fail2ban |
| 2 | Edge → Nginx | 443 → TCP 8443 interne | Requêtes filtrées | Seul point d’entrée de la DMZ |
| 3 | Nginx → API | TCP 3000 | DTO, Idempotency-Key, JWT 15 min | Garde RBAC sur chaque route ; WS fermé à la révocation de session |
| 4 | API → PostgreSQL | TCP 5432 | Transactions : score, ledger, PV, audit_logs | Requêtes paramétrées ; ledger et audit en insertion seule (UPDATE/DELETE révoqués) |
| 5 | API → Redis cache | TCP 6379 | Sessions, ZSET classements, quotas | TTL ; reconstruit depuis PostgreSQL |
| 6 | API → Redis BullMQ | TCP 6380 TLS | Job : code, langage, ref de test chiffré | Pattern outbox, AOF, noeviction |
| 7 | Runner ↔ Redis BullMQ | TCP 6380 TLS + ACL | Prise du job, résultats, temps CPU | Le runner n’accède qu’à la file « execution » |
| 8 | Daemon → sandbox | IPC local runsc | Code + tests cachés | --net=none ; abus détecté → sanction + audit_logs |
| 9 | API → Assets → MinIO | TCP 8443 mTLS, puis 9000 | Seed, image / QR générés | Certificats mutuels, clés S3 en Docker secrets |
| 10 | Navigateur ↔ LiveKit | 7880 TCP, 50000-60000 UDP | Signalisation + média | DTLS-SRTP ; jetons de salon signés par l’API |

**Audit.** Actions d’administration, changements de rôle, sanctions, sessions révoquées et abus runner écrits dans `audit_logs` (acteur, action, cible, métadonnées, date), dans la même transaction que l’action. Table en insertion seule et visible via `/admin/audit-logs`. Les logs applicatifs sont structurés, masqués et conservés 12 mois.

## 2 · Diagramme de flux de données (DFD niveau 1)

Vue complémentaire : qui échange quelle donnée avec quel processus, et où elle est stockée. Les entités externes sont en ocre, les processus en vert, les magasins de données en bleu. L’exécution du code non fiable est isolée dans le cadre rouge.

**Lecture.** Le runner n’a aucun lien direct avec l’API ni avec PostgreSQL : il ne parle qu’à la file Redis. P5 lit les résultats dans cette file, puis écrit scores, Bits et audit dans une seule transaction.

## 3 · Schéma fonctionnel

Lettres des acteurs : **V** Visiteur · **J** Joueur · **C** Capitaine (rôle contextuel d’équipe) · **M** Modérateur · **A** Administrateur. Le pipeline de soumission relie les domaines ; l’audit est transversal.

**Règles métier à ne pas perdre.** Un event n’autorise qu’un essai, et une fermeture du navigateur le consomme. Les PV ne baissent que sur boss et events « hardcore ». Les objets achetables n’augmentent jamais les scores. Un capitaine supprimé voit sa capitainerie transférée automatiquement.