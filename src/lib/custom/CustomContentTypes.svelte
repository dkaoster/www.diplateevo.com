<script>
  import portfolioItem from './works/PortfolioItem.svelte';

  export let type;
  export let value;

  const typeMap = {
    portfolioItem,
  };
</script>

{#if typeMap[type]}
  <svelte:component this={typeMap[type]} {...value} />
{/if}
