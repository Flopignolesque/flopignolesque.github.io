/** Fonctions pour lire le contenu des collections dans la bonne langue */
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n';

export type Project = CollectionEntry<'projects'>;

/** "fr/nocturne" -> "nocturne" */
export function projectSlug(entry: Project): string {
  return entry.id.split('/').slice(1).join('/');
}

export function projectLang(entry: Project): Lang {
  return entry.id.split('/')[0] as Lang;
}

/** Projets d'une langue, triés par "order" */
export async function getProjects(lang: Lang): Promise<Project[]> {
  const all = await getCollection('projects', (entry) => projectLang(entry) === lang);
  return all.sort((a, b) => a.data.order - b.data.order);
}
