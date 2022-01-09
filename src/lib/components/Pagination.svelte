<script>
  import HomeDivider from './HomeDivider.svelte';

  export let pagination;
</script>

<style lang="scss">
  .pagination-button {
    color: var(--color);
    padding: 5px 0;
    font-family: 'Roboto Mono', monospace;
    text-transform: uppercase;
    font-size: 18px;
    font-weight: bold;

    &.newer {
      grid-column: 2 / span 2;
      align-self: start;
      text-align: left;
    }

    &.older {
      grid-column: 8 / span 2;
      align-self: end;
      text-align: right;
    }

    a {
      color: var(--color);
      transition: 0.2s;
      text-decoration: none;

      &:hover {
        color: $primary-color;
      }
    }
  }

  @media screen and (max-width: $device-medium) {
    .pagination-button.newer {
      grid-column: 2 / span 3;
    }

    .pagination-button.older {
      grid-column: 9 / span 3;
    }
  }

  @media screen and (max-width: $device-small) {
    .pagination-button.newer {
      grid-column: 1 / span 6;
    }

    .pagination-button.older {
      grid-column: 7 / span 6;
    }
  }
</style>

<HomeDivider />

{#if pagination.prev}
  <div class="pagination-button newer">
    <a
      href={pagination.prev === 1 ? '/' : `/page/${pagination.prev}`}
      rel=prefetch
    >
      newer posts
    </a>
  </div>
{/if}

{#if pagination.next}
  <div class="pagination-button older">
    <a href="/page/{pagination.next}" rel=prefetch>
      older posts
    </a>
  </div>
{/if}