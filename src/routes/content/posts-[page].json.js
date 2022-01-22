import { getPosts } from '$lib/utils/content';

const postsPerPage = 5;

/**
 * The get function for this endpoint, returning all the posts and
 * a next / prev pagination
 *
 * @returns {Promise<{body: (*&{locale: (*|string), slug: *})}>}
 */
export async function get({ params }) {
  const { page } = params;
  const pageNum = parseInt(page, 10);

  // If the current page is out of bounds, return a 404
  if (Number.isNaN(pageNum) || pageNum <= 0) return { status: 404 };

  // First get all posts
  const posts = getPosts({ page: pageNum, postsPerPage });

  // If this page has no posts, we return a 404
  if (posts.posts.length === 0) return { status: 404 };

  // Return the posts response
  return { body: posts };
}
