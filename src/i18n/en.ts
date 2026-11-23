/**
 * Textes de l'interface en anglais.
 * Mêmes clés que fr.ts : TypeScript signale une erreur s'il en manque une.
 */
import type { UI } from './fr';

const en: UI = {
  meta: {
    siteName: 'Florian TAESCH-WOLFFER',
    defaultDescription:
      'Networks & Telecom student looking for a cybersecurity / networking work-study position from September 2027, in Toulouse / Blagnac.',
  },

  banner: {
    text: 'Open to work-study',
    items: ['September 2027', 'Toulouse / Blagnac', '[TODO rythme]'],
  },

  nav: {
    home: 'Home',
    projects: 'Projects',
    journey: 'Journey',
    skills: 'Skills',
    passions: 'Hobbies',
    contact: 'Contact',
    cv: 'CV',
    menu: 'Menu',
    close: 'Close',
    skip: 'Skip to content',
    mainLabel: 'Main navigation',
    langLabel: 'Change language',
    otherLang: 'FR',
    otherLangName: 'Français',
  },

  hero: {
    label: '> whoami',
    firstName: 'Florian',
    lastName: 'TAESCH-WOLFFER',
    subtitle:
      'Networks & Telecom student heading into cybersecurity. I build networks, ship web apps, and like understanding how things break so I can protect them.',
    ctaProjects: 'See my projects',
    ctaCv: 'Download my CV',
    terminalHintOr: 'or',
    terminalHintEnd: 'opens the terminal',
  },

  stats: {
    title: 'In numbers',
    items: [
      { value: 3, prefix: '', suffix: ' months', label: 'building Nocturne solo' },
      { value: 10, prefix: '', suffix: '+', label: 'PCs built' },
      { value: 896, prefix: '', suffix: '', label: 'PIX score (level 7)' },
      { value: null, prefix: '', suffix: 'B2', label: 'English level' },
    ],
  },

  featured: {
    title: 'Featured projects',
    all: 'All projects',
  },

  looking: {
    title: "What I'm looking for",
    lines: [
      'A networking / cybersecurity work-study position (alternance), starting September 2027.',
      'In Toulouse, or within 30 minutes of Toulouse / Blagnac.',
      'Driving licence and my own car.',
    ],
    cta: 'Get in touch',
  },

  projects: {
    title: 'Projects',
    intro: 'Side projects and university projects (SAE), each with the details of what I actually did.',
    read: 'Read',
    back: 'All projects',
    links: 'Links',
    demo: 'Demo',
    github: 'GitHub',
    next: 'Next project',
    audit: {
      title: 'Security audit',
      severity: 'Severity',
      fixed: 'Fixed',
      open: 'In progress',
      sev: { critique: 'Critical', haute: 'High', moyenne: 'Medium', faible: 'Low' },
    },
  },

  journey: {
    title: 'Journey',
    intro:
      'I tried web design, then a coding school, before finding what I actually enjoy: networks and security. Each step added something.',
    formation: 'Education',
    experience: 'Work',
  },

  skills: {
    title: 'Skills',
    intro: 'No percentage bars. Three levels: solid, comfortable, basics.',
    levels: { solide: 'Solid', aise: 'Comfortable', notions: 'Basics' },
    learningTitle: "What I'm learning right now",
    learningStatus: { 'en cours': 'in progress', terminé: 'done', prévu: 'planned' },
    certifsTitle: 'Certifications & extras',
    softTitle: 'Soft skills',
  },

  passions: {
    title: 'Hobbies',
    intro: 'What I do outside class, and what it brings to work.',
    takeaway: 'At work',
    nowPlaying: 'Now playing',
    nowPlayingTrack: '[TODO titre du morceau]',
    nowPlayingArtist: 'Florian & friends (Suno)',
  },

  contact: {
    title: 'Contact',
    intro: 'For a work-study offer or a question about a project, email is the easiest way.',
    mail: 'Email',
    copy: 'Copy',
    copied: 'Copied',
    write: 'Write',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    zone: 'Area',
    zoneValue: 'Toulouse / Blagnac, 30 min max',
    noscriptMail: 'florian.taesch.wolffer.pro [at] gmail [dot] com',
  },

  legal: {
    title: 'Legal notice',
    link: 'Legal notice',
  },

  footer: {
    built: 'Static site, handmade with Astro.',
    under: 'Under the hood',
    terminal: 'Terminal',
  },

  notFound: {
    title: 'Page not found',
    text: "This page doesn't exist (or not anymore).",
    suggestions: 'Suggested commands',
    home: 'Back to home',
  },

  terminal: {
    open: 'Open the terminal',
    title: 'Terminal',
    close: 'Close the terminal',
    inputLabel: 'Command',
    welcome: "'help' lists the commands.",
    notFound: "command not found. Try 'help'.",
    help: [
      ['help', 'list commands'],
      ['whoami', 'who I am, in 3 lines'],
      ['ls projects', 'list projects'],
      ['cd projects', 'go to the projects page (or cd <project>)'],
      ['cat cv', 'download my CV'],
      ['contact', 'show and copy my email'],
      ['skills', 'skills as a tree'],
      ['lang en / lang fr', 'switch language'],
      ['nmap florian', 'scan open ports'],
      ['sudo hire-me', '...'],
      ['clear / exit', 'clear / close'],
    ],
    whoami: [
      'Florian TAESCH-WOLFFER, Networks & Telecom student at IUT de Blagnac.',
      'I build networks, I code apps (Nocturne), I am moving into cybersecurity.',
      'Looking for a networking / cybersecurity work-study position from September 2027.',
    ],
    cv: 'Downloading CV...',
    copied: '(copied to clipboard)',
    hire: [
      '[sudo] password for recruiter: ********',
      'Access granted. Good call.',
      'Next step:',
    ],
    hireLink: 'open the contact page',
    nmapStart: 'Starting Nmap 7.95 ( https://nmap.org )',
    nmapHost: 'Nmap scan report for florian (127.0.0.1)',
    nmapDone: 'Nmap done: 1 IP address (1 host up) scanned',
    goingTo: 'Going to',
    unknownProject: 'Unknown project. List:',
  },
};

export default en;
