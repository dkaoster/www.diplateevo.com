<script>
  export let props = {};
  export let lang;
</script>

<style>
  li {
    margin: 10px 0;
  }
</style>

<li {...props} {lang}><slot /></li>
