import { Feed } from 'feed';
import * as d3 from 'd3';
import { allContentList } from '$lib/utils/content';
import { defaultLocale } from '$lib/stores/locale';

/**
 * RSS route for diplateevo.
 *
 * @returns {Promise<{headers: {"Content-Type": string}, body: string}>}
 */
export function get() {
  const posts = allContentList({ includeAllContent: true, renderContentToHTML: true })
    .filter((entry) => !entry.isPage)
    .map((d) => d[defaultLocale])
    .slice(0, 5);

  const feed = new Feed({
    title: 'Diplateevo',
    description: 'A blog, by Daniel Kao',
    feed: 'https://www.diplateevo.com/rss.xml',
    id: 'https://www.diplateevo.com/',
    link: 'https://www.diplateevo.com/',
    image: 'https://www.diplateevo.com/cover-default.jpg',
    favicon: 'https://www.diplateevo.com/favicon.ico',
    copyright: `Copyright ${(new Date()).getFullYear()}, Daniel Kao`,
    generator: 'SvelteKit',
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `https://www.diplateevo.com/${post.slug}`,
      link: post.redirect || `https://www.diplateevo.com/${post.slug}`,
      description: post.description,
      content: post.content,
      date: d3.timeParse('%Y/%m/%d')(post.publishDate),
      image: `https://www.diplateevo.com${post.featureImage}`,
    });
  });

  // Set headers and return
  return { body: feed.rss2(), headers: { 'Content-Type': 'application/rss+xml; charset=UTF-8' } };
}
