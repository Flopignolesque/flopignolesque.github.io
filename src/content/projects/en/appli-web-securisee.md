---
title: Securing a web application
tagline: A site with login, messaging and a shop, protected against SQL injection.
kind: University project, BUT MMI
year: "2024-2025"
tags: [PHP, SQL, Web security, HTML/CSS]
order: 2
featured: true
links:
  demo: "[TODO lien]"
---

## Context

First-year university project (BUT MMI). The site needed a login, instant messaging and a shop page for PC parts.

## What I did

- Every SQL query goes through **prepared statements**. User input can no longer change the query.
- Passwords are **hashed** with PHP's `password_hash` and checked with `password_verify`. No plain-text password in the database.

## Challenges

Understanding why a query built by string concatenation is dangerous, then going through the whole codebase so none slipped through.

## What I learned

One forgotten query is enough. Security has to be checked everywhere, not just on the login form.
