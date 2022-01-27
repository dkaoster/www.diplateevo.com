<script>
  import { onMount } from 'svelte';
  import { marked } from 'marked';
  import Image from './partials/Image.svelte';
  import List from './partials/List.svelte';
  import CustomContentTypes from '../custom/CustomContentTypes.svelte';

  export let content;

  // Needed for first mount of content on browser, otherwise the
  // initial language locale might be wrong
  let mounted = false;
  onMount(() => { mounted = true; });
</script>

<style>
  hr.grid-break {
    grid-column: 1 / -1;
    height: 24px;
    display: block;
    border: none;
    background: none;
  }
</style>

{#key mounted}
  {#each (content || []) as { type, value }}

    {#if type === 'text'}
      {@html marked.parse(value)}

    {:else if type.toLowerCase() === 'image'}
      <Image src={value} {...((typeof value === 'object') ? value : {})} />

    {:else if type.toLowerCase() === 'list'}
      <List {...((typeof value === 'object') ? value : {})} />

    {:else if type.toLowerCase() === 'embed'}
      {@html value}

    {:else if type.toLowerCase() === 'gridbreak'}
      <hr class="grid-break" />

    {:else}
      <CustomContentTypes {type} {value} />
    {/if}

  {/each}
{/key}
