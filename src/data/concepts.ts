// The 5 concept demos on the Products page — inspiration templates,
// cleaned and rebranded to Nadeem Dev Apps. Single source of truth;
// the page renders them with ProjectCard, exactly like the 6 products.
// The filter pills do not touch them (no data-category).
// Bullets come from each concept site itself — LED screen and focus
// timer, the playable game, drag pieces and doodle chat, the dashboard
// mock, the oversized name and case-study pages.

import type { Project } from './projects';

export const concepts: Project[] = [
  {
    theme: 'tally',
    glyph: 'Tb',
    name: 'Tally Bar',
    tag: 'Concept demo · Desk display',
    status: 'Live demo · Free',
    stack: 'React · Vite · Tailwind',
    description: 'A desk status display with an LED pixel screen and a focus timer.',
    bullets: ['LED pixel screen', 'Focus timer', 'Apps and integrations'],
    link: { href: 'concepts/tally-bar/', label: 'Open the concept site →' },
    category: 'web',
  },
  {
    theme: 'lookout',
    glyph: 'Lo',
    name: 'Look Out Below',
    tag: 'Concept demo · Game',
    status: 'Live demo · Free',
    stack: 'React · Vite · Tailwind',
    description:
      'A tiny hand-drawn game about being small, quick and directly underneath a very clumsy sky.',
    bullets: ['Playable mini-game', 'Hand-drawn monochrome art', 'Bold stacked wordmark'],
    link: { href: 'concepts/look-out-below/', label: 'Open the concept site →' },
    category: 'web',
  },
  {
    theme: 'stitch',
    glyph: 'St',
    name: 'Stitch & Tan',
    tag: 'Concept demo · Shop',
    status: 'Live demo · Free',
    stack: 'React · Vite · Tailwind',
    description:
      'Handmade leather pouches, cases and little things from a one-person studio, plus custom orders.',
    bullets: ['Drag the pieces around', 'Doodle chat thread', 'Custom orders'],
    link: { href: 'concepts/stitch-and-tan/', label: 'Open the concept site →' },
    category: 'web',
  },
  {
    theme: 'productsite',
    glyph: 'Ps',
    name: 'ProductSite',
    tag: 'Concept demo · Product site',
    status: 'Live demo · Free',
    stack: 'React · Vite · Tailwind',
    description: 'A product site for a calm team workspace — plan, build and ship from one place.',
    bullets: ['Dashboard mock', 'Board and timeline', 'Throughput stats'],
    link: { href: 'concepts/product-site/', label: 'Open the concept site →' },
    category: 'web',
  },
  {
    theme: 'portfolio',
    glyph: 'Pf',
    name: 'Portfolio',
    tag: 'Concept demo · Portfolio',
    status: 'Live demo · Free',
    stack: 'React · Vite · Tailwind',
    description: 'A portfolio concept — oversized name, selected-work grid and case-study pages.',
    bullets: ['Oversized name', 'Selected-work grid', 'Case-study pages'],
    link: { href: 'concepts/portfolio-concept/', label: 'Open the concept site →' },
    category: 'web',
  },
];
