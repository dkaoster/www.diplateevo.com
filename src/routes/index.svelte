<script context="module">
  export async function load({ fetch }) {
    const { posts = [], pagination = {} } = await fetch('/content/posts-1.json').then((res) => res.json());
    return { props: { posts, pagination } };
  }
</script>

<script>
  import { getContext } from 'svelte';
  import { defaultLocale } from '$lib/stores/locale';
  import i18n from '$lib/utils/i18n';
  import Cover from '$lib/custom/home/Cover.svelte';
  import StoryCardList from '$lib/components/StoryCardList.svelte';
  import Helmet from '$lib/components/Helmet.svelte';

  export let posts;
  export let pagination;

  $: locale = getContext('locale');
  $: currentLocalePosts = posts.map((d) => d[$locale.locale] || d[defaultLocale]);
  $: helmet = {
    title: i18n[$locale.locale].home || i18n[defaultLocale].home,
    description: 'A blog, by Daniel Kao',
    url: 'https://www.diplateevo.com',
  };
</script>

<Helmet {...helmet} />
<Cover />

<StoryCardList posts={currentLocalePosts} {pagination} />
