import { error } from '@sveltejs/kit';

export async function load({ fetch, params: { slug } }) {
  // Get the posts and pagination
  const data = await fetch(`/content/${slug}.json`).then((res) => (res.ok ? res.json() : {}));

  // Return the data for this slug
  if (Object.keys(data).length) return data;
  throw error(404, 'not found');
}
