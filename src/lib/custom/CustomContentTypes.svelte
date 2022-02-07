<script>
  import { getContext } from 'svelte';

  export let type;
  export let value;

  const isRSS = getContext('isRSS') || false;

  // Dynamic import config by mapping the keys of the components
  // to import functions we use to import custom components.
  // This prevents our vendor bundle from exploding.
  const dynamicImport = {
    portfolioItem:
      async () => (await import('../custom/works/PortfolioItem.svelte')).default,
    archiemlRepl:
      async () => (await import('../custom/archieml/ArchieMLMarkdownHTML.svelte')).default,
  };
</script>

{#if isRSS}
  <pre>
    This component is not available in RSS. To view, please open this page in a web browser.
  </pre>
{:else if dynamicImport[type]}
  {#await dynamicImport[type]() then component}
    <svelte:component this={component} {...value} />
  {/await}
{/if}
