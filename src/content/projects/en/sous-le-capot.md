---
title: This site (under the hood)
tagline: The portfolio is a project too. Stack, performance and security.
kind: Side project
year: "2026"
tags: [Astro, TypeScript, Tailwind, GSAP, WebGL, CSP]
order: 6
featured: false
links:
  github: "https://github.com/flopignolesque/flopignolesque.github.io"
---

## Stack

- **Astro**, 100% static output. No page needs a server.
- **TypeScript** and **Tailwind CSS**.
- **GSAP** for animations (text decoding, scroll reveals), **Lenis** for smooth scrolling.
- A single **WebGL** shader (OGL) behind the home page.
- Content (projects, journey, skills, hobbies) lives in Markdown and JSON files, so I can edit text without touching code.
- Hosted on **GitHub Pages**, deployed by GitHub Actions on every push.

## Performance

- Animation JavaScript only loads if the system hasn't asked for reduced motion. The shader loads after first paint, the terminal only when it's first opened.
- The shader pauses when it leaves the screen or the tab is hidden. Resolution is capped (DPR 1.5 max, 1 on mobile).
- With `prefers-reduced-motion`, nothing moves: all content is shown straight away.
- Self-hosted fonts, with a size-matched fallback font so the page doesn't jump while loading.
- Animations only touch `transform` and `opacity`.

## Security

- Strict **Content Security Policy** (as a meta tag, since GitHub Pages can't send headers): scripts and styles only from the site itself, no inline scripts, no `unsafe-inline`, no `eval`.
- No third-party scripts, no tracking, no cookies.
- Every external link uses `rel="noopener noreferrer"`.
- No secrets in the repo. `npm audit` runs on every CI build: deployment fails on any high severity issue.
- The email address isn't in the HTML (it's rebuilt on click), no phone number.
- A [`/.well-known/security.txt`](/.well-known/security.txt) file (RFC 9116) says where to report a vulnerability.
