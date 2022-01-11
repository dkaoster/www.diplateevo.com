<script>
  import { marked } from 'marked';

  export let type = 'ul';
  export let list;
</script>

<style>
  li { margin: 10px 0; }
</style>

{#if list}
  {#if type === 'ul'}
    <ul>{#each list as listEl}<li>{@html marked.parseInline(listEl)}</li>{/each}</ul>
  {:else if type === 'ol'}
    <ol>{#each list as listEl}<li>{@html marked.parseInline(listEl)}</li>{/each}</ol>
  {/if}
{/if}
