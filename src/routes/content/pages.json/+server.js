import { getPages } from '$lib/utils/content';

/**
 * The get function for this endpoint, returning all the pages
 *
 * @returns {Promise<{body: (*&{locale: (*|string), slug: *})}>}
 */
export async function GET() {
  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");
  // Suggestion (check for correctness before using):
  // return new Response(getPages());
  return { body: getPages() };
}
