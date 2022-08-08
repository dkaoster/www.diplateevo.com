import { Feed } from 'feed';
import * as d3 from 'd3';
import { getPosts } from '$lib/utils/content';
import { defaultLocale } from '$lib/stores/locale';
import siteConfig from '../site-config.js';

/**
 * RSS route for diplateevo.
 *
 * @returns {Promise<{headers: {"Content-Type": string}, body: string}>}
 */
export async function GET() {
  const posts = getPosts({ isRSS: true }).posts.map((d) => d[defaultLocale]);

  const feed = new Feed({
    title: siteConfig.title,
    description: siteConfig.description,
    feed: `${siteConfig.baseURL}/rss.xml`,
    id: siteConfig.baseURL,
    link: siteConfig.baseURL,
    image: `${siteConfig.baseURL}/cover-default.jpg`,
    favicon: `${siteConfig.baseURL}/favicon.ico`,
    copyright: `Copyright ${(new Date()).getFullYear()}, ${siteConfig.title}`,
    generator: 'SvelteKit',
  });

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteConfig.baseURL}/${post.slug}`,
      link: post.redirect || `${siteConfig.baseURL}/${post.slug}`,
      description: post.description,
      content: post.content,
      date: d3.timeParse('%Y/%m/%d')(post.publishDate),
      image: `${siteConfig.baseURL}${post.featureImage}`,
    });
  });

  // Set headers and return
  return { body: feed.rss2(), headers: { 'Content-Type': 'application/rss+xml; charset=UTF-8' } };
}
