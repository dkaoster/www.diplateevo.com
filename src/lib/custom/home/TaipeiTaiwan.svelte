<script>
  export let width;
  export let height;

  const graphicWidth = 580;
  const graphicHeight = 550;

  // root element
  let el;

  // Light or dark mode
  $: color = (el
    && parseInt(getComputedStyle(el).getPropertyValue('--dark-mode'), 10)
    && 'white') || 'black';

  // Point Radius
  $: pointRadius = prioritizeWidth ? ((1 / width) * 800) + 1 : 2;

  // Direction to prioritize
  $: prioritizeWidth = (width / height) > (graphicWidth / graphicHeight);
</script>

<style lang="scss">
  .wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .taipei-map {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 100%;
    height: 100%;

    &.prioritizeWidth {
      width: 100%;
      min-height: 100%;
      height: initial;
      min-width: initial;
    }
  }

  .taipei-map {
    opacity: 0.4;
  }
</style>

<div class="wrapper" bind:this={el}>
  <img
    class="taipei-map"
    class:prioritizeWidth
    src="covers/taipei_streets_{color}.svg"
    alt="Taipei Map"
  >
</div>
