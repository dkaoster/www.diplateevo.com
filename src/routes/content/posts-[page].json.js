import { allContent } from '$lib/utils/content';

const postsPerPage = 5;

/**
 * The get function for this endpoint, returning all the posts and
 * a next / prev pagination
 *
 * @returns {Promise<{body: (*&{locale: (*|string), slug: *})}>}
 */
export async function get({ params }) {
  // First get all content and filter down to only posts
  const posts = allContent().filter((entry) => !entry.isPage);

  // Then do pagination
  const numPages = Math.ceil(posts.length / postsPerPage);
  const { page } = params;
  const pageNum = parseInt(page, 10);

  // If the current page is out of bounds, return a 404
  if (Number.isNaN(pageNum) || pageNum > numPages || pageNum <= 0) {
    return { status: 404 };
  }

  // Get the posts on this page
  const paginatedPosts = posts.slice((pageNum - 1) * postsPerPage, pageNum * postsPerPage);

  return {
    body: {
      posts: paginatedPosts,
      pagination: {
        // Return the number for the next page if it exists
        next: ((pageNum + 1) <= numPages) ? pageNum + 1 : false,
        // Return the number for the previous page if it exists
        prev: ((pageNum - 1) > 0) ? pageNum - 1 : false,
      },
    },
  };
}
