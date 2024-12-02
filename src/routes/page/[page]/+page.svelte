<script>
  import { getContext } from 'svelte';
  import i18n from '$lib/utils/i18n';
  import { defaultLocale } from '$lib/stores/locale';
  import StoryCardList from '$lib/components/StoryCardList.svelte';
  import Helmet from '$lib/components/Helmet.svelte';

  const { data } = $props();

  const { page, posts, pagination } = $derived(data);

  const locale = getContext('locale');
  const siteConfig = getContext('siteConfig');

  const currentLocalePosts = $derived(posts.map((d) => d[$locale.locale] || d[defaultLocale]));
  const helmet = $derived({
    title: (i18n[$locale.locale].page || i18n[defaultLocale].page).replace('<>', page),
    url: `${siteConfig.baseURL}/page/${page}/`,
  });
</script>

<style>
  .page-wrap { margin-top: 60px; }
</style>

<Helmet {...helmet} />

<div class="page-wrap">
  <StoryCardList posts={currentLocalePosts} {pagination} />
</div>
