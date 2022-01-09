import APIFetch from '../utils/APIFetch';

const BASE_URL = 'https://www.diplateevo.com';

const render = (pages) => `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
\t${pages
    .map((page) => `<url><loc>${BASE_URL}/${page}</loc></url>`)
    .join('\n\t')}
</urlset>
`;

export async function get(req, res) {
  // Fetch the data from the API
  const posts = await APIFetch(null, 'api/posts-browse');
  const pages = await APIFetch(null, 'api/pages-browse');

  // Generate the URLs
  const urls = [
    '',
    ...posts.response.map((d) => d.slug),
    ...pages.response.map((d) => d.slug),
  ];

  res.setHeader('Content-Type', 'application/rss+xml');
  res.end(render(urls));
}
