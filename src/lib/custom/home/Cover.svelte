<script>
  import { onMount, getContext } from 'svelte';

  // Dynamically import these so they don't take up too much of the
  // vendor bundle
  const IllustrationsImports = {
    gj: async () => (await import('../home/GraphicsJournalist.svelte')).default,
    az: async () => (await import('../home/Arizona.svelte')).default,
  };

  let currentHover = $state(null);
  let width = $state();
  let height = $state();
  let loaded = $state(false);

  const theme = getContext('theme');
  $effect(() => {
    if (theme) {
      currentHover = null;
    }
  });

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
  {#key currentHover}
    {#await (IllustrationsImports[currentHover] || (() => null))() then Component}
      {#if Component}
        <Component {width} {height} />
      {/if}
    {/await}
  {/key}
</div>

<div class="hero" onclick={() => { currentHover = null; }} onkeydown={() => { currentHover = null; }} role="button" tabindex="-1">
  <div class="grid">
    <div class="hero-text" class:selected={!!currentHover} class:loaded>
      <span class="name">Daniel Kao</span> is a
      <span
        class="link"
        class:active={currentHover === 'gj'}
        onmouseover={() => { currentHover = 'gj'; }}
        onclick={(e) => {
          e.stopPropagation();
          currentHover = 'gj';
        }}
        onfocus={(e) => {
          e.stopPropagation();
          currentHover = 'gj';
        }}
        onkeydown={() => {
          e.stopPropagation();
          currentHover = 'gj';
        }}
        role="button"
        tabindex="0"
      >news engineer</span> currently based in
      <span
        class="link"
        class:active={currentHover === 'az'}
        onmouseover={() => { currentHover = 'az'; }}
        onclick={(e) => {
          e.stopPropagation();
          currentHover = 'az';
        }}
        onfocus={(e) => {
          e.stopPropagation();
          currentHover = 'az';
        }}
        onkeydown={(e) => {
          e.stopPropagation();
          currentHover = 'az';
        }}
        role="button"
        tabindex="0"
      >Tucson, Arizona</span>.
    </div>
  </div>
</div>

