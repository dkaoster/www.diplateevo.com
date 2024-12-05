<script>
  import { getContext } from 'svelte';

  const locale = getContext('locale');

  const subscribeStrings = { en: 'Subscribe for Updates', zh: '訂閱電子報' };
  const subscribeSubmitStrings = { en: 'Subscribe', zh: '訂閱' };

  const subscribeLabel = $derived(subscribeStrings[$locale.locale || 'en'] || subscribeStrings.en);
  const subscribeSubmit = $derived(subscribeSubmitStrings[$locale.locale || 'en'] || subscribeSubmitStrings.en);
</script>

<style lang="scss">
  .wrapper {
    width: 100%;
    padding: 0 30px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 4px solid var(--color);
    width: 100%;
    max-width: 1400px;
    margin: auto;
    transition: all 0.5s;
    padding: 30px 0;
  }

  h3 {
    margin: 0;
  }

  form {
    font-family: 'Roboto Mono', monospace;
  }

  input {
    border-radius: 0;
    border: 2px solid var(--color);
    color: var(--color);
    background-color: invert(var(--color));
    padding: 3px 6px;
  }

  input[type="submit"] {
    background-color: $primary-color;
    border-color: $primary-color;
    color: white;

    &:hover {
      border-color: lighten($primary-color, 10);
      background-color: lighten($primary-color, 10);
    }
  }

  @media screen and (max-width: $device-small) {
    .wrapper {
      padding: 0 15px;
    }

    .footer {
      padding-top: 15px;
      display: block;
    }

    form {
      font-size: 0.8em;
    }
  }
</style>

<div class="wrapper">
  <div class="footer">
    <h3>Diplateevo</h3>

    <form
      action="https://buttondown.com/api/emails/embed-subscribe/diplateevo"
      method="post"
      target="popupwindow"
      onsubmit={() => { window.open('https://buttondown.com/diplateevo', 'popupwindow'); }}
      class="embeddable-buttondown-form"
    >
      <label for="bd-email">{subscribeLabel}</label>
      <input type="email" name="email" id="bd-email" placeholder="you@email.com" />

      <input type="submit" value={subscribeSubmit} />
    </form>
  </div>
</div>
