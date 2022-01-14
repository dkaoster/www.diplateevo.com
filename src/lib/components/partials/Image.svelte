<script>
  import { getContext } from 'svelte';
  import { sizeGen } from '$lib/utils/image';
  import { mode } from '$app/env';

  export let src;
  export let caption;
  export let className = '';
  export let width = '100%';
  export let disableSrcSet = false;
  export let alt = 'photograph';

  const websiteURL = 'https://www.diplateevo.com';
  const baseURL = getContext('baseURL') || '';
  const imageSizes = [768, 1280];
  const imageFormats = ['jpg'];

  $: isOwnImage = (typeof src === 'string') && src.indexOf('https://') !== 0 && !baseURL;
</script>

<style lang="scss">
  .image-wrap {
    @include content-offset-cols;
    opacity: var(--img-opacity);
    margin: 20px 0;
  }

  .image-wrap.full {
    @include full-offset-cols;
    text-align: center;
  }

  .image-wrap.cover {
    text-align: center;
    @include cover-offset-cols;
  }

  picture, img {
    max-width: 100%;
  }

  .caption {
    width: 100%;
    text-align: right;
    opacity: 0.5;
    font-size: 0.8em;
    font-family: Georgia, 'Noto Sans TC', serif;
  }
</style>

<div class="image-wrap {className}">
  {#if typeof src === 'string'}
    <picture>
      {#if isOwnImage && !disableSrcSet}
        {#each imageFormats as format}
          {#each imageSizes as size}
            <source
              media="(max-width: {size}px)"
              srcset={`${(mode === 'production') ? websiteURL : ''}${sizeGen(`${baseURL}${src}`, size, format)}`}
              type="image/jpeg"
            >
          {/each}
        {/each}
      {/if}

      <img loading="lazy" {alt} src="{baseURL}{src}" {width} />
    </picture>
  {/if}

  {#if caption}
    <div class="caption">
      {@html caption}
    </div>
  {/if}
</div>
