<script>
  import Helmet from '$lib/components/Helmet.svelte';
  import Error from '../__error.svelte';

  const message = 'Page Not Found';
</script>

<Helmet title={message} />

<Error status="404" error={{ message }} />
