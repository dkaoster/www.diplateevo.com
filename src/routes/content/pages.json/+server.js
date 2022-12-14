import { json } from '@sveltejs/kit';
import { getPages } from '$lib/utils/content';

/**
 * The get function for this endpoint, returning all the pages
 *
 * @returns {Promise<{body: (*&{locale: (*|string), slug: *})}>}
 */
export async function GET() {
  return json(getPages());
}
