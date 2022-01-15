import fs from 'fs';
import archieml from 'archieml';
import * as d3 from 'd3';
import Content from '$lib/components/Content.svelte';
import siteConfig from '../../site-config.js';

// The base content directory that are ArchieML files are hosted in
export const contentDir = 'content';

/**
 * Parses a filename string into an object containing the slug and
 * the locale. Processes filenames such as:
 *
 * about.txt
 * about.en.txt
 * about.zh.txt
 *
 * If a locale is not provided as the second place in the string, it
 * uses a `defaultLocale`.
 *
 * @param fileName
 * @param defaultLocale
 * @returns {{locale: (*|string), slug: *}}
 */
export const parseFileName = (fileName, defaultLocale = 'en') => {
  const [slug, localeOrFileType, fileType] = fileName.split('.');
  return { slug, locale: fileType ? localeOrFileType : defaultLocale };
};

// The fields we want to include from the ArchieML document into
// this root listing of pages
const listIncludeFields = ['title', 'publishDate', 'isPage', 'description', 'featureImage'];

/**
 * Returns a list of all the content in this blog, including pages and posts.
 *
 * @returns {*}
 */
export const allContentList = (props) => {
  // Process the prop options
  const { includeAllContent = false, renderContentToHTML = false } = props || {};

  return fs.readdirSync(contentDir)
    // filter out files that start with underscores
    .filter((d) => d.indexOf('__') !== 0)

    // Map the filename to actual objects
    .map((fileName) => {
      // Read the ArchieML file into a UTF-8 string
      const aml = fs.readFileSync(`${contentDir}/${fileName}`, 'utf8');

      // Parse the ArchieML file
      const amlObj = archieml.load(aml);

      // Return an object representing this entry
      return {
        // if the includeAllContent argument is provided, return the amlObj.
        // Otherwise, only include the fields specified in listIncludeFields
        // so that our payload doesn't explode
        ...(includeAllContent ? amlObj : listIncludeFields.reduce(
          (acc, field) => ({ ...acc, [field]: amlObj[field] }), {},
        )),
        // If we want to render content to HTML instead of using a JSON object
        ...(renderContentToHTML
          ? {
            content: Content.render(
              { content: amlObj.content },
              { context: new Map([['siteConfig', siteConfig]]) },
            )
              .html.replace(/<!--[\s\S]*?-->/g, '').replace(/[\n\r]/g, ''),
          }
          : {}),
        // slug and locale
        ...parseFileName(fileName),
      };
    })

    // convert from [{slug: slug, locale: en, ...}, {slug: slug, locale: en, ...}] to
    // [{slug: slug, en:..., zh:...}]
    .reduce(
      (list, entry) => {
        // Copy list to manipulate
        let retList = list;

        // See if this slug already exists
        const existingIndex = list.findIndex((f) => f.slug === entry.slug);

        // If it already exists, we add to the existing one
        if (existingIndex >= 0) retList[existingIndex][entry.locale] = entry;
        // If it does not exist, we add a new entry
        else {
          retList = [...retList, {
            slug: entry.slug,
            isPage: !!entry.isPage,
            publishDate: entry.publishDate,
            [entry.locale]: entry,
          }];
        }

        return retList;
      },
      [],
    )

    // Sort by publishDate
    .sort((a, b) => {
      const dateParse = d3.timeParse('%Y/%m/%d');
      return dateParse(b.publishDate) - dateParse(a.publishDate);
    });
};
