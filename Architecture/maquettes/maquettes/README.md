# CodeQuest — Kit de maquettes

Maquettes HTML/CSS statiques de **CodeQuest**, la plateforme de défis informatiques décrite dans
`../Spécification fonctionnelle et technique – Plateforme de défis informatiques.pdf`.

L'objectif est de disposer d'un langage visuel et de vingt écrans cohérents, prévisualisables
immédiatement, avant l'implémentation React / TypeScript / Tailwind.

## Prévisualiser

Le plus simple :

```bash
cd maquettes
python3 -m http.server 8080
```

Puis ouvrir <http://localhost:8080>.

L'ouverture directe de `index.html` fonctionne aussi pour la galerie, mais un serveur local est
recommandé pour les iframes et le chargement des polices.

## Arborescence

```text
maquettes/
├── index.html                 Galerie des 20 écrans (aperçus en iframes)
├── design-system.html         Tokens, composants, accessibilité, mapping Tailwind
├── README.md
├── assets/
│   ├── css/app.css            Design system complet et styles des écrans
│   └── js/app.js              Layout injecté, icônes, thème, interactions simulées
└── pages/
    ├── accueil.html
    ├── connexion.html
    ├── inscription.html
    ├── mot-de-passe-oublie.html
    ├── didacticiel.html
    ├── defis.html
    ├── defi-tri.html
    ├── defi-debogage.html
    ├── defi-decryptage.html
    ├── defi-visuel.html
    ├── classements.html
    ├── equipes.html
    ├── evenements.html
    ├── boss.html
    ├── lore.html
    ├── profil.html
    ├── boutique.html
    ├── chat.html
    ├── admin.html
    └── etats.html
```

## Carte des écrans

| # | Écran | Parcours | Points couverts |
|---|-------|----------|-----------------|
| 01 | `accueil.html` | Public | Promesse, régions, défis, progression, preuve sociale, appels à l'action |
| 02 | `connexion.html` | Public | E-mail / mot de passe, erreurs, mot de passe oublié, création de compte |
| 03 | `inscription.html` | Public | Pseudo, e-mail, mot de passe, consentement, validation |
| 04 | `mot-de-passe-oublie.html` | Public | Demande de réinitialisation et confirmation neutre |
| 05 | `didacticiel.html` | Joueur | Leçon guidée, étapes, éditeur, validation, progression |
| 06 | `defis.html` | Joueur | Catalogue, recherche, filtres thème / difficulté / statut / type |
| 07 | `defi-tri.html` | Joueur | Énoncé, éditeur, tests visibles, exécution, soumission, indices |
| 08 | `defi-debogage.html` | Joueur | Code défectueux, journal, tests, correction |
| 09 | `defi-decryptage.html` | Joueur | Message chiffré, clé de lore, indices progressifs |
| 10 | `defi-visuel.html` | Joueur | QR fragmenté, stéganographie, inspection d'image |
| 11 | `classements.html` | Joueur | Podium, classement global, filtres, rangs personnels |
| 12 | `equipes.html` | Joueur | Équipe, membres, rôles, invitations, pool de PV partagé |
| 13 | `evenements.html` | Joueur | Event à essai unique, chronomètre, récompenses, état |
| 14 | `boss.html` | Joueur | Barre de PV, phases, sous-défis, potions, KO |
| 15 | `lore.html` | Joueur | Chapitres, carte des régions, lexique, fragments, reprise de lecture |
| 16 | `profil.html` | Joueur | Progression, badges, historique, sessions, préférences, RGPD |
| 17 | `boutique.html` | Joueur | Catalogue en Bits, inventaire, registre idempotent, achat |
| 18 | `chat.html` | Joueur | Canaux, messages, signalement, modération, salon vocal simulé |
| 19 | `admin.html` | Admin | KPI, file d'exécution, CRUD défis, utilisateurs, signalements, audit |
| 20 | `etats.html` | Système | E-mail non confirmé, suspension, KO, event fermé, erreurs 400/500, offline |

`index.html` regroupe ces écrans avec des iframes. `design-system.html` documente les fondations
et les composants réutilisables.

## Direction artistique

- **Thème** : Minimaliste sombre & sobre (« Dark Monochrome & Neutral »), fond noir/zinc profond par défaut, mode clair optionnel.
- **Typographies** : Inter pour l'interface et les titres, JetBrains Mono pour le code et les données techniques.
- **Couleurs** : Blanc pur pour l'action principale, accents sémantiques discrets (émeraude pour le succès, ambre pour les avertissements et Bits, rouge pour le danger et PV, bleu ciel pour le code et liens).
- **Surfaces** : Noir profond (`#09090b`) et surfaces zinc (`#141417`, `#1b1b1f`), bordures fines nettes `1px solid rgba(255, 255, 255, 0.08)`, suppression des halos et scanlines.
- **Iconographie** : icônes SVG au trait, jamais d'emoji comme icône structurelle.

Les tokens sont des variables CSS (`--bg`, `--surface`, `--text`, `--primary`, `--space-*`, `--radius-*`, `--font-*`). Le mode clair est obtenu avec `[data-theme="light"]`.

## Conventions de structure

Les pages publiques utilisent le squelette injecté :

```html
<body data-root="../" data-page="accueil" data-layout="public">
  <header class="topbar" data-topbar></header>
  <main id="main">…</main>
  <footer class="site-footer" data-footer></footer>
  <script src="../assets/js/app.js"></script>
</body>
```

Les pages de l'espace joueur utilisent :

```html
<body data-root="../" data-page="defis" data-layout="app">
  <div class="app-layout">
    <aside class="sidebar" data-sidebar></aside>
    <div class="app-main">
      <header class="app-topbar" data-topbar></header>
      <main id="main" class="page">…</main>
    </div>
  </div>
  <script src="../assets/js/app.js"></script>
</body>
```

`app.js` injecte la topbar, la sidebar et le footer selon `data-layout`, puis hydrate les icônes.
Les pages admin ajoutent `data-admin="true"` pour afficher le lien back-office.

## Interactions simulées

Toutes les actions sont locales et sans backend :

- bascule de thème persistée dans `localStorage` ;
- onglets accessibles au clavier (flèches gauche/droite) et liens `data-tab-target` ;
- filtres du catalogue avec `data-filter-key`, `data-challenge-card` et compteur ;
- éditeur avec numéros de ligne, bouton « Exécuter » et « Soumettre » simulés ;
- chat : envoi d'un message, ajout immédiat dans le fil ;
- modales : fermeture par bouton, clic sur le fond ou `Échap`, focus piégé puis restauré ;
- confirmation d'incident désactivée tant que la case d'acceptation n'est pas cochée ;
- notifications éphémères via `data-toast` et `data-toast-type` ;
- compte à rebours via `data-countdown` ;
- copie dans le presse-papiers via `data-copy`.

Les montants, scores, noms, messages et statuts sont fictifs.

## Accessibilité

- Lien d'évitement « Aller au contenu » sur chaque page.
- Structure de titres hiérarchisée, régions `header`, `nav`, `main`, `aside`, `footer`.
- Focus visible, cibles interactives d'au moins 44 px sur mobile.
- Libellés explicites, `aria-label`, `aria-current`, `aria-expanded`, `aria-live`.
- Onglets avec rôles ARIA et navigation aux flèches.
- Modales avec `role="dialog"` / `role="alertdialog"`, focus piégé et fermeture par `Échap`.
- Information jamais portée uniquement par la couleur.
- Prise en charge de `prefers-reduced-motion`.
- Contrastes visés : WCAG 2.1 AA.

## Passage vers React / TypeScript / Tailwind

Le design system est volontairement structurel, pas dépendant d'un framework :

- les tokens CSS deviennent des couleurs / espacements Tailwind dans `tailwind.config` ;
- les blocs `.panel`, `.card`, `.badge`, `.btn`, `.field`, `.table-wrap` correspondent à des
  composants React (`Panel`, `Card`, `Badge`, `Button`, `Field`, `DataTable`) ;
- les pages sont des compositions de layouts (`PublicLayout`, `AppLayout`, `AdminLayout`) ;
- les données fictives sont à remplacer par des appels API typés ;
- les interactions de `app.js` deviennent des hooks ou des composants contrôlés.

Le fichier `design-system.html` détaille les tokens, les variantes de boutons, les états de
formulaires, les badges, les cartes et les règles d'accessibilité.

## Limites assumées

- Aucune exécution réelle de code : le runner, les tests et les scores sont simulés.
- Aucun backend, aucune authentification réelle, aucun paiement.
- Le chat vocal est représenté mais non fonctionnel (phase tardive de la spécification).
- Les iframes de la galerie sont des aperçus ; les pages complètes s'ouvrent avec « Ouvrir ».
- Les données de jeu (Bits, PV, XP, classements) sont statiques.

## Vérifications rapides

```bash
# Servir les maquettes
python3 -m http.server 8080

# Vérifier que toutes les pages répondent
for f in index.html design-system.html pages/*.html; do
  curl -s -o /dev/null -w "%{http_code} $f\n" "http://localhost:8080/$f"
done
```
