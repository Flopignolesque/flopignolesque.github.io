# Rapport de livraison : portfolio

Mesures du 24/11/2026 sur le build de production (`npm run build` puis `npm run preview`), Chrome 158, Lighthouse en local.

## 1. Lighthouse

Scores : Performance / Accessibilité / Bonnes pratiques / SEO.

| Page | Mobile | LCP mobile | Desktop | LCP desktop |
|---|---|---|---|---|
| `/fr/` | 100 / 100 / 100 / 100 | 0,9 s | 100 / 100 / 100 / 100 | 0,3 s |
| `/en/` | 100 / 100 / 100 / 100 | 0,9 s | 100 / 100 / 100 / 100 | 0,3 s |
| `/fr/projets/` | 100 / 100 / 100 / 100 | 0,9 s | 100 / 100 / 100 / 100 | 0,3 s |
| `/fr/projets/nocturne/` | 100 / 100 / 100 / 100 | 0,9 s | 100 / 100 / 100 / 100 | 0,3 s |
| `/fr/projets/sous-le-capot/` | 100 / 100 / 100 / 100 | 0,9 s | 100 / 100 / 100 / 100 | 0,3 s |
| `/fr/parcours/` | 99 / 100 / 100 / 100 | 1,6 s | 100 / 100 / 100 / 100 | 0,4 s |
| `/fr/competences/` | 100 / 100 / 100 / 100 | 0,9 s | 100 / 100 / 100 / 100 | 0,3 s |
| `/fr/passions/` | 100 / 100 / 100 / 100 | 0,9 s | 100 / 100 / 100 / 100 | 0,4 s |
| `/fr/contact/` | 100 / 100 / 100 / 100 | 0,9 s | 100 / 100 / 100 / 100 | 0,5 s |
| `/fr/mentions-legales/` | 100 / 100 / 100 / 100 | 0,9 s | 100 / 100 / 100 / 100 | 0,4 s |
| `/en/projets/`, `/en/parcours/`, `/en/competences/`, `/en/passions/`, `/en/contact/` | 99 à 100 / 100 / 100 / 100 | 0,9 à 1,7 s | 100 / 100 / 100 / 100 | 0,3 à 0,5 s |
| `/404.html` | 100 / 100 / 100 / **63** | 0,9 s | 100 / 100 / 100 / **63** | 0,3 s |

- CLS : 0 sur toutes les pages (0,001 sur la 404). TBT mobile : 70 ms maximum.
- Le SEO à 63 de la 404 est normal : la page est volontairement en `noindex`.
- Mesures faites en local. Une fois en ligne, GitHub Pages ajoute la latence réseau : à revérifier sur l'URL finale avec PageSpeed Insights.

## 2. Poids JavaScript

| Fichier | Quand il est chargé | gzip |
|---|---|---|
| `js/motion-flag.js` | toujours (bloquant dans le `<head>`) | 0,4 Ko |
| script principal (`Base…js`) | toujours | 2,0 Ko |
| `motion…js` (GSAP, ScrollTrigger, SplitText, ScrambleText, Lenis) | si les animations sont autorisées | 56,2 Ko |
| `cursor…js` | desktop avec souris seulement | 0,6 Ko |
| `shader…js` (OGL + shader) | accueil uniquement. Desktop : après l'affichage. Mobile : au premier toucher | 14,5 Ko |
| `terminal…js` + `/fr/terminal.json` | à la première ouverture du terminal | 2,2 Ko + ~1,5 Ko |

JS initial par page :
- Desktop : ≈ 59 Ko gzip (budget : 100 Ko).
- Mobile : ≈ 58,6 Ko gzip.
- Avec `prefers-reduced-motion` : 2,4 Ko.

CSS : 8,8 Ko gzip. Polices : 2 fichiers préchargés de 33 Ko chacun.

## 3. Vérifications faites

- `astro check` : 0 erreur, 0 warning. `astro build` : 28 pages, aucun warning. `npm audit` : 0 vulnérabilité.
- HTML généré : **aucun** `<script>` inline, **aucun** `<style>` inline, **aucun** attribut `style=`. La CSP `script-src 'self'; style-src 'self'` passe sans violation (console vide sur les 16 pages testées, desktop et mobile).
- Adresse mail absente de tout le HTML (reconstruite au clic). Seul `security.txt` la contient en clair, comme demandé.
- Pas de défilement horizontal, testé en 390 px et en 1440 px sur les 16 pages.
- Terminal testé : `²` et `/` ouvrent, `help`, `whoami`, `ls projects`, `skills`, `contact` (copie dans le presse-papier), `sudo hire-me`, `nmap florian`, commande inconnue, Tab (`cd noc` → `cd nocturne`), flèche ↑ (historique), Échap ferme.
- `prefers-reduced-motion` : aucun JS d'animation téléchargé, tout le contenu visible directement.
- Menu mobile plein écran : OK.
- `dist/` contient bien `.nojekyll`, `.well-known/security.txt`, `og/og-fr.png` et `og/og-en.png`.

## 4. Captures

Dans `lighthouse/shots/` (dossier ignoré par git) : 32 captures pleine page, `mobile-*.png` (390 px) et `desktop-*.png` (1440 px), pour les 16 pages. S'y ajoutent `desktop-terminal.png`, `mobile-menu.png` et `mobile-reduced-motion-parcours.png`.
Les rapports Lighthouse complets (JSON) sont dans `lighthouse/`.

## 5. Choix techniques à connaître

- **Moteur Markdown** : Astro 7 utilise désormais Sätteri. Un petit plugin (`src/lib/markdown-site.mjs`) ajoute `noopener noreferrer` aux liens externes et surligne les `[TODO]`.
- **Transitions de page** : View Transitions natives du navigateur (CSS `@view-transition`), sans le routeur JS d'Astro. 0 Ko de JS en plus, et changement instantané si le navigateur ne les gère pas.
- **Workflow** : écrit en clair plutôt qu'avec `withastro/action`, pour lancer `npm audit` avant le build et garder `.well-known/` dans l'archive publiée.
- **Shader** : non lancé sans GPU (rendu logiciel) ; sur mobile, demi-résolution et 30 images/s.
- **Effet de déchiffrement** : seulement sur les textes d'une seule ligne. Sur un titre de plusieurs lignes, il faisait sauter la page (CLS).
- **URLs** : mêmes chemins dans les deux langues (`/en/projets/`, `/en/parcours/`...), comme listé dans le brief.

## 6. TODO restants

Repérables sur le site (texte jaune) et avec `grep -rn "TODO" src`.

**À fournir**
1. `public/cv/CV_Florian_TAESCH-WOLFFER_FR.pdf` et `..._EN.pdf` (sans téléphone ni adresse). Tant qu'ils manquent, les boutons CV mènent à une 404.
2. Rythme de l'alternance : bandeau du haut, `src/i18n/fr.ts` et `en.ts` (`banner.items`).
3. Lien LinkedIn : `src/data/site.ts`.
4. Profil TryHackMe : `src/content/atouts.json`.
5. Autres qualités (soft skills, avec une preuve) : `src/content/atouts.json`.
6. Date du job chez Auchan : `src/content/parcours.json`.

**Projets** (`src/content/projects/fr/` et `en/`)
7. Nocturne : lien démo, lien GitHub, nombre d'utilisateurs testeurs.
8. Nocturne : section « Audit de sécurité » à rédiger, puis `audit.visible: true`.
9. Sécurisation d'une appli web : lien.
10. Réseau VLAN : schéma ou capture Packet Tracer.
11. Environnements systèmes : détails (services, distributions, difficultés).
12. Portfolio SAE14 : lien.

**Autres**
13. Passions → widget « En écoute » : titre du morceau (`src/i18n/fr.ts` et `en.ts`, `passions.nowPlayingTrack`).
14. « J'apprends en ce moment » : toutes les lignes sont en `"prévu"`, donc **la section est masquée**. Passer à `"en cours"` ou `"terminé"` celles qui le sont (`src/content/apprentissage.json`).

**À relire / vérifier**
15. Stack de Nocturne (bcrypt, JWT en cookie httpOnly, TOTP, passkeys, WebRTC + Socket.io, PostgreSQL/Prisma, Zod, Helmet, rate limiting, captcha) : remplie à partir du code de Nocturne (`d:\Projets\floxe`), pas inventée. À relire quand même.
16. Années des projets : 2026 pour Nocturne et les SAE R&T, 2024-2025 pour les SAE MMI. Déduites du parcours, à confirmer.
17. Le lien GitHub de « Sous le capot » pointe vers `github.com/flopignolesque/flopignolesque.github.io` : le dépôt doit être public.
18. `security.txt` : champ `Expires` au 23/11/2027, à repousser chaque année.
