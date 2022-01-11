<script>
  import { sizeGen } from '$lib/utils/image';
  import { browser } from '$app/env';

  export let title;
  export let featureImage;
  export let url;

  $: imageUrl = (browser && featureImage) ? sizeGen(featureImage, 768) : '/cover-default.jpg';
</script>

<style lang="scss">
  .work {
    grid-column: span 3;
    padding-top: 100%;
    position: relative;
    overflow: hidden;
    align-self: start;
    margin-bottom: 20px;
  }

  .image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 100%;
    height: 100%;
    transition: 0.2s;
    pointer-events: none;
  }

  .content {
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 30px;
    color: var(--color);
    text-decoration: none;

    &:hover + .image {
      opacity: 0.1;
    }
  }

  @media screen and (max-width: $device-medium) {
    .work {
      grid-column: span 4;
    }

    .image {
      opacity: 0.2;
    }
  }

  @media screen and (max-width: $device-small) {
    .work {
      grid-column: span 6;
    }

    .content {
      padding: 10px;

      h2 {
        margin: 0;
        font-size: 1.3em;
      }
    }
  }
</style>

<div class="work">
  <a class="content" href={url} rel=prefetch>
    <h2>{title}</h2>
  </a>

  <img class="image" src={imageUrl} alt="Cover" loading="lazy">
</div>
