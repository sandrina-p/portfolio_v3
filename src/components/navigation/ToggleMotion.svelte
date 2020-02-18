<script>
  import { onMount } from 'svelte';
  let isReduced = false;

  onMount(() => {
    // jsMotionReduced || jsMotionDefault
    const isDefaultReduced = document.body.classList.contains('jsMotionReduced'); // done at template.html
    setReduced(isDefaultReduced);
  });

  function setReduced (bool) {
    isReduced = bool;
  }

  function toggleMotion() {
    const isNowReduced = !isReduced;
    setReduced(isNowReduced);

    // Don't use .toggle() to avoid possible desync when clicking toooo fast.
    const actionReduced = isNowReduced ? 'add' : 'remove';
    const actionDefault = isNowReduced ? 'remove' : 'add';
    // https://github.com/sveltejs/svelte/issues/3105
    document.body.classList[actionReduced]('jsMotionReduced');
    document.body.classList[actionDefault]('jsMotionDefault');
  }

  export let klass;
</script>

<style>
  .toggleMotion {
    position: relative;
    background: transparent;
    border: none;
    /* width: 4.4rem; */
    /* height: 4.4rem; */
    padding: 0;
    color: var(--text_1);
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      /* color: var(--primary_1); */
    }

    &:focus {
      outline: none;
    }

    &[aria-pressed="true"] {
      
    }
  }

  .icon {
    width: 80%;
    height: 80%;
    margin: 0 auto;

    &Part {
      fill: currentColor;
      stroke: var(--bg_0);
      stroke-width: 2px;

      &:nth-child(1) { fill: grey; }
      &:nth-child(2) { fill: #5b5b5b; }
    }
  }
</style>

<button class="toggleMotion {klass}"
  on:click={toggleMotion}
  aria-pressed={isReduced}
  aria-label="Animations reduced">
  Motion: {isReduced ? 'Off' : 'On' }
</button>

