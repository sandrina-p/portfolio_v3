<script>
  import { onMount } from 'svelte';
  import { sendTrack } from '../../utils/analytics';
  import { updateMotion } from '../../stores/motion.js';
  import BtnToggle from '../BtnToggle.svelte'

  let isReduced = false; // TODO: from motion store
  const CLASS_INACTIVE = 'jsMotionDefault'
  const CLASS_ACTIVE = 'jsMotionReduced'

  onMount(() => {
    const isDefaultReduced = document.body.classList.contains('jsMotionReduced'); // done at template.html
    setReduced(isDefaultReduced);
  });

  function setReduced (bool) {
    isReduced = bool;
    updateMotion({ isReduced })
  }

  function toggle() {
    const isNowActive = !isReduced;

    const actionDefault = isNowActive ? 'remove' : 'add';
    const actionActive = isNowActive ? 'add' : 'remove';

    document.body.classList[actionActive](CLASS_ACTIVE);
    document.body.classList[actionDefault](CLASS_INACTIVE);
    document.body.classList.remove('jsMotionInitial');

    setReduced(isNowActive);
    sendTrack('reduced_motion_toggle', isNowActive);
  }

  export let klass = '';
</script>

<style lang="postcss">
  /* Reference to be used across the app */
  @define-mixin motionDefault { :global(.jsMotionDefault) & { @mixin-content; } }
  @define-mixin motionReduced { :global(.jsMotionReduced) & { @mixin-content; } }

</style>

<BtnToggle isActive={isReduced} on:change={toggle} klass={klass}>
  Reduced motion
</BtnToggle>
