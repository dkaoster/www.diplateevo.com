import { allContentList } from '$lib/utils/content';

/**
 * The get function for this endpoint, returning all the pages
 *
 * @returns {Promise<{body: (*&{locale: (*|string), slug: *})}>}
 */
export async function get() {
  return { body: allContentList().filter((entry) => entry.isPage) };
}