<script>
  import { getContext } from 'svelte';

  export let src;
  export let caption;
  export let className = '';
  export let alt = 'video';

  const baseAbsoluteURL = getContext('baseAbsoluteURL') || '';
  const isOwnVideo = (typeof src === 'string') && src.indexOf('https://') !== 0;
</script>

<style lang="scss">
  .video-wrap {
    opacity: var(--img-opacity);
    margin: 20px 0;
    @include content-offset-cols;
  }

  .video-wrap.full {
    text-align: center;
    @include full-offset-cols;
  }

  .video-wrap.cover {
    text-align: center;
    @include cover-offset-cols;
  }

  video {
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

<div class="video-wrap {className}">
  {#if typeof src === 'string'}
    <!-- svelte-ignore a11y_media_has_caption -->
    <video {alt} src="{isOwnVideo ? baseAbsoluteURL : ''}{src}" {...$$props}></video>
  {/if}

  {#if caption}<div class="caption">{@html caption}</div>{/if}
</div>
