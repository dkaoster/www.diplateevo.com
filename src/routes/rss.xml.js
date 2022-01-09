import { Feed } from 'feed';
import * as d3 from 'd3';
import { get as getData } from './content/posts-[page].json.js';

/**
 * RSS route for diplateevo.
 *
 * @returns {Promise<{headers: {"Content-Type": string}, body: string}>}
 */
export async function get() {
  const allContent = await getData();

  const posts = allContent.body.filter((d) => !d.isPage);

  const feed = new Feed({
    title: 'siteData.response.title',
    description: 'siteData.response.description',
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
      id: (post.url),
      link: (post.url),
      description: post.excerpt,
      content: (post.html),
      date: d3.timeParse('%Y/%m/%d')(post.publishDate),
      image: (post.feature_image),
    });
  });

  // Set headers and return
  return { body: feed.rss2(), headers: { 'Content-Type': 'application/rss+xml; charset=UTF-8' } }
}
