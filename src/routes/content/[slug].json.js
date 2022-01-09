import fs from 'fs';
import archieml from 'archieml';
import { contentDir, parseFileName } from '$lib/utils/content';

/**
 * The get function for this endpoint.
 *
 * @param params
 * @returns {Promise<{body: {locale: (*|string), slug: *}}|{status: number}>}
 */
export async function get({ params }) {
  // the `slug` parameter is available because this file
  // is called [slug].json.js
  const { slug } = params;

  const body = fs.readdirSync(contentDir)

    // filter out files that start with underscores
    .filter((d) => d.indexOf('__') !== 0)

    // filter down to files that have this slug
    .filter((d) => slug === parseFileName(d).slug)

    // Map the filename to actual objects
    .map((fileName) => ({
      // Read the ArchieML file into a UTF-8 string and generate an archieML object
      ...archieml.load(fs.readFileSync(`${contentDir}/${fileName}`, 'utf8')),
      // slug and locale
      ...parseFileName(fileName),
    }))

    // reduce to an object with locales
    .reduce((obj, entry) => ({ ...obj, [entry.locale]: entry }), {});

  // Make sure we have data, otherwise return a 404.
  return Object.keys(body).length ? { body } : { status: 404 };
}
