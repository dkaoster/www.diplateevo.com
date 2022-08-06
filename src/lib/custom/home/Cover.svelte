<script>
  import { onMount, getContext } from 'svelte';

  // Dynamically import these so they don't take up too much of the
  // vendor bundle
  const IllustrationsImports = {
    gj: async () => (await import('../home/GraphicsJournalist.svelte')).default,
    sj: async () => (await import('../home/SanJose.svelte')).default,
  };

  let currentHover;
  let width;
  let height;
  let loaded = false;

  const theme = getContext('theme');
  $: { if ($theme) currentHover = null; }

  onMount(() => {
    loaded = true;
    currentHover = 'gj';
  });
</script>

<style lang="scss">
  .illustration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: 100vh;
  }

  .hero {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    z-index: 5;
    position: relative;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 20px;
    width: 100%;
    max-width: 1400px;
    margin: auto;
    padding: 0 30px;
    grid-auto-flow: dense;
  }

  .hero-text {
    grid-column: 2 / 10;
    font-family: 'Roboto Mono', monospace;
    font-size: 28px;
    line-height: 42px;
    transition: all 0.5s;
    opacity: 0;
  }

  .hero-text.loaded {
    opacity: 1;
  }

  .hero-text.selected:hover {
    opacity: 1;
    transition-delay: 0s;
  }

  .name {
    font-weight: bold;
  }

  .link {
    border-bottom: 3px solid var(--color);
    line-height: 0.9em;
    transition: all 0.2s, color 0s;
  }

  .link.active {
    color: white;
    background-color: $primary-color;
    border-bottom-color: $primary-color;
    transition: all 0.2s;
  }

  @media screen and (max-width: $device-small) {
    .grid {
      padding: 0 15px;
    }

    .hero-text {
      grid-column: 1 / 13;
    }
  }
</style>

<div class="illustration" bind:clientHeight={height} bind:clientWidth={width}>
  {#await (IllustrationsImports[currentHover] || (() => null))() then component}
    <svelte:component this={component} {width} {height} />
  {/await}
</div>

<div class="hero" on:click={() => { currentHover = null; }}>
  <div class="grid">
    <div class="hero-text" class:selected={!!currentHover} class:loaded>
      <span class="name">Daniel Kao</span> is a
      <span
        class="link"
        class:active={currentHover === 'gj'}
        on:mouseover={() => { currentHover = 'gj'; }}
        on:click|stopPropagation={() => { currentHover = 'gj'; }}
        on:focus|stopPropagation={() => { currentHover = 'gj'; }}
      >graphics journalist</span> currently based in
      <span
        class="link"
        class:active={currentHover === 'sj'}
        on:mouseover={() => { currentHover = 'sj'; }}
        on:click|stopPropagation={() => { currentHover = 'sj'; }}
        on:focus|stopPropagation={() => { currentHover = 'sj'; }}
      >San Jose, California</span>.
    </div>
  </div>
</div>

