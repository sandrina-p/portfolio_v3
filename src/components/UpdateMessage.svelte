<script>
import { onMount } from 'svelte';
import { EMAIL_URL } from '../data/misc.js';

let isOld = false;

onMount(() => {
  isOld = !window.fetch
});

</script>
<style>
.text {
  font-size: 21px;
  outline: 2px dashed red;
  padding: 8px;
}
</style>


{#if isOld}
  <p style="margin-top: 16px;" class="text">
    Wow, your browser seems ancient and this website might not work as expected.
    <br/>
    Fear not, you can still reach me by <a href={EMAIL_URL} class="u-link">e-mail</a>!
  </p>
{/if}

<noscript>
  <p style="margin-top: 16px;" class="text">
    Well, this website works better with Javascript enabled.
    <br/>
    Fear not, you can still reach me by <a href={EMAIL_URL} class="u-link">e-mail</a>!
  </p>
</noscript>