---
title: Sécurisation d'une application web
tagline: Un site avec connexion, messagerie et boutique, protégé contre l'injection SQL.
kind: SAE, BUT MMI
year: "2024-2025"
tags: [PHP, SQL, Sécurité web, HTML/CSS]
order: 2
featured: true
links:
  demo: "[TODO lien]"
---

## Contexte

Projet de SAE en première année de BUT MMI. Le site devait proposer une connexion, une messagerie instantanée et une page boutique de composants PC.

## Ce que j'ai fait

- Toutes les requêtes SQL passent par des **requêtes préparées**. Une saisie utilisateur ne peut plus modifier la requête.
- Les mots de passe sont **hachés** avec `password_hash` (PHP) et vérifiés avec `password_verify`. Aucun mot de passe en clair dans la base.

## Difficultés

Comprendre pourquoi une requête construite par concaténation est dangereuse, puis repasser sur tout le code pour ne pas en oublier une seule.

## Ce que j'ai appris

Une seule requête oubliée suffit. La sécurité se vérifie partout, pas seulement sur le formulaire de connexion.
