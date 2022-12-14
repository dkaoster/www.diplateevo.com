<script>
  import { page } from '$app/stores';

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
</style>

<div class="wrapper">
  <h1>{status || $page.status}</h1>
  <h3>{(error && error.message) || $page.error.message}</h3>
</div>

