<script>
  import { getContext, onMount } from 'svelte';

  export let type;
  export let value;

  const isRSS = getContext('isRSS') || false;

  // The map that will store the keys to the custom components,
  // initializes empty so that we can dynamically import all components.
  let typeMap = {};

  // Gets the slug of the current page
  const slug = getContext('slug');

  // Dynamic import config by mapping the slug of the page
  // to import functions we use to import custom components.
  // This prevents our vendor bundle from exploding.
  const dynamicImport = {
    works: [{
      name: 'portfolioItem',
      componentImport: async () =>
        (await import('../custom/works/PortfolioItem.svelte')).default,
    }],
    archieml: [{
      name: 'archiemlRepl',
      componentImport: async () =>
        (await import('../custom/archieml/ArchieMLMarkdownHTML.svelte')).default,
    }],
  };

  // Load the components on mount.
  onMount(async () => {
    if (!isRSS) {
      const components = dynamicImport[$slug] || [];
      for (let i = 0; i < components.length; i++) {
        const { name, componentImport } = components[i];
        typeMap[name] = await componentImport();
      }
      // Sets the typemap for our components so that it can be reactive.
      typeMap = typeMap;
    }
  });
</script>

{#if isRSS}
  <pre>
    This component is not available in RSS. To view, please open this page in a web browser.
  </pre>
{:else if typeMap[type]}
  <svelte:component this={typeMap[type]} {...value} />
{/if}
