<script>
  import Markup from './markup.svelte';
  import {
    processMarkers, genProps, assignLang, mode,
  } from './utils';

  import aside from './sections/aside.svelte';
  import blockquote from './sections/blockquote.svelte';
  import h1 from './sections/h1.svelte';
  import h2 from './sections/h2.svelte';
  import h3 from './sections/h3.svelte';
  import h4 from './sections/h4.svelte';
  import h5 from './sections/h5.svelte';
  import h6 from './sections/h6.svelte';
  import p from './sections/p.svelte';

  import img from './sections/img.svelte';

  import ol from './sections/ol.svelte';
  import ul from './sections/ul.svelte';
  import li from './sections/li.svelte';

  import code from './cards/code.svelte';
  import embed from './cards/embed.svelte';
  import hr from './atoms/hr.svelte';
  import html from './atoms/html.svelte';

  export let mobiledoc;

  const tagMap = {
    aside, blockquote, h1, h2, h3, h4, h5, h6, p, ol, ul,
  };
  const cardMap = {
    image: img, code, embed, hr, html,
  };
</script>

{#each mobiledoc.sections as [ sectionTypeIdentifier, arg1, arg2, arg3 ]}

  <!-- Markup -->
  {#if sectionTypeIdentifier === 1}
    <!--
      1. tagName
      2. markers
      3. optionalSectionAttributesArray
    -->
    <svelte:component
      this={tagMap[arg1]}
      props={genProps(arg3)}
      lang={mode(assignLang(processMarkers(arg2)).map((d) => d.lang))}
    >
      <Markup
        markups={mobiledoc.markups}
        markers={assignLang(processMarkers(arg2))}
        atoms={mobiledoc.atoms}
      />
    </svelte:component>

  <!-- Image -->
  {:else if sectionTypeIdentifier === 2}
    <!--
      1. src
    -->
    <svelte:component this={img} src={arg1} />

  <!-- List -->
  {:else if sectionTypeIdentifier === 3}
    <!--
      1. tagName
      2. markers
      3. optionalSectionAttributesArray
    -->
    <svelte:component
      this={tagMap[arg1]}
      props={genProps(arg3)}
      lang={mode(arg2.map(
        (markers) => mode(assignLang(processMarkers(markers)).map((d) => d.lang)),
      ))}
    >
      {#each arg2 as markers}
        <svelte:component this={li}>
          <Markup
            markups={mobiledoc.markups}
            markers={assignLang(processMarkers(markers))}
            atoms={mobiledoc.atoms}
          />
        </svelte:component>
      {/each}
    </svelte:component>

  <!-- Card -->
  {:else if sectionTypeIdentifier === 10}
    <!--
      1. cardName
      2. props
    -->
    {#if cardMap[mobiledoc.cards[arg1][0]]}
      <svelte:component
        this={cardMap[mobiledoc.cards[arg1][0]]}
        props={mobiledoc.cards[arg1][1]}
      />
    {/if}
  {/if}
{/each}
