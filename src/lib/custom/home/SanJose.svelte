<script>
  import { fade } from 'svelte/transition';
</script>

<style>
  div {
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background-image: url("/images/2022/08/san-jose.jpg");
    background-position: center;
    background-size: cover;
  }

  div > :global(*) {
    object-fit: cover;
  }
</style>

<div transition:fade></div>
