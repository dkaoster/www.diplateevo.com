export async function load({ fetch }) {
  // Get the pages of this website
  const pages = await fetch('/content/pages.json').then((res) => res.json());
  return { pages };
}
