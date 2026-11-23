---
title: Ce site (sous le capot)
tagline: Le portfolio est aussi un projet. Stack, perfs et sécurité.
kind: Projet perso
year: "2026"
tags: [Astro, TypeScript, Tailwind, GSAP, WebGL, CSP]
order: 6
featured: false
links:
  github: "https://github.com/flopignolesque/flopignolesque.github.io"
---

## Stack

- **Astro**, en sortie 100 % statique. Aucune page n'a besoin d'un serveur.
- **TypeScript** et **Tailwind CSS**.
- **GSAP** pour les animations (texte qui se déchiffre, révélations au scroll), **Lenis** pour le scroll fluide.
- Un seul shader **WebGL** (OGL) pour le fond de l'accueil.
- Le contenu (projets, parcours, compétences, passions) est rangé dans des fichiers Markdown et JSON. Je modifie un texte sans toucher au code.
- Hébergé sur **GitHub Pages**, déployé par GitHub Actions à chaque push.

## Perfs

- Le JavaScript des animations n'est chargé que si le système n'a pas demandé à réduire les animations. Le shader n'est chargé qu'après le premier affichage, et le terminal seulement à sa première ouverture.
- Le shader se met en pause quand il sort de l'écran ou quand l'onglet est caché. Résolution limitée (DPR 1.5 max, 1 sur mobile).
- Avec `prefers-reduced-motion`, zéro mouvement : tout le contenu est affiché directement.
- Polices auto-hébergées, avec une police de secours aux mêmes proportions pour éviter que la page saute au chargement.
- Les animations ne touchent qu'à `transform` et `opacity`.

## Sécurité

- **Content Security Policy** stricte (en balise meta, GitHub Pages ne permet pas d'envoyer des en-têtes) : scripts et styles uniquement depuis le site lui-même, aucun script inline, pas d'`unsafe-inline`, pas d'`eval`.
- Zéro script tiers, zéro tracking, zéro cookie.
- Tous les liens externes en `rel="noopener noreferrer"`.
- Aucun secret dans le dépôt. `npm audit` lancé à chaque build dans la CI : le déploiement échoue s'il y a une vulnérabilité haute.
- Adresse mail absente du HTML (reconstruite au clic), pas de numéro de téléphone.
- Un fichier [`/.well-known/security.txt`](/.well-known/security.txt) (RFC 9116) indique où signaler une faille.
