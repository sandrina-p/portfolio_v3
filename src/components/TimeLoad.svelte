<script>
import { onMount } from 'svelte';
import { SITE_REPO } from '../data/misc.js';

let time;

onMount(() => {
  const timing = (window.performance || {}).timing;
  if (!timing) { return; }
  const { navigationStart, loadEventEnd } = timing;
  const seconds = ((loadEventEnd - navigationStart) / 1000).toFixed(2);
  if(seconds < 0) { return; } // some bug?

  time = `${seconds}s`;
})
</script>
{#if time}
  <span><a href={SITE_REPO} target="_blank" class="u-link">Code</a> loaded in {time}.</span>
{:else}
  <span>View <a href={SITE_REPO} target="_blank" class="u-link">Code</a>.</span>
{/if}