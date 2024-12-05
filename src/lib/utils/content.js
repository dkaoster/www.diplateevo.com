import fs from 'fs';
import { render } from 'svelte/server';
import archieml from 'archieml';
import { marked } from 'marked';
import * as d3 from 'd3';
import Content from '$lib/components/Content.svelte';
import siteConfig from '../../site-config.js';

/**
 * content.js
 *
 * This file is included and only run at build time, never exposed to the client.
 */

// The base content directory that are ArchieML files are hosted in
const contentDir = 'content';

// The fields we want to include from the ArchieML document into
// the root listing of pages
const listIncludeFields = [
  'title', 'publishDate', 'isPage', 'description', 'featureImage',
  'featureImageCrops', 'storyCardThumb', 'storyCardThumbCrops', 'hideRSS',
];

// Gets the image-manifest file
const imagesManifest = JSON.parse(
  fs.readFileSync(`${contentDir}/images-manifest.json`, 'utf8'),
);

// automatically open links in a new tab if the links are external.
marked.use({
  renderer: {
    link(href, title, text) {
      if (href.indexOf('http://') === 0 || href.indexOf('https://') === 0) {
        return `<a target="_blank" rel="noopener noreferrer" href="${href}">${text}</a>`;
      }
      return `<a href="${href}">${text}</a>`;
    },
  },
});

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
const parseFileName = (fileName, defaultLocale = 'en') => {
  const [slug, localeOrFileType, fileType] = fileName.split('.');
  return { slug, locale: fileType ? localeOrFileType : defaultLocale };
};

/**
 * Returns the crops for this image.
 *
 * @param path
 */
export const getCrops = (path) => imagesManifest
  .filter(({ image }) => image === `./static${path}`)
  .map((crop) => ({ ...crop, image: crop.image.replace('./static', '') }));

/**
 * Reads the filesystem for files in the content directory, removing files that
 * start with `__`.
 *
 * @returns {string[]}
 */
const getContentFiles = () => fs.readdirSync(contentDir)
  .filter((d) => d.indexOf('__') !== 0 && d.indexOf('.txt') === (d.length - 4));

/**
 * Given a filename, parses this file with archieML, adding any parse-time
 * processing such as image crops.
 *
 * @param fileName
 * @param options
 * @returns {{}}
 */
const parseContent = (fileName, options = {}) => {
  const { processCrops = true } = options;

  // Read the ArchieML file into a UTF-8 string
  const aml = fs.readFileSync(`${contentDir}/${fileName}`, 'utf8');

  // Parse the ArchieML file
  const amlObj = archieml.load(aml);

  // Get all the crops for featureImage
  if (processCrops && amlObj.featureImage) {
    amlObj.featureImageCrops = getCrops(amlObj.featureImage);
  }

  // Get all the crops for storyCardThumb
  if (processCrops && amlObj.storyCardThumb) {
    amlObj.storyCardThumbCrops = getCrops(amlObj.storyCardThumb);
  }

  // Process content and get all image crops
  if (amlObj.content && amlObj.content.length > 0) {
    for (let i = 0; i < amlObj.content.length; i += 1) {
      // Image types
      if (amlObj.content[i].type === 'image' && processCrops) {
        if (typeof amlObj.content[i].value === 'string') {
          amlObj.content[i].value = {
            src: amlObj.content[i].value,
            crops: getCrops(amlObj.content[i].value),
          };
        } else {
          amlObj.content[i].value = {
            ...amlObj.content[i].value,
            crops: getCrops(amlObj.content[i].value.src),
          };
        }
      }

      // portfolio item types
      if (amlObj.content[i].type === 'portfolioItem' && processCrops) {
        amlObj.content[i].value = {
          ...amlObj.content[i].value,
          featureImageCrops: getCrops(amlObj.content[i].value.featureImage),
        };
      }

      // text type, parse markdown
      if (amlObj.content[i].type === 'text') {
        amlObj.content[i].value = marked.parse(
          amlObj.content[i].value.value || amlObj.content[i].value,
        );
      }
    }
  }

  return amlObj;
};

/**
 * Takes a content object and renders the content to HTML
 *
 * @param content
 * @param isRSS
 * @returns {*}
 */
const contentHTML = (content, isRSS = false) => render(
  Content,
  {
    props: { content },
    context: new Map([
      ['baseAbsoluteURL', siteConfig.baseURL],
      ['isRSS', isRSS],
    ]),
  },
)
  // Remove all the comments that somehow show up
  .html.replace(/<!--[\s\S]*?-->/g, '').replace(/[\n\r]/g, '');

/**
 * Returns a list of all the content in this blog, including pages and posts.
 *
 * @param options
 * @returns {*}
 */
const allContent = (options = {}) => {
  const {
    // Whether to include all the content from archieML into the response
    includeAllContent = false,
    // Whether to render the content to HTML before returning (used in RSS)
    renderContentToHTML = false,
    // Whether we are rendering for RSS
    isRSS = false,
  } = options;

  return getContentFiles()

    // Map the filename to actual objects
    .map((fileName) => {
      // Parse the content file, if we render to raw HTML that means we're
      // generating an RSS feed or something and shouldn't use srcsets
      const amlObj = parseContent(fileName, { processCrops: !renderContentToHTML });

      // Return an object representing this entry
      return {
        // if the includeAllContent argument is provided, return the amlObj.
        // Otherwise, only include the fields specified in listIncludeFields
        // so that our payload doesn't explode
        ...(includeAllContent
          ? amlObj
          : listIncludeFields.reduce((acc, field) => ({ ...acc, [field]: amlObj[field] }), {})),
        // If we want to render content to HTML instead of using a JSON object
        ...(renderContentToHTML ? { content: contentHTML(amlObj.content, isRSS) } : {}),
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
            hideRSS: !!entry.hideRSS,
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

/**
 * Gets a list of all the pages.
 *
 * @returns {*}
 */
export const getPages = () => allContent().filter((entry) => entry.isPage);

/**
 * Gets a list of the posts, paginated with a 1-based index.
 *
 * @param options
 * @returns {{posts: *}}
 */
export const getPosts = (options = {}) => {
  const { page = 1, postsPerPage = 5, isRSS = false } = options;

  // Get the posts
  const posts = allContent({
    ...options,
    // Add options for RSS feeds
    ...(isRSS ? { includeAllContent: true, renderContentToHTML: true } : {}),
  }).filter((entry) => !entry.isPage && (!isRSS || !entry.hideRSS));

  const numPages = Math.ceil(posts.length / postsPerPage);

  // Get the posts on this page
  const paginatedPosts = posts.slice((page - 1) * postsPerPage, page * postsPerPage);

  return {
    posts: paginatedPosts,
    pagination: {
      // Return the number for the next page if it exists
      next: ((page + 1) <= numPages) ? page + 1 : null,
      // Return the number for the previous page if it exists
      prev: ((page - 1) > 0) ? page - 1 : null,
    },
  };
};

/**
 *
 * @param slug
 * @returns {{locale: (*|string), slug: *}}
 */
export const getPost = (slug) => getContentFiles()

  // filter down to files that have this slug
  .filter((d) => slug === parseFileName(d).slug)

  // Map the filename to actual objects
  .map((fileName) => ({
    // Read the ArchieML file into a UTF-8 string and generate an archieML object
    ...parseContent(fileName, { processCrops: true }),
    // slug and locale
    ...parseFileName(fileName),
  }))

  // reduce to an object with locales
  .reduce((obj, entry) => ({ ...obj, [entry.locale]: entry }), {});
