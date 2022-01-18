<script>
  import { getContext } from 'svelte';
  import { sizeGen } from '$lib/utils/image';

  export let src;
  export let crops = [];
  export let caption;
  export let className = '';
  export let width = '100%';
  export let disableSrcSet = false;
  export let alt = 'photograph';
  export let loading = 'lazy';

  const baseAbsoluteURL = getContext('baseAbsoluteURL') || '';
  const isOwnImage = (typeof src === 'string') && src.indexOf('https://') !== 0;
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
    color: transparent;
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
    {#if !disableSrcSet && crops && !baseAbsoluteURL}
      <picture>
        {#each crops.sort((a, b) => a.width - b.width) as {image, width, format}}
          <source
            media="(max-width: {width}px)"
            srcset={sizeGen(image, width, format)}
            type="image/{{ jpg: 'jpeg' }[format] || format}"
          >
        {/each}

        <img {loading} {alt} {src} {width} />
      </picture>
    {:else}
      <img {loading} {alt} src="{isOwnImage ? baseAbsoluteURL : ''}{src}" {width} />
    {/if}
  {/if}

  {#if caption}<div class="caption">{@html caption}</div>{/if}
</div>
