import { redirect, error } from '@sveltejs/kit';

export async function load({ fetch, params: { page } }) {
  // If somehow we landed on page 1, we redirect to the root
  if (page === '1') throw redirect(301, '/');

  // Get the posts and pagination
  const { posts, pagination } = await fetch(`/content/posts-${page}.json`).then((res) => res.json());

  // If there are no posts, return a 404
  if (!posts) throw error(404);

  // Return the posts and the pagination
  return { posts, pagination, page };
}
