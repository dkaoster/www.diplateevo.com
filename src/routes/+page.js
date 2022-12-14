export async function load({ fetch }) {
  await fetch('rss.xml');
  const { posts = [], pagination = {} } = await fetch('/content/posts-1.json').then((res) => res.json());
  return { posts, pagination };
}
