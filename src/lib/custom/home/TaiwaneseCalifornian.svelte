<script>
  import { fade } from 'svelte/transition';
</script>

<style>
  div {
    width: 100%;
    height: 100%;
    opacity: 0.8;
    background-image: url("/images/2022/01/joshua-tree.jpg");
    background-position: center;
    background-size: cover;
  }

  div > :global(*) {
    object-fit: cover;
  }
</style>

<div transition:fade />
