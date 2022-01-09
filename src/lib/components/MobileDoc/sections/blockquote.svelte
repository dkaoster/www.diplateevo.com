<script>
  export let props = {};
  export let lang;
</script>

<style lang="scss">
  // Do not class .md here, it will override the sibling settings
  blockquote {
    border-left: 4px solid var(--color);
    margin: 0 0 0.6em;
    padding: 0.6em 1.5em;
    font-style: italic;
  }

  :global(*:not(blockquote) + blockquote.md) {
    margin-top: 0.6em;
  }

  :global(blockquote.md + blockquote.md) {
    margin-top: -0.6em;
  }
</style>

<blockquote class="md" {...props} {lang}><slot /></blockquote>
