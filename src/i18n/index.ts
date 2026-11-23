/**
 * Outils de traduction.
 *  - t(lang) renvoie tous les textes de l'interface dans la langue demandée
 *  - path(lang, '/projets/') construit une URL localisée : /fr/projets/
 *  - pick(lang, { fr, en }) choisit la bonne version d'un texte de contenu
 */
import fr from './fr';
import en from './en';

export const languages = ['fr', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'fr';

const dictionaries = { fr, en };

export function t(lang: Lang) {
  return dictionaries[lang];
}

/** /fr/projets/ ou /en/projets/ (toujours avec un "/" final) */
export function path(lang: Lang, route = '/'): string {
  const clean = route.startsWith('/') ? route : `/${route}`;
  const withSlash = clean.endsWith('/') || clean.includes('#') ? clean : `${clean}/`;
  return `/${lang}${withSlash}`;
}

export function pick(lang: Lang, value: { fr: string; en: string }): string {
  return value[lang];
}

/** Remplace /fr/ par /en/ (ou l'inverse) dans une URL */
export function switchLang(pathname: string, to: Lang): string {
  return pathname.replace(/^\/(fr|en)(\/|$)/, `/${to}/`);
}

export function otherLang(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr';
}

/** Pour getStaticPaths des pages /[lang]/... */
export function langPaths() {
  return languages.map((lang) => ({ params: { lang } }));
}

/** Un texte qui contient encore "[TODO" : à afficher tel quel, jamais comme lien */
export function isTodo(value: string | undefined): boolean {
  return !!value && value.includes('[TODO');
}
