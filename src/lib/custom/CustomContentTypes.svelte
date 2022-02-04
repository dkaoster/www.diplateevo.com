<script>
  import { getContext } from 'svelte';
  import portfolioItem from './works/PortfolioItem.svelte';
  import archiemlRepl from './archieml/ArchieMLMarkdownHTML.svelte';

  export let type;
  export let value;

  const isRSS = getContext('isRSS') || false;

  const typeMap = {
    portfolioItem,
    archiemlRepl,
  };
</script>

{#if isRSS}
  <pre>
    This component is not available in RSS. To view, please open this page in a web browser.
  </pre>
{:else if typeMap[type]}
  <svelte:component this={typeMap[type]} {...value} />
{/if}
