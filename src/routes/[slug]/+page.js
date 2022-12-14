throw new Error("@migration task: Check if you need to migrate the load function input (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
export async function load({ fetch, params: { slug } }) {
  // Get the posts and pagination
  const data = await fetch(`/content/${slug}.json`).then((res) => res.json());

  // Return the data for this slug
  throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
  return (Object.keys(data).length) ? { props: { data } } : { status: 404 };
}
