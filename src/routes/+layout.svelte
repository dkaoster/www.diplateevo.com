<script>
  import { setContext } from 'svelte';
  import { browser } from '$app/environment';
  import { locale } from '$lib/stores/locale';
  import { theme } from '$lib/stores/theme';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import siteConfig from '../site-config.js';

  export let data;

  // The pages and the current path of the website to pass to the Header component
  let { pages } = data;
  $: ({ pages } = data); // so it stays in sync when `data` changes

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
  setContext('siteConfig', siteConfig);
</script>

<style lang="scss">
  div {
    min-height: 100vh;
    background-color: var(--background-color);
    color: var(--color);
    transition: all 0.5s;

    // Uses 2 separate classes for theme because when this is server-rendered,
    // it falls back to using the css property prefers-color-scheme.
    // see base.scss
    &.dark { @include dark-mode(true); }
    &.light { @include dark-mode(false); }
  }
</style>

<div class:dark class:light={browser && !dark}>
  <Header {pages} />

  <slot />

  <Footer />
</div>
