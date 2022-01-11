<script>
  import * as d3 from 'd3';
  import { sizeGen } from '$lib/utils/image';

  import HomeDivider from './HomeDivider.svelte';

  export let title;
  export let featureImage;
  export let description;
  export let publishDate;
  export let slug;
</script>

<style lang="scss">
  .content {
    grid-column: 2 / 7;
    cursor: pointer;
  }

  h2 {
    margin-bottom: 10px;
  }

  p {
    padding-right: 40px;
  }

  a {
    color: var(--color);
    transition: 0.2s;
    display: block;
    height: calc(100% - 60px);
    text-decoration: none;
  }

  .content:hover a, .image-wrap:hover + .content a {
    color: $primary-color;
  }

  .date {
    font-family: 'Roboto Mono', monospace;
    font-size: 12px;
    color: #AAA;
    margin: 30px 0;
  }

  .image-wrap {
    margin: 30px 0;
    grid-column: 7 / 10;
    padding-top: 100%;
    position: relative;
    overflow: hidden;
    align-self: start;
    opacity: var(--img-opacity);
  }

  .image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100%;
    width: auto;
    transition: 0.2s;
  }

  @media screen and (max-width: $device-medium) {
    .content {
      grid-column: 2 / 8;
    }

    .image-wrap {
      grid-column: 8 / 12;
    }
  }

  @media screen and (max-width: $device-small) {
    .content {
      grid-column: 1 / 8;
    }

    .image-wrap {
      grid-column: 8 / 13;
      margin: 20px 0;
    }

    h2 {
      margin-top: 15px;
      font-size: 1.3em;
    }

    p {
      display: none;
    }

    .date {
      margin: 20px 0;
    }
  }
</style>

<HomeDivider />

<div class="image-wrap">
  <a href="/{slug}" rel=prefetch>
    <img
      class="image"
      src={(featureImage && sizeGen(featureImage, 768)) || '/cover-default.jpg'}
      alt="Cover"
    >
  </a>
</div>

<div class="content">
  <a href="/{slug}" rel=prefetch>
    <h2>{title}</h2>
    {#if description}<p>{description}</p>{/if}
    <div class="date">
      {d3.timeFormat('%b %Y')(d3.timeParse('%Y/%m/%d')(publishDate))}
    </div>
  </a>
</div>
