<script>
  import Pagination from './Pagination.svelte';
  import StoryCard from './StoryCard.svelte';

  export let posts;
  export let pagination;
</script>

<style lang="scss">
  .grid-wrap {
    width: 100%;
    padding: 60px 0;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-column-gap: 20px;
    width: 100%;
    max-width: 1460px;
    margin: auto;
    padding: 0 30px;
    grid-auto-flow: dense;
  }

  @media screen and (max-width: $device-small) {
    .grid {
      padding: 0 15px;
    }
  }
</style>

<div class="grid-wrap">
  <div class="grid">

    {#each posts as post}
      <StoryCard {...post} />
    {/each}
    <Pagination {pagination} />
  </div>
</div>
