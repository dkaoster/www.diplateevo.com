<script>
  export let title;
  export let description;
  export let metaTitle;
  export let keywords;
  export let url;
  export let image = '/cover-default.jpg';
  export let siteName = 'Diplateevo';
  export let locale = 'en';
</script>

<svelte:head>
  <title>{title} - Diplateevo</title>

  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.png" type="image/png">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">

  <meta name="title" content={metaTitle || title}>
  <meta name="keywords" content={keywords}>
  <meta name="description" content={description}>
  <meta property="og:title" content={metaTitle || title}>
  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={image} />
  <meta property="og:site_name" content={siteName || title} />
  <meta property="og:locale" content={locale} />
  <meta property="og:description" content={description}>

  <meta name="twitter:image" content={image}>
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={metaTitle || title} />
  <meta name="twitter:description" content={description}>

  <script async defer data-domain="diplateevo.com" src="https://plausible.io/js/plausible.js"></script>
</svelte:head>
