<script context="module">
  export async function load({ fetch, params: { slug } }) {
    // Get the posts and pagination
    const data = await fetch(`/content/${slug}.json`).then((res) => res.json());

    // Return the data for this slug
    return (Object.keys(data).length) ? { props: { data } } : { status: 404 };
  }
</script>

<script>
  import { getContext } from 'svelte';
  import * as d3 from 'd3';
  import { browser } from '$app/env';
  import { defaultLocale } from '$lib/stores/locale';
  import Helmet from '$lib/components/Helmet.svelte';
  import Content from '$lib/components/Content.svelte';
  import Image from '$lib/components/partials/Image.svelte';
  import i18n from '../lib/utils/i18n.js';

  export let data;

  const locale = getContext('locale');
  const siteConfig = getContext('siteConfig');

  // Process the locale
  $: supportedLocales = Object.keys(data);
  $: isMultiLanguage = supportedLocales.length > 1;
  $: currLocaleData = data[$locale.locale] || data[defaultLocale] || data[supportedLocales[0]];
  $: currLocale = currLocaleData.locale;

  // And reactive updates
  $: isPage = currLocaleData.isPage;
  $: metaTitle = currLocaleData.metaTitle;
  $: title = currLocaleData.title;
  $: publishDate = currLocaleData.publishDate;
  $: description = currLocaleData.description;
  $: featureImage = currLocaleData.featureImage;
  $: featureImageCrops = currLocaleData.featureImageCrops;
  $: slug = currLocaleData.slug;
  $: content = currLocaleData.content;
  $: redirect = currLocaleData.redirect;

  $: helmet = {
    title: metaTitle || title,
    image: featureImage,
    description,
    type: 'article',
    url: `${siteConfig.baseURL}/${slug}/`,
  };
</script>

<style lang="scss">
  .grid-wrap {
    width: 100%;
    padding: 60px 0;
    transition: color 0.5s;
  }

  .grid-wrap.hide-text,
  .grid-wrap.hide-text .meta,
  .grid-wrap.hide-text :global(a),
  .grid-wrap.hide-text .button {
    color: var(--background-color);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 20px;
    width: 100%;
    max-width: 1460px;
    margin: auto;
    padding: 0 30px;
  }

  .grid > :global(*) {
    @include content-offset-cols;
  }

  .grid > :global(.extended), .grid > :global(img) {
    @include full-offset-cols;
  }

  .grid > :global(.wide) {
    @include cover-offset-cols;
  }

  .grid > :global(ul + ul) {
    margin-top: 0;
  }

  .grid > :global(blockquote) {
    border-left: 4px solid var(--color);
    margin: 0 0 0.6em;
    padding: 0.6em 1.5em;
    font-style: italic;

    :global(p) {
      font-size: 1em;
      margin: 0;
    }

    & + :global(blockquote) {
      margin-top: -0.6em;
    }
  }

  .title, .summary {
    grid-column: 1 / 13;
  }

  .title-offset, .summary-offset {
    @include content-offset-cols;
  }

  .title {
    font-family: 'Roboto Mono', monospace;
    font-weight: bold;
    margin: 50px 0 0;
  }

  .summary {
    margin-top: 15px;
  }

  .cover-image {
    @include cover-offset-cols;
    opacity: var(--img-opacity);
    margin-top: 20px;
  }

  .meta {
    font-family: 'Roboto Mono', monospace;
    color: #AAA;
    font-size: 12px;
    margin-top: 60px;
    text-transform: uppercase;
  }

  .language-toggle {
    margin: 20px 0;
  }

  .button {
    background: none;
    border: none;
    text-decoration: underline;
    color: $primary-color;
    padding: 0;
    font-family: Georgia, 'Noto Sans TC', serif;
    outline: none;

    &:hover {
      color: lighten($primary-color, 10);
    }
  }

  @media screen and (max-width: $device-small) {
    .grid {
      padding: 0 15px;
    }

    .cover-image {
      margin: 0 -15px;
    }

    .meta {
      margin-top: 20px;
    }
  }
</style>

<Helmet {...helmet}>
  {#if redirect}
    <meta http-equiv="Refresh" content="0; url='{redirect}'" />
  {/if}
</Helmet>

<article class="grid-wrap" lang={currLocale} class:hide-text={!browser && isMultiLanguage}>
  <div class="grid">
    <h1 class="title" class:title-offset={!featureImage}>
      {title}
    </h1>

    {#if featureImage}
      {#if description}
        <p class="summary" class:summary-offset={!featureImage}>
          {description}
        </p>
      {/if}
      <div class="cover-image">
        <Image src={featureImage} crops={featureImageCrops} className="cover" loading="eager" />
      </div>
    {/if}

    {#if !isPage}
      <div class="meta">
        {d3.timeFormat('%b %Y')(d3.timeParse('%Y/%m/%d')(publishDate))}
      </div>
    {/if}

    {#if isMultiLanguage}
      <div class="language-toggle">
        {#each supportedLocales.filter((l) => l !== currLocale) as toggleLocale}
          <button class="button" on:click={() => $locale.setLocale(toggleLocale)}>
            {i18n[toggleLocale].languageToggle}
          </button>
        {/each}
      </div>
    {/if}

    <Content {content} />
  </div>
</article>
