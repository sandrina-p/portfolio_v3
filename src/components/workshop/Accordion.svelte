<script>
  import { onMount } from 'svelte';
  import { setAccordion } from './accordion.js';

  export let summary;

  let accordion

  onMount(async () => {
    const details = document.querySelectorAll('.gAccordion');
    setAccordion(accordion)
  });
  
</script>

<style lang="postcss">
  .accordion {
    background-color: var(--bg_1);
    border-radius: 3px;
    box-shadow: 0.2rem 0.2rem var(--primary_1_smooth);
    height: var(--collapsed);
    overflow: hidden;
    transition: height 250ms ease-out;
    font-size: $font-M;
  }

  :global(.gAccordion) {    
    &[open] {
      height: var(--expanded);

      .summary {
        color: var(--primary_1);
      }
    }
  }

  .summary { 
    padding: $spacer-M;
    font-weight: 500;
    pointer: cursor;
    cursor: pointer;

    &:hover {
      color: var(--primary_1);
    }

    &:focus {
      outline: none;
    }
  }

  :global(body.js-tabbing) {
     .summary:focus {
       opacity: 0.1;
       border-radius: 3px;
       box-shadow: inset var(--bg_0) 0 0 0 2px, inset var(--primary_1_pair) 0 0 0 4px;
       outline: var(--focus_outline);
    }
  }

  .content {
    padding: 0 $spacer-M $spacer-M;
  }
</style>

<details class="accordion gAccordion" bind:this={accordion}>
  <summary class="summary">
    {summary}
  </summary>
  <div class="content">
    <slot></slot>
  </div>
</details>

