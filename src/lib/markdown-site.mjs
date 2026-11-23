/**
 * Plugin pour le Markdown des projets (moteur Sätteri d'Astro 7) :
 *  1. les liens externes reçoivent rel="noopener noreferrer" et target="_blank"
 *  2. les textes "[TODO ...]" sont entourés d'un <span class="todo"> pour rester bien visibles
 */
const TODO_RE = /\[TODO[^\]]*\]/g;
const SITE = 'https://flopignolesque.github.io';

export const markdownSite = {
  name: 'portfolio-site',

  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = String(node.properties?.href ?? '');
      if (/^https?:\/\//.test(href) && !href.startsWith(SITE)) {
        ctx.setProperty(node, 'rel', ['noopener', 'noreferrer']);
        ctx.setProperty(node, 'target', '_blank');
      }
    },
  },

  text(node, ctx) {
    const value = node.value ?? '';
    if (!value.includes('[TODO')) return;
    const parts = [];
    let last = 0;
    for (const match of value.matchAll(TODO_RE)) {
      if (match.index > last) parts.push({ type: 'text', value: value.slice(last, match.index) });
      parts.push({
        type: 'element',
        tagName: 'span',
        properties: { className: ['todo'] },
        children: [{ type: 'text', value: match[0] }],
      });
      last = match.index + match[0].length;
    }
    if (last < value.length) parts.push({ type: 'text', value: value.slice(last) });
    ctx.replaceNode(node, parts);
  },
};
