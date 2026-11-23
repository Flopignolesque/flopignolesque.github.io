---
title: Nocturne
tagline: A Discord-style social network I built on my own in 3 months.
kind: Side project
year: "2026"
tags: [React, Node.js, TypeScript, Socket.io, WebRTC, PostgreSQL, Prisma]
order: 1
featured: true
links:
  demo: "[TODO lien démo]"
  github: "[TODO lien GitHub]"
audit:
  # Set to true once the audit is written: the section will show up on the page.
  visible: false
  intro: "I'm auditing Nocturne myself: what I found, and how I fixed it."
  findings: []
---

## Context

I wanted to know if I could build a real-time app end to end, without following a tutorial. I used Discord as the model: servers, text and voice channels, direct messages.

## What I did

- **Frontend** in React (Vite, Tailwind), **backend** in Node.js / Express, written in TypeScript.
- **User accounts**: passwords hashed with bcrypt, JWT session in an `httpOnly` cookie, one-click revocation of every session.
- **Two-factor auth** (TOTP + backup codes) and **passkey** login (WebAuthn).
- **Friends** and real-time **messaging** with Socket.io.
- **Voice channels** over WebRTC, with signalling through Socket.io. Mic noise removal runs in the browser (DeepFilterNet3 model).
- **Database**: PostgreSQL through Prisma.
- Role and per-channel permissions stored as a bitmask, admin panel and moderation.
- Security side: every input validated with Zod, HTTP headers with Helmet, rate limiting, captcha on sign-up.

Tested by [TODO nb d'utilisateurs testeurs] people.

## Challenges

- Voice: getting audio between browsers (WebRTC, ICE, NAT) and keeping presence accurate when someone drops.
- Permissions: a role, a channel, per-channel exceptions. Without a clear priority rule, you end up granting access by mistake.
- Doing it all alone: backend, frontend, database, deployment.

## What I learned

- How modern authentication works, and why each layer is there.
- Real-time: rooms, presence, reconnections.
- An app that works is not a secure app. Hence the audit I'm running now.
