<script>
  import empty from './markup/_empty.svelte';
  import { genProps } from './utils';

  import a from './markup/a.svelte';
  import b from './markup/b.svelte';
  import code from './markup/code.svelte';
  import em from './markup/em.svelte';
  import i from './markup/i.svelte';
  import s from './markup/s.svelte';
  import strong from './markup/strong.svelte';
  import sub from './markup/sub.svelte';
  import sup from './markup/sup.svelte';
  import u from './markup/u.svelte';

  import softReturn from './atoms/softReturn.svelte';

  export let markups;
  export let markers;
  export let atoms;

  const markerMap = {
    a, b, code, em, i, s, strong, sub, sup, u,
  };
  const atomMap = { 'soft-return': softReturn };

  // Given a markup index, convert it to it's corresponding component
  // and props.
  const markupComponent = (markupIndex) => {
    // make sure that markupIndex is valid, otherwise return null
    if (markups[markupIndex]) {
      return {
        component: markerMap[markups[markupIndex][0]],
        props: genProps(markups[markupIndex][1]),
      };
    }
    return { component: null, props: {} };
  };
</script>

<!--
  Uses HTML comments to get rid of potential spaces that would get
  added with newlines
-->
{#each markers as { textTypeIdentifier, markupIndex, tree, atomIndex, lang }}<!--
  --><svelte:component
    this={markupComponent(markupIndex).component || empty}
    props={markupComponent(markupIndex).props}
    {lang}
  ><!--
    -->{#if textTypeIdentifier === 0}<!--
      -->{#if typeof tree === 'string'}<!--
        -->{tree}<!--
      -->{:else}<!--
        --><svelte:self {markups} markers={tree} /><!--
      -->{/if}<!--
    -->{:else if textTypeIdentifier === 1}<!--
      --><svelte:component
        this={atomMap[atoms[atomIndex][0]] || empty}
        props={atoms[atomIndex][2]}
        {lang}
      ><!--
        -->{atoms[atomIndex][1]}<!--
      --></svelte:component><!--
    -->{/if}<!--
  --></svelte:component><!--
-->{/each}
