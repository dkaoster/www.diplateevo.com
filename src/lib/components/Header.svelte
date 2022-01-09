<script>
  import { getContext } from 'svelte';
  import { defaultLocale } from '$lib/stores/locale';
  import i18n from '$lib/utils/i18n';
  import Moon from './icons/Moon.svelte';
  import Sun from './icons/Sun.svelte';

  export let pages = [];

  const theme = getContext('theme');

  let height;
</script>

<style lang="scss">
  .wrapper {
    width: 100%;
    padding: 0 30px;
    position: sticky;
    top: 0;
    height: 0;
    z-index: 10;
  }

  .header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    border-bottom: 4px solid var(--color);
    width: 100%;
    max-width: 1400px;
    margin: auto;
    transition: all 0.5s;
  }

  .fill {
    background-color: var(--background-color);
    opacity: 0.85;
    position: absolute;
    left: 0;
    right: 0;
    backdrop-filter: blur(5px);
    transition: all 0.5s;
  }

  .logo-link {
    grid-column: 1;
    z-index: 2;
    text-decoration: none;
  }

  .logo {
    height: 72px;
    width: 72px;
    text-align: center;
    color: white;
    background-color: #222;
    font-size: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
    cursor: pointer;
    font-family: Helvetica, Arial, "Microsoft Yahei", STXihei, sans-serif;
  }

  .logo:hover {
    background-color: $primary-color;
  }

  .nav {
    grid-column: 3;
    z-index: 2;
    align-self: center;
    text-transform: uppercase;
    font-size: 18px;
    display: flex;
    align-items: center;
  }

  .nav-link {
    color: var(--color);
    margin-left: 20px;
    font-family: 'Roboto Mono', monospace;
    transition: 0.2s;
    text-decoration: none;
  }

  .nav-link:hover {
    color: $primary-color;
  }

  .theme-toggle {
    margin-left: 20px;
    background: none;
    border: none;
    outline: none;
    opacity: 0.6;
    transition: opacity 0.5s;
  }

  .theme-toggle:hover {
    opacity: 1;
  }

  @media screen and (max-width: $device-small) {
    .logo {
      width: 48px;
      height: 48px;
      font-size: 24px;
    }

    .wrapper {
      padding: 0 15px;
    }

    .nav-link, .theme-toggle {
      margin-left: 10px;
    }
  }
</style>

<nav class="wrapper">
  <div class="fill" style="height: {height}px;" />
  <div class="header" bind:clientHeight={height}>
    <a class="logo-link" href="/" rel=prefetch>
      <div class="logo">高</div>
    </a>
    <div class="nav">
      <a class="nav-link" href="/" rel=prefetch>
        {i18n[defaultLocale].home}
      </a>
      {#each pages.sort((a, b) => a.slug.localeCompare(b.slug)) as page}
        <a class="nav-link" href="/{page.slug}" rel=prefetch>{page.slug}</a>
      {/each}
      <button
        class="theme-toggle"
        on:click={() => { theme.set(($theme === 'dark') ? 'light' : 'dark'); }}
      >
        {#if $theme === 'dark'}
          <Sun width="24" />
        {:else}
          <Moon width="24" />
        {/if}
      </button>
    </div>
  </div>
</nav>
