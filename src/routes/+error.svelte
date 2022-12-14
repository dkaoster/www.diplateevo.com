<script>
  import { page } from '$app/stores';
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
  <h1>{$page.status}</h1>
  <h3>{$page.error.message}</h3>
</div>

