/**
 * Schéma des "content collections".
 * Chaque collection décrit la forme attendue d'un fichier de contenu.
 * Si un champ manque ou a le mauvais type, `npm run build` affiche une erreur claire.
 */
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/** Un texte traduit : { "fr": "...", "en": "..." } */
const localized = z.object({ fr: z.string(), en: z.string() });

/** Ordre d'affichage (1 = en premier) */
const order = z.number();

/* ------------------------------------------------------------------ */
/* Projets : un fichier Markdown par projet et par langue              */
/* src/content/projects/fr/nocturne.md + src/content/projects/en/...   */
/* ------------------------------------------------------------------ */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    /** Ex : "Projet perso", "SAE R&T" */
    kind: z.string(),
    year: z.string(),
    tags: z.array(z.string()),
    /** Ordre d'affichage (1 = premier) */
    order: z.number(),
    /** Affiché sur la page d'accueil */
    featured: z.boolean().default(false),
    /** Liens : mettre "[TODO ...]" tant que le lien n'existe pas */
    links: z
      .object({
        demo: z.string().optional(),
        github: z.string().optional(),
      })
      .default({}),
    /** Section "Audit de sécurité" : masquée tant que visible = false */
    audit: z
      .object({
        visible: z.boolean().default(false),
        intro: z.string().optional(),
        findings: z
          .array(
            z.object({
              title: z.string(),
              severity: z.enum(['critique', 'haute', 'moyenne', 'faible']),
              fixed: z.boolean(),
              description: z.string(),
            }),
          )
          .default([]),
      })
      .optional(),
  }),
});

/* ------------------------------------------------------------------ */
/* Parcours (timeline)                                                 */
/* ------------------------------------------------------------------ */
const parcours = defineCollection({
  loader: file('./src/content/parcours.json'),
  schema: z.object({
    order,
    period: z.string(),
    type: z.enum(['formation', 'experience']),
    title: localized,
    place: z.string(),
    text: localized,
  }),
});

/* ------------------------------------------------------------------ */
/* Compétences, groupées par domaine                                   */
/* level : "solide" | "aise" | "notions"                               */
/* ------------------------------------------------------------------ */
const skills = defineCollection({
  loader: file('./src/content/competences.json'),
  schema: z.object({
    order,
    name: localized,
    items: z.array(
      z.object({
        name: z.string(),
        level: z.enum(['solide', 'aise', 'notions']),
      }),
    ),
  }),
});

/* ------------------------------------------------------------------ */
/* "J'apprends en ce moment"                                           */
/* Une ligne n'est affichée que si status = "en cours" ou "terminé"    */
/* ------------------------------------------------------------------ */
const learning = defineCollection({
  loader: file('./src/content/apprentissage.json'),
  schema: z.object({
    order,
    name: z.string(),
    org: z.string(),
    status: z.enum(['prévu', 'en cours', 'terminé']),
    url: z.string().optional(),
  }),
});

/* ------------------------------------------------------------------ */
/* Certifications / atouts et soft skills                              */
/* ------------------------------------------------------------------ */
const assets = defineCollection({
  loader: file('./src/content/atouts.json'),
  schema: z.object({
    order,
    group: z.enum(['certif', 'soft']),
    label: localized,
    proof: localized.optional(),
  }),
});

/* ------------------------------------------------------------------ */
/* Passions                                                            */
/* visual : "privacy" | "setup" | "car" | "music" | "sport"            */
/* ------------------------------------------------------------------ */
const passions = defineCollection({
  loader: file('./src/content/passions.json'),
  schema: z.object({
    order: z.number(),
    large: z.boolean().default(false),
    visual: z.enum(['privacy', 'setup', 'car', 'music', 'sport']),
    title: localized,
    text: localized,
    /** Le lien avec le monde pro */
    takeaway: localized,
    /** Petites étiquettes (outils, matériel...) */
    chips: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, parcours, skills, learning, assets, passions };
