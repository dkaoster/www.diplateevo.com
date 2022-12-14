<script>
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

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
