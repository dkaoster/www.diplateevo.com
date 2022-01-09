<script context="module">
  export async function load({ fetch }) {
    // Get the pages of this website
    const pages = await fetch('/content/pages.json').then((res) => res.json());
    return { props: { pages } };
  }
</script>

<script>
  import { setContext } from 'svelte';
  import { browser } from '$app/env';
  import { locale } from '$lib/stores/locale';
  import { theme } from '$lib/stores/theme';
  import Header from '$lib/components/Header.svelte';

  // The pages and the current path of the website to pass to the Header component
  export let pages;

  // Keep track of whether the user is using dark mode
  $: dark = $theme === 'dark';
  theme.subscribe((newTheme) => {
    if (typeof document === 'object') {
      // Sets the body background color so that overscroll is the right color too
      document.body.style.backgroundColor = (newTheme === 'dark') ? '#111' : 'white';
    }
  });

  // Sets the locale context
  setContext('locale', locale);
  setContext('theme', theme);
</script>

<style lang="scss">
  div {
    // Uses 2 separate classes for theme because when this is server-rendered,
    // it falls back to using the css property prefers-color-scheme.
    // see base.scss
    &.dark { @include dark-mode(true); }
    &.light { @include dark-mode(false); }

    min-height: 100vh;
    background-color: var(--background-color);
    color: var(--color);
    transition: all 0.5s;
  }
</style>

<div class:dark class:light={browser && !dark}>
  <Header {pages} />

  <slot />
</div>
