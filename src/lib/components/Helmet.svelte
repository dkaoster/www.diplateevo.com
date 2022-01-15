<script>
  import { getContext } from 'svelte';

  const siteConfig = getContext('siteConfig');

  export let title;
  export let description;
  export let metaTitle;
  export let keywords;
  export let url;
  export let type = 'website';
  export let image = '/cover-default.jpg';
  export let siteName = siteConfig.title;
  export let locale = 'en_US';
</script>

<svelte:head>
  <title>{title} - {siteConfig.title}</title>

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.png" type="image/png">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">

  <meta name="title" content={metaTitle || title}>
  {#if keywords}<meta name="keywords" content={keywords}>{/if}
  {#if description}<meta name="description" content={description}>{/if}

  <meta property="og:title" content={metaTitle || title}>
  <meta property="og:type" content={type} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={`${siteConfig.baseURL}${image}`} />
  <meta property="og:site_name" content={siteName || title} />
  <meta property="og:locale" content={locale} />
  {#if description}<meta property="og:description" content={description}>{/if}

  <meta name="twitter:image" content={`${siteConfig.baseURL}${image}`}>
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={metaTitle || title} />
  <meta name="twitter:description" content={description}>

  <script async defer data-domain={siteConfig.domain} src="https://plausible.io/js/plausible.js"></script>

  <slot />
</svelte:head>
