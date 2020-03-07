<script>
  import HeadMeta from '../components/HeadMeta.svelte';
  import ResetCSS from '../theme/ResetCSS.svelte';
  import Theme from '../theme/Theme.svelte';
</script>

<HeadMeta />
<Theme />
<main>
  <slot />
</main>
