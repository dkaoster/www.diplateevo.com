<script>
  import { sizeGen } from '$lib/utils/image';

  export let title;
  export let featureImage;
  export let featureImageCrops;
  export let url;
  export let newTab;

  $: isOwnUrl = (typeof url === 'string') && url.indexOf('https://') !== 0;

  $: smallCrop = featureImageCrops && featureImageCrops.sort((a, b) => a.width - b.width)[0];
  $: featureImageSrc = smallCrop
    ? sizeGen(smallCrop.image, smallCrop.width, smallCrop.format)
    : featureImage;
  $: src = featureImageSrc || '/cover-default.jpg';
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
    color: transparent;
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

      h3 {
        margin: 0;
        font-size: 1.3em;
      }
    }
  }
</style>

<div class="work">
  <a
    class="content"
    href={url}
    {...((!newTab && isOwnUrl) ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
  >
    <h3>{title}</h3>
  </a>

  <img class="image" {src} alt="Cover" loading="lazy">
</div>
