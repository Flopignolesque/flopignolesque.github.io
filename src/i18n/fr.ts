/**
 * Textes de l'interface en français.
 * Pour modifier un texte du site : changer la valeur ici (et la même clé dans en.ts).
 * Le contenu "long" (projets, parcours, compétences, passions) est dans src/content/.
 */
const fr = {
  meta: {
    siteName: 'Florian TAESCH-WOLFFER',
    defaultDescription:
      "Étudiant en BUT Réseaux & Télécoms, je cherche une alternance en cybersécurité / réseaux pour la rentrée 2027, à Toulouse / Blagnac.",
  },

  banner: {
    text: 'Recherche alternance',
    items: ['Rentrée 2027', 'Toulouse / Blagnac', '[TODO rythme]'],
  },

  nav: {
    home: 'Accueil',
    projects: 'Projets',
    journey: 'Parcours',
    skills: 'Compétences',
    passions: 'Passions',
    contact: 'Contact',
    cv: 'CV',
    menu: 'Menu',
    close: 'Fermer',
    skip: 'Aller au contenu',
    mainLabel: 'Navigation principale',
    langLabel: 'Changer de langue',
    otherLang: 'EN',
    otherLangName: 'English',
  },

  hero: {
    label: '> whoami',
    firstName: 'Florian',
    lastName: 'TAESCH-WOLFFER',
    subtitle:
      "Étudiant en BUT Réseaux & Télécoms, futur spécialiste cybersécurité. Je monte des réseaux, je développe des applis, et j'aime comprendre comment on les casse pour mieux les protéger.",
    ctaProjects: 'Voir mes projets',
    ctaCv: 'Télécharger mon CV',
    terminalHintOr: 'ou',
    terminalHintEnd: 'pour ouvrir le terminal',
  },

  stats: {
    title: 'En chiffres',
    items: [
      { value: 3, prefix: '', suffix: ' mois', label: 'de dev solo sur Nocturne' },
      { value: 10, prefix: '', suffix: '+', label: 'PC montés' },
      { value: 896, prefix: '', suffix: '', label: 'PIX (niveau 7)' },
      { value: null, prefix: '', suffix: 'B2', label: 'en anglais' },
    ],
  },

  featured: {
    title: 'Projets à la une',
    all: 'Tous les projets',
  },

  looking: {
    title: 'Ce que je cherche',
    lines: [
      'Une alternance en réseaux / cybersécurité, dès septembre 2027.',
      'À Toulouse, ou à 30 minutes max de Toulouse / Blagnac.',
      'Permis B et véhiculé.',
    ],
    cta: 'Me contacter',
  },

  projects: {
    title: 'Projets',
    intro: "Des projets perso et des SAE (les projets du BUT), avec pour chacun le détail de ce que j'ai fait.",
    read: 'Lire',
    back: 'Tous les projets',
    links: 'Liens',
    demo: 'Démo',
    github: 'GitHub',
    next: 'Projet suivant',
    audit: {
      title: 'Audit de sécurité',
      severity: 'Gravité',
      fixed: 'Corrigée',
      open: 'En cours',
      sev: { critique: 'Critique', haute: 'Haute', moyenne: 'Moyenne', faible: 'Faible' },
    },
  },

  journey: {
    title: 'Parcours',
    intro:
      "J'ai testé le web, puis une école d'info, avant de trouver ce qui me plaît vraiment : le réseau et la sécurité. Chaque étape m'a apporté une brique.",
    formation: 'Formation',
    experience: 'Expérience',
  },

  skills: {
    title: 'Compétences',
    intro: 'Pas de pourcentages. Trois niveaux : ce que je maîtrise, ce que je pratique, ce que je découvre.',
    levels: { solide: 'Solide', aise: "À l'aise", notions: 'Notions' },
    learningTitle: "J'apprends en ce moment",
    learningStatus: { 'en cours': 'en cours', terminé: 'terminé', prévu: 'prévu' },
    certifsTitle: 'Certifications et atouts',
    softTitle: 'Soft skills',
  },

  passions: {
    title: 'Passions',
    intro: "Ce que je fais en dehors des cours. Et ce que ça m'apporte au travail.",
    takeaway: 'Au travail',
    nowPlaying: 'En écoute',
    nowPlayingTrack: '[TODO titre du morceau]',
    nowPlayingArtist: 'Florian & amis (Suno)',
  },

  contact: {
    title: 'Contact',
    intro: "Pour une alternance ou une question sur un projet, le mail est le plus simple.",
    mail: 'Mail',
    copy: 'Copier',
    copied: 'Copié',
    write: 'Écrire',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    zone: 'Zone',
    zoneValue: 'Toulouse / Blagnac, 30 min max',
    noscriptMail: 'florian.taesch.wolffer.pro [at] gmail [point] com',
  },

  legal: {
    title: 'Mentions légales',
    link: 'Mentions légales',
  },

  footer: {
    built: 'Site statique, fait main avec Astro.',
    under: 'Sous le capot',
    terminal: 'Terminal',
  },

  notFound: {
    title: 'Page introuvable',
    text: "Cette page n'existe pas (ou plus).",
    suggestions: 'Commandes suggérées',
    home: "Retour à l'accueil",
  },

  terminal: {
    open: 'Ouvrir le terminal',
    title: 'Terminal',
    close: 'Fermer le terminal',
    inputLabel: 'Commande',
    welcome: "'help' pour voir les commandes.",
    notFound: "command not found. Try 'help'.",
    help: [
      ['help', 'liste des commandes'],
      ['whoami', 'qui je suis, en 3 lignes'],
      ['ls projects', 'liste des projets'],
      ['cd projects', 'aller à la page projets (ou cd <projet>)'],
      ['cat cv', 'télécharger le CV'],
      ['contact', 'afficher et copier le mail'],
      ['skills', 'compétences en arbre'],
      ['lang en / lang fr', 'changer de langue'],
      ['nmap florian', 'scanner les ports ouverts'],
      ['sudo hire-me', '...'],
      ['clear / exit', 'effacer / fermer'],
    ],
    whoami: [
      'Florian TAESCH-WOLFFER, étudiant en BUT R&T à l\'IUT de Blagnac.',
      'Je monte des réseaux, je code des applis (Nocturne), je m\'oriente vers la cyber.',
      'Je cherche une alternance réseaux / cybersécurité pour la rentrée 2027.',
    ],
    cv: 'Téléchargement du CV...',
    copied: '(copié dans le presse-papier)',
    hire: [
      '[sudo] mot de passe pour recruteur : ********',
      'Accès accordé. Bonne décision.',
      'Étape suivante :',
    ],
    hireLink: 'ouvrir la page contact',
    nmapStart: 'Starting Nmap 7.95 ( https://nmap.org )',
    nmapHost: 'Nmap scan report for florian (127.0.0.1)',
    nmapDone: 'Nmap done: 1 IP address (1 host up) scanned',
    goingTo: 'Navigation vers',
    unknownProject: 'Projet inconnu. Liste :',
  },
};

export default fr;
export type UI = typeof fr;
