/**
 * Infos générales du site (liens, CV, mail).
 * Tout ce qui ne dépend pas de la langue est ici.
 */
export const site = {
  url: 'https://flopignolesque.github.io',
  author: 'Florian TAESCH-WOLFFER',

  /**
   * Le mail n'apparaît jamais en clair dans le HTML.
   * Il est découpé ici puis réassemblé par JavaScript au clic.
   */
  mail: { user: 'florian.taesch.wolffer.pro', domain: 'gmail.com' },

  github: 'https://github.com/flopignolesque',
  githubLabel: 'github.com/flopignolesque',
  linkedin: '[TODO lien LinkedIn]',

  /** Fichiers à déposer dans public/cv/ */
  cv: {
    fr: '/cv/CV_Florian_TAESCH-WOLFFER_FR.pdf',
    en: '/cv/CV_Florian_TAESCH-WOLFFER_EN.pdf',
  },
};

/**
 * Encode le mail pour le HTML : texte inversé puis base64.
 * Les robots qui cherchent "xxx@yyy.zz" dans le code source ne le trouvent pas.
 */
export function encodedMail(): string {
  const full = `${site.mail.user}@${site.mail.domain}`;
  return btoa([...full].reverse().join(''));
}
