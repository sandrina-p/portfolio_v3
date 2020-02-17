<script>
  import { onMount, afterUpdate } from 'svelte';
  import { matchMq } from '../stores/responsive.js';
  import { strGeneral, updateGeneral } from '../stores/general.js';

  afterUpdate(() => {
    if (!$strGeneral.isReady && $strGeneral.isValuesLoaded && $strGeneral.isIntroAnimated) {
      updateGeneral({ isReady: true });
    }
  })

  export let hasScrolled;
</script>

<style>
  .tip {
    display: block;
    position: absolute;
    top: $spacer-S;
    left: 100vw;
    transform: translateX(calc(-100% + var(--scrollY, 0px)));
    padding-right: $spacer-MS;
    white-space: nowrap;
    visibility: visible;
    color: var(--text_1);

    &Text {
      position: relative;
      width: 8rem;
      height: 1.7em;
      display: block;
      opacity: 0;
      animation: fadeIn 400ms 2.3s forwards ease-out;

      &Status {
        position: absolute;
        top: 0; left: 0;
        opacity: 0;
        transition: opacity 150ms, visibility 0ms 150ms;
        visibility: hidden;

        &.asLoading {
          top: 100%;

          &.isActive {
            animation: fadeInWithPause 1s 2.3s alternate infinite ease-out;
          }
        }

        &.isActive {
          visibility: visible;
          opacity: 1;
          transition: opacity 400ms ease-out;

          .isHidden & {
            transition: opacity 250ms ease-out;
            opacity: 0;
            visibility: hidden;
          }
        }
      }
    }

    &::before {
      content: '';
      position: absolute;
      bottom: 0.1rem; /* with 0, it's not visible on safari */
      left: 0;
      height: 0.1rem;
      width: 100%;
      transform: translateX(100%);
      animation: slideIn 500ms 1.7s forwards ease-out;
    }

    /* Mask to hide */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: var(--bg_0);
      opacity: 0;
      transition: opacity 600ms ease-out;
    }

    &.isHidden {
      visibility: hidden;
      transition: visibility 0ms 1000ms;

      &::after {
        opacity: 1;
      }
    }
  }

  @media (--md) {
    .tip {
      top: 50%;

      &::before {
        background-color: var(--primary_1);
      }

      &text {
        width: 11rem;
      }

    }
  }

  @keyframes slideIn {
    0% { transform: translateX(100%) }
    100% { transform: translateX(0) }
  }
</style>

<span class="tip" aria-hidden="true"
  class:isHidden={hasScrolled || ($strGeneral.isReady && !$matchMq.md)}>
  <span class="tipText">
    <span class="tipTextStatus asLoading" class:isActive={!$strGeneral.isReady}>
      Loading...
    </span>
    <span class="tipTextStatus" class:isActive={$strGeneral.isReady}>
      Start scrolling
    </span>
  </span>
</span>