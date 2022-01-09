<script>
  export let props = {};
</script>

<style lang="scss">
  a {
    text-decoration: underline;
    color: $primary-color;
    transition: 0.2s all;

    &:hover {
      color: lighten($primary-color, 10);
    }
  }
</style>

<a href="#blank" target="_blank" rel="noopener noreferrer" {...props}>
  <slot />
</a>