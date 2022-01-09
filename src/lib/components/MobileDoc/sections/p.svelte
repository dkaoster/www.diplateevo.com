<script>
  export let props = {};
  export let lang;
</script>

<style>
  p {
      margin: 0.6em 0;
  }
</style>

<p {...props} {lang}><slot /></p>
