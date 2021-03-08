<script>
  import ToggleTheme from './ToggleTheme.svelte';
</script>

<style lang="postcss">
  /* BUG: Something is wrong with Safari on standalone pages...
  The mask doesn't work. Workaround: use ::after */
  :global(.toggleTheme) {
    z-index: 2;

    :global(.sunMoon) {
      display: none;
    }

    &::after {
      content: '';
      width: 6px;
      height: 6px;
      display: block;
      background: var(--bg_0);
      position: absolute;
      top: 16px;
      right: 14px;
      transform-origin: 50% 50%;
      transform: scale(0);
      border-radius: 50%;
      transition: transform 200ms ease-out, fill 200ms ease-out;
    }

    &[aria-pressed='true']::after {
      transform: scale(3);
    }
  }
</style>

<ToggleTheme klass="toggleTheme" />
