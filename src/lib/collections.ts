/** Lit une collection JSON triée par son champ "order" */
import { getCollection } from 'astro:content';

type Ordered = 'parcours' | 'skills' | 'learning' | 'assets' | 'passions';

export async function getOrdered<C extends Ordered>(name: C) {
  const entries = await getCollection(name);
  return entries.sort((a, b) => a.data.order - b.data.order);
}
