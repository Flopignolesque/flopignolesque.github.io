---
title: Nocturne
tagline: Un réseau social type Discord, développé seul en 3 mois.
kind: Projet perso
year: "2026"
tags: [React, Node.js, TypeScript, Socket.io, WebRTC, PostgreSQL, Prisma]
order: 1
featured: true
links:
  demo: "[TODO lien démo]"
  github: "[TODO lien GitHub]"
audit:
  # Passer à true quand l'audit est rédigé : la section apparaîtra sur la page.
  visible: false
  intro: "J'audite Nocturne moi-même : ce que j'ai trouvé, et comment je l'ai corrigé."
  findings: []
---

## Contexte

Je voulais savoir si j'étais capable de construire une vraie appli temps réel, de bout en bout, sans tuto à suivre. J'ai pris Discord comme modèle : des serveurs, des salons texte et vocaux, des messages privés.

## Ce que j'ai fait

- **Front** en React (Vite, Tailwind), **back** en Node.js / Express écrit en TypeScript.
- **Comptes utilisateurs** : mots de passe hachés avec bcrypt, session par JWT dans un cookie `httpOnly`, révocation de toutes les sessions d'un coup.
- **Double authentification** (TOTP + codes de secours) et connexion par **passkey** (WebAuthn).
- **Système d'amis** et **messagerie** temps réel avec Socket.io.
- **Salons vocaux** en WebRTC, la signalisation passe par Socket.io. Suppression du bruit du micro directement dans le navigateur (modèle DeepFilterNet3).
- **Base de données** PostgreSQL via Prisma.
- Permissions par rôle et par salon, stockées en bitmask, panel d'administration et modération.
- Côté sécu : validation de toutes les entrées avec Zod, en-têtes HTTP avec Helmet, limitation du nombre de requêtes, captcha à l'inscription.

Testé par [TODO nb d'utilisateurs testeurs] personnes.

## Difficultés

- Le vocal : faire passer l'audio entre navigateurs (WebRTC, ICE, NAT) et garder une présence fiable quand quelqu'un coupe sa connexion.
- Les permissions : un rôle, un salon, des exceptions par salon. Il faut une règle de priorité claire, sinon on ouvre des accès par erreur.
- Tout faire seul : back, front, base de données, déploiement.

## Ce que j'ai appris

- Comment fonctionne une authentification moderne, et pourquoi chaque couche existe.
- Le temps réel : rooms, présence, reconnexions.
- Qu'une appli qui marche n'est pas une appli sûre. D'où l'audit en cours.
