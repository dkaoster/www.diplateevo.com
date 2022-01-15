<script context="module">
  export async function load({ fetch, params: { page } }) {
    // If somehow we landed on page 1, we redirect to the root
    if (page === '1') return { status: 301, redirect: '/' };

    // Get the posts and pagination
    const { posts, pagination } = await fetch(`/content/posts-${page}.json`).then((res) => res.json());

    // If there are no posts, return a 404
    if (!posts) return { status: 404 };

    // Return the posts and the pagination
    return { props: { posts, pagination, page } };
  }
</script>

<script>
  import { getContext } from 'svelte';
  import i18n from '$lib/utils/i18n';
  import { defaultLocale } from '$lib/stores/locale';
  import StoryCardList from '$lib/components/StoryCardList.svelte';
  import Helmet from '$lib/components/Helmet.svelte';

  export let page;
  export let posts;
  export let pagination;

  const locale = getContext('locale');
  const siteConfig = getContext('siteConfig');

  $: currentLocalePosts = posts.map((d) => d[$locale.locale] || d[defaultLocale]);
  $: helmet = {
    title: (i18n[$locale.locale].page || i18n[defaultLocale].page).replace('<>', page),
    url: `${siteConfig.baseURL}/page/${page}/`,
  };
</script>

<style>
  .page-wrap { margin-top: 60px; }
</style>

<Helmet {...helmet} />

<div class="page-wrap">
  <StoryCardList posts={currentLocalePosts} {pagination} />
</div>
