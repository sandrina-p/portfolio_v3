<script>
  import { onMount } from 'svelte';
  import { sendTrack } from '../../utils/analytics';
  import BtnToggle from '../BtnToggle.svelte'

  let isActive = true;
  const CLASS_INACTIVE = 'jsContrastDefault'
  const CLASS_ACTIVE = 'jsContrastMore'

  onMount(() => {
    isActive = document.body.classList.contains(CLASS_ACTIVE); // done at template.html
  });

  function toggle() {
    const isNowActive = !isActive;

    // Don't use .toggle() to avoid possible desync when clicking toooo fast.
    const actionDefault = isNowActive ? 'remove' : 'add';
    const actionActive = isNowActive ? 'add' : 'remove';
    document.body.classList[actionDefault](CLASS_INACTIVE);
    document.body.classList[actionActive](CLASS_ACTIVE);
    isActive = isNowActive
    sendTrack('contrast_more_toggle', isNowActive);
  }

  export let klass = '';
</script>

<style lang="postcss">
  /* Reference to be used across the app */
  @define-mixin contrastDefault { :global(.jsContrastDefault) & { @mixin-content; } }
  @define-mixin contrastMore { :global(.jsContrastMore) & { @mixin-content; } }
</style>

<BtnToggle isActive={isActive} on:change={toggle} klass={klass}>
  Higher contrast
</BtnToggle>
