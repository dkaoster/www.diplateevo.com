<script>
  export let props;
</script>

<style lang="scss">
  .wrap {
    @include full-offset-cols;
    margin: 20px 0;
  }

  .wrap > :global(*) {
    max-width: 100%;
  }
</style>

<div class="wrap">
  {@html props.html}
</div>
