# Portfolio de Florian TAESCH-WOLFFER

Site statique fait avec [Astro](https://astro.build), publié sur GitHub Pages :
**https://flopignolesque.github.io**

- Contenu en français (`/fr/`) et en anglais (`/en/`), `/` redirige vers `/fr/`.
- Aucune base de données, aucun serveur : tout est généré en fichiers HTML au moment du build.

---

## 1. Lancer le site en local

Il faut **Node.js 22.23 ou plus** (`node -v` pour vérifier).

```bash
npm install        # une seule fois (et après chaque mise à jour des dépendances)
npm run dev        # site en local sur http://localhost:4321, rechargé à chaque modification
```

Avant de publier, vérifier que tout compile :

```bash
npm run build      # vérifie les types et génère le site dans dist/
npm run preview    # affiche la version générée (celle qui sera en ligne)
```

> En mode `dev`, la Content Security Policy n'est pas active (Vite a besoin de scripts inline).
> Pour tester la sécurité réelle, utiliser `npm run build` puis `npm run preview`.

---

## 2. Où est quoi

```
src/
  content/                  ← TOUT LE CONTENU (à modifier sans toucher au code)
    projects/fr/*.md        projets en français (un fichier par projet)
    projects/en/*.md        les mêmes en anglais (même nom de fichier)
    parcours.json           timeline du parcours
    competences.json        compétences par domaine
    apprentissage.json      "J'apprends en ce moment"
    atouts.json             certifications et soft skills
    passions.json           passions
  i18n/
    fr.ts / en.ts           textes de l'interface (menus, boutons, accueil, terminal...)
  data/site.ts              mail, GitHub, LinkedIn, chemins des CV
  styles/global.css         couleurs, polices, effets
  pages/                    les pages (une par URL)
  components/               morceaux réutilisés (menu, cartes, terminal...)
  scripts/                  JavaScript : animations, shader, terminal, curseur
public/                     fichiers copiés tels quels (CV, polices, images, security.txt)
```

---

## 3. Modifier un texte

| Je veux changer...                              | Fichier                                   |
| ----------------------------------------------- | ----------------------------------------- |
| Le bandeau du haut, l'accueil, les boutons      | `src/i18n/fr.ts` **et** `src/i18n/en.ts`  |
| Un projet                                       | `src/content/projects/fr/<projet>.md` (+ `en/`) |
| Le parcours                                     | `src/content/parcours.json`               |
| Les compétences                                 | `src/content/competences.json`            |
| Les passions                                    | `src/content/passions.json`               |
| Mail, GitHub, LinkedIn                          | `src/data/site.ts`                        |

Dans les fichiers JSON, chaque texte existe en deux versions :

```json
"title": { "fr": "Réseau", "en": "Networking" }
```

Le champ `"order"` fixe l'ordre d'affichage (1 = en premier).

**Niveaux de compétence** (`competences.json`) : `"solide"`, `"aise"` (À l'aise) ou `"notions"`.

**J'apprends en ce moment** (`apprentissage.json`) : une ligne n'apparaît sur le site que si son
`"status"` vaut `"en cours"` ou `"terminé"`. Avec `"prévu"`, elle reste cachée. Si aucune ligne
n'est visible, toute la section est masquée.

**Les `[TODO ...]`** : tout texte qui contient `[TODO` s'affiche en jaune sur le site pour ne pas
l'oublier. Il suffit de le remplacer par le vrai texte. Pour retrouver ceux qui restent :

```bash
grep -rn "TODO" src/content src/i18n src/data
```

Après une modification : `npm run dev` pour voir le résultat, `npm run build` pour vérifier qu'il n'y a pas d'erreur.
Si un champ est mal écrit (faute dans un nom, guillemet oublié), le build affiche le fichier et la ligne en cause.

---

## 4. Ajouter un projet

1. Copier `src/content/projects/fr/reseau-vlan.md` en `src/content/projects/fr/mon-projet.md`.
   Le nom du fichier devient l'URL : `/fr/projets/mon-projet/`.
2. Remplir l'en-tête :

   ```yaml
   ---
   title: Mon projet
   tagline: Une phrase qui dit ce que c'est.
   kind: Projet perso          # ou "SAE, BUT R&T"...
   year: "2027"
   tags: [Python, Docker]
   order: 7                    # position dans la liste
   featured: false             # true = affiché sur l'accueil (3 max)
   links:
     demo: "https://..."       # optionnel
     github: "https://github.com/flopignolesque/..."
   ---
   ```

3. Écrire le texte en Markdown en dessous, avec des sections `## Contexte`, `## Ce que j'ai fait`,
   `## Difficultés`, `## Ce que j'ai appris`.
4. Faire la même chose dans `src/content/projects/en/mon-projet.md` (**même nom de fichier**).

Le projet apparaît automatiquement dans la liste, dans le terminal (`ls projects`) et dans le sitemap.

### Section "Audit de sécurité" (Nocturne)

Dans `src/content/projects/fr/nocturne.md` (et `en/`), passer `visible` à `true` et remplir les failles :

```yaml
audit:
  visible: true
  intro: "J'audite Nocturne moi-même : ce que j'ai trouvé, et comment je l'ai corrigé."
  findings:
    - title: "Pas de limite sur l'envoi de messages"
      severity: moyenne          # critique | haute | moyenne | faible
      fixed: true
      description: "Ce qui se passait, comment je l'ai trouvé, comment je l'ai corrigé."
```

---

## 5. Modifier le CV

Les CV sont des fichiers Word modifiables dans `cv-source/` :

```
cv-source/CV_Florian_TAESCH-WOLFFER_FR.docx
cv-source/CV_Florian_TAESCH-WOLFFER_EN.docx
cv-source/photo.png          (photo recadrée)
```

1. Ouvrir le `.docx` dans Word, modifier.
2. **Fichier → Enregistrer sous → PDF**, dans `public/cv/`, avec exactement ce nom :
   `CV_Florian_TAESCH-WOLFFER_FR.pdf` (ou `_EN.pdf`).
3. Commit + push : le site est mis à jour.

⚠️ Ces versions sont publiques : **pas de numéro de téléphone ni d'adresse complète**.
Les versions « candidature » avec téléphone sont hors du dépôt, dans `Documents\CV\`.

**Règles pour passer les logiciels de tri (ATS)** : garder une seule colonne, des titres de
section standards (Profil, Compétences, Projets, Formation, Expérience...), du vrai texte
(jamais de texte dans une image ou une zone de texte), pas de tableau pour la mise en page,
et reprendre les mots-clés exacts de l'offre (VLAN, Linux, Windows Server...) quand c'est vrai.

## 6. Changer la couleur d'accent

Une seule ligne, en haut de `src/styles/global.css` :

```css
--color-accent: #5cffb0;
```

Le shader du fond de l'accueil lit automatiquement cette couleur. Seule l'image de partage
(`public/og/`) est à régénérer (voir plus bas).

---

## 7. Déployer

Le site se publie **tout seul** à chaque `git push` sur la branche `main`
(fichier `.github/workflows/deploy.yml`). Le workflow :

1. installe les dépendances,
2. lance `npm audit` : **le déploiement échoue s'il y a une faille haute ou critique** dans une dépendance,
3. vérifie les types et génère le site,
4. publie `dist/` sur GitHub Pages.

### Première mise en ligne

1. Créer sur GitHub un dépôt public nommé exactement **`flopignolesque.github.io`**.
2. Dans le dossier du projet :

   ```bash
   git init
   git add .
   git commit -m "Premier commit"
   git branch -M main
   git remote add origin https://github.com/flopignolesque/flopignolesque.github.io.git
   git push -u origin main
   ```

3. Sur GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
4. Suivre le déploiement dans l'onglet **Actions**. Le site est en ligne en 1 à 2 minutes.

### En cas d'échec de `npm audit`

```bash
npm audit            # voir le détail
npm update           # mettre à jour dans les versions compatibles
npm run build        # vérifier que tout marche encore
```

---

## 8. Sécurité du site

Détaillée sur la page **Sous le capot** (`src/content/projects/fr/sous-le-capot.md`). En bref :

- Content Security Policy en balise `<meta>` (production uniquement) : scripts, styles, images,
  polices **uniquement depuis le site**, aucun script ni style inline. Dans `src/layouts/Base.astro`.
  Si un jour il faut un service externe (ex : Formspree pour un formulaire), l'ajouter dans la CSP
  (`form-action` et `connect-src`).
- Le build est configuré pour ne jamais produire de script ou de style inline (`astro.config.mjs`).
  Ne pas utiliser d'attribut `style="..."` dans les pages : il serait bloqué par la CSP.
- Liens externes en `rel="noopener noreferrer"` (automatique dans le Markdown).
- Le mail n'est jamais écrit en clair dans le HTML : il est encodé (`src/data/site.ts`) et
  reconstruit par JavaScript. Sans JavaScript, il s'affiche sous la forme `... [at] gmail [point] com`.
- `public/.well-known/security.txt` : **date `Expires` à repousser avant le 23/11/2027**.

---

## 9. Animations et performances

- `prefers-reduced-motion` activé : aucune animation, aucun JavaScript d'animation téléchargé.
- GSAP + Lenis (~56 Ko gzip) ne sont chargés que si les animations sont autorisées.
- Le shader WebGL (~14 Ko gzip) se charge après l'affichage sur desktop, au premier toucher sur
  mobile. Il se met en pause hors écran / onglet caché, et n'est pas lancé sans GPU.
- Le terminal (~2 Ko gzip) se charge à sa première ouverture (`²`, `/` ou bouton en bas à droite).

Attributs d'animation utilisables dans les pages (détails dans `src/scripts/motion.ts`) :
`data-reveal`, `data-reveal="lines"`, `data-reveal-group`, `data-scramble`, `data-scramble-view`, `data-count`.
**Ne jamais mettre `data-reveal` sur ce qui est visible dès l'arrivée** (titre, intro) :
l'élément reste caché jusqu'au chargement du JavaScript, ce qui ralentit l'affichage (LCP).

---

## 10. Image de partage (Open Graph)

`public/og/og-fr.png` et `og-en.png` (1200×630) s'affichent quand le lien est partagé
(LinkedIn, Discord...). Modèle : `tools/og/og.html`.
Pour la régénérer : ouvrir `tools/og/og.html?lang=fr` dans Chrome, F12 → mode appareil →
dimensions 1200×630 → menu ⋮ → « Capture d'écran », puis pareil avec `?lang=en`.

---

## 11. Polices

Geist Sans et Geist Mono (Vercel, licence SIL OFL), auto-hébergées dans `public/fonts/`
(sous-ensemble latin, accents français compris).
