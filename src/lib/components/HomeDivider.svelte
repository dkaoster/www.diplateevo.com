<style lang="scss">
  .divider {
    width: 100%;
    height: 4px;
    background-color: var(--color);
    grid-column: 2 / 10;
  }

  @media screen and (max-width: $device-medium) {
    .divider {
      grid-column: 2 / 12;
    }
  }

  @media screen and (max-width: $device-small) {
    .divider {
      grid-column: 1 / 13;
    }
  }
</style>

<div class="divider" />
