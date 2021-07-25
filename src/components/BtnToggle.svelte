<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

  export let isActive = false;
  export let klass = '';

  function toggle() {
		dispatch('change');
  }
</script>

<style lang="postcss">
  $size: 1.8rem;

  .toggle {
    position: relative;
    background: transparent;
    border: none;
    padding: 0;
    color: inherit;
    cursor: pointer;
    white-space: nowrap;
    font-size: $font-M;
    font-family: inherit;
    font-weight: 300;
    padding: calc($spacer-S + $spacer-XS) $spacer-S;
    white-space: nowrap;
    display: flex;
    align-items: center;

    &:hover {
      color: var(--primary_1);
      .btnDecor {
        border-color: var(--primary_1);
      }
    }

    &:focus {
      outline: none;
    }

    &[aria-pressed="true"] {
      .btnDecor::before {
        background-color: var(--primary_1);
        --ty: 50%;
      }
    }
  }

  .btnDecor {
    position: relative;
    display: block;
    width: calc($size*1.5);
    height: $size;
    border: 1px solid var(--text_0);
    border-radius: $size;
    margin-left: 0.8rem;
    box-sizing: content-box;
    
    &::before {
      content: '';
      position: absolute;
      display: block;
      width: $size;
      height: $size;
      border-radius: 50%;
      box-sizing: border-box;
      border: 2px solid var(--bg_1);
      background-color: var(--text_1);
      transform: translateX(var(--ty, 0));
      transition: background-color 250ms, transform 250ms cubic-bezier(0.0, 0.0, 0.2, 1); /* irony */
    }
  }
</style>

<button class="toggle {klass}" on:click={toggle} aria-pressed={isActive}>
  <slot></slot>
  <span class="btnDecor"></span>
</button>

