<script>
  import { getContext, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import createRegl from 'regl';
  import runAnimation from './earth-wind';

  // Keeps track of the width and height of the container
  let width = 0;
  let height = 0;

  // Contains the DOM element of the canvas
  let canvas;

  // Stores the device pixel ratio
  $: dpr = (typeof window === 'object') ? window.devicePixelRatio || 1 : 1;

  const theme = getContext('theme');

  // Data fetching
  let earthBaseDark;
  let earthBaseLight;
  let earthWindPng;
  let earthWindJson;

  const earthBaseImageDark = new Image();
  earthBaseImageDark.src = '/covers/earth-base-dark.jpg';
  earthBaseImageDark.onload = () => { earthBaseDark = earthBaseImageDark; };

  const earthBaseImageLight = new Image();
  earthBaseImageLight.src = '/covers/earth-base-light.jpg';
  earthBaseImageLight.onload = () => { earthBaseLight = earthBaseImageLight; };

  const earthBaseWind = new Image();
  earthBaseWind.src = '/covers/earth-wind.png';
  earthBaseWind.onload = () => { earthWindPng = earthBaseWind; };

  $: earthBase = ($theme === 'dark') ? earthBaseDark : earthBaseLight;

  fetch('/covers/earth-wind.json')
    .then((res) => res.json())
    .then((res) => { earthWindJson = res; });

  // Holds the regl object
  let regl;

  // Once canvas and all assets are available, kick off the animation
  $: {
    if (canvas && earthBase && earthWindPng && earthWindJson && !regl) {
      regl = createRegl(canvas);

      // Runs the earth animation
      runAnimation(regl, earthBase, earthWindPng, earthWindJson, canvas);
    }
  }

  // Destroys the regl context when we unmount
  onDestroy(() => { if (regl) regl.destroy(); });
</script>

<style>
  div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  canvas {
    opacity: 0.6;
  }
</style>

<div class="wrapper" bind:clientWidth={width} bind:clientHeight={height}>
  {#if width && height}
    <canvas
      transition:fade
      width={height * dpr}
      height={height * dpr}
      bind:this={canvas}
      style:width="{height}px"
    />
  {/if}
</div>
