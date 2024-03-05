<script>
  import { fade } from 'svelte/transition';
</script>

<style>
  div {
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background-image: url("/images/2024/03/arizona.jpg");
    background-position: center;
    background-size: cover;
  }

  div > :global(*) {
    object-fit: cover;
  }
</style>

<div transition:fade />
