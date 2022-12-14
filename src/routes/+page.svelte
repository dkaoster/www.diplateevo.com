<script>
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import { getContext } from 'svelte';
  import { defaultLocale } from '$lib/stores/locale';
  import i18n from '$lib/utils/i18n';
  import Cover from '$lib/custom/home/Cover.svelte';
  import StoryCardList from '$lib/components/StoryCardList.svelte';
  import Helmet from '$lib/components/Helmet.svelte';

  export let posts;
  export let pagination;

  const locale = getContext('locale');
  const siteConfig = getContext('siteConfig');

  $: currentLocalePosts = posts.map((d) => d[$locale.locale] || d[defaultLocale]);
  $: helmet = {
    title: i18n[$locale.locale].home || i18n[defaultLocale].home,
    description: siteConfig.description,
    url: `${siteConfig.baseURL}/`,
  };
</script>

<Helmet {...helmet} />
<Cover />

<StoryCardList posts={currentLocalePosts} {pagination} />
