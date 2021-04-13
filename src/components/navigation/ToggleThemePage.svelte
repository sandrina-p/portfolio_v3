<script>
  import { onMount } from 'svelte';
  import ToggleTheme from './ToggleTheme.svelte';

  let isActive = false
  onMount(() => {
    isActive = true
  });
</script>

<style lang="postcss">
  /* BUG: Something is wrong with Safari on standalone pages...
  The mask doesn't work. Update 2021 April: The bug is gone? */
  
  /* ----- */
  /* BUG: The Svelte hydratation issue is back (check LEARNINGS notes) :(
    Workaround: Use JS to show the icon.
    Probably do the same to Intro. a mix of script and noscript
  */
  :global(.toggleFade) {
    opacity: 0;
  }

  :global(.isActive) {
    animation: fadeInWithPause 500ms forwards ease-out;
  }
</style>

<ToggleTheme klass="toggleFade {isActive ? 'isActive' : ''}" />
