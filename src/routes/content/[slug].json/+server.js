import { getPost } from '$lib/utils/content';

/**
 * The get function for this endpoint.
 *
 * @param params
 * @returns {Promise<{body: {locale: (*|string), slug: *}}|{status: number}>}
 */
export async function GET({ params }) {
  // the `slug` parameter is available because this file
  // is called [slug].json.js
  const { slug } = params;
  const body = getPost(slug);

  // Make sure we have data, otherwise return a 404.
  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
  return Object.keys(body).length ? { body } : { status: 404 };
}
