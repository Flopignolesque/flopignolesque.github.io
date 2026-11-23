/**
 * Données du terminal, générées au build : /fr/terminal.json et /en/terminal.json.
 * Le terminal ne les télécharge qu'à sa première ouverture.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getOrdered } from '../../lib/collections';
import { t, path, pick, otherLang, langPaths, type Lang } from '../../i18n';
import { site, encodedMail } from '../../data/site';
import { getProjects, projectSlug } from '../../lib/content';

export const getStaticPaths = (() => langPaths()) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const ui = t(lang);
  const projects = await getProjects(lang);
  const skills = await getOrdered('skills');

  const body = {
    lang,
    ui: ui.terminal,
    levels: ui.skills.levels,
    projects: projects.map((p) => ({
      slug: projectSlug(p),
      title: p.data.title,
      tagline: p.data.tagline,
      url: path(lang, `/projets/${projectSlug(p)}/`),
    })),
    skills: skills.map((group) => ({ name: pick(lang, group.data.name), items: group.data.items })),
    urls: {
      home: path(lang, '/'),
      projects: path(lang, '/projets/'),
      contact: path(lang, '/contact/'),
      cv: site.cv[lang],
      other: path(otherLang(lang), '/'),
    },
    mail: encodedMail(),
  };

  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
