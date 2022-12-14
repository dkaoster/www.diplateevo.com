<script context="module">
  throw new Error("@migration task: Replace error load function (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3293209)");

  // export function load({ error, status }) {
  //   return { props: { error, status } };
  // }
</script>

<script>
  import { dev } from '$app/env';

  export let status;
  export let error;
</script>

<style>
  .wrapper {
    margin-top: 80px;
    width: 100%;
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  h1 {
    font-size: 72px;
    margin: 0;
  }

  pre {
    font-size: 12px;
    line-height: 1.4em;
  }
</style>

<div class="wrapper">
  <h1>{status}</h1>
  <h3>{error.message}</h3>

  {#if dev && error.stack}
    <pre>{error.stack}</pre>
  {/if}
</div>

