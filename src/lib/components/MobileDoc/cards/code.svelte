<script>
  export let props;
</script>

<style lang="scss">
  .code {
    @include full-offset-cols;
    padding: 30px;
    background-color: #222;
    color: #EEE;
    white-space: pre-wrap;
    margin: 20px 0;
    line-height: 1.6em;
    font-family: 'Roboto Mono', monospace;
  }
</style>

<code class="code">{props.code}</code>
