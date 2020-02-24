<script>
  import { onMount } from 'svelte';
  import { strGeneral, updateGeneral } from '../stores/general.js';
  import CircleComposition from './CircleComposition.svelte';
  import NoScriptMsg from './NoScriptMsg.svelte';
  import { TIMEOUTS } from '../utils';

  const intro = `Hi, it's Sandrina`;
  let hasntScrollYet = true

  onMount(() => {
    setTimeout(() => {
      updateGeneral({ isIntroAnimated: true });
    }, TIMEOUTS.INTRO_ANIMATED);
  });
</script>

<style>
  $titleChars: 17;
  $titleTempo: 200ms; 
  $circleSizeHalf: 10rem;

  @define-mixin motionDefault { :global(.jsMotionDefault) & { @mixin-content; } }
  @define-mixin motionReduced { :global(.jsMotionReduced) & { @mixin-content; } }

  .intro {
    padding: calc($layout-margin*3) $layout-margin 0;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .title {
    /* OPTMIZE - centralize this * 0.8 thing */
    font-size: calc($font-heading_2 * 0.8);
    margin-bottom: $spacer-M;

    @media(--max-xs) {
      font-size: calc($font-heading_2 * 0.7);
    }

    @media(--lg) {
      font-size: $font-heading_2;
    }

    &-char:nth-child(4) {
      display: block; /* linebreak */
    }

    &-char {
      opacity: 0;
      animation: laserOn 500ms steps(8) forwards;
  
      /* 17 - $titleChars */
      @for $i from 1 to 17 {
        $titleTempo: 200ms;

        &:nth-of-type($i) {
          @if $i < 4 {
            animation-delay: calc($titleTempo + 50ms * ($i - 1));
          } @else {
            animation-delay: calc(($titleTempo*2) + 50ms * ($i - 1));
          }
        }
      }
    }

    &-char {
      @mixin motionReduced {
        animation-delay: -99s !important;
      }
    }
  }

  .text {
    font-size: $font-M;
    max-width: 28rem;
    opacity: 0;
    animation: laserOn 750ms calc($titleTempo + 50ms * $titleChars) steps(8) forwards;

    &:nth-of-type(2) {
      margin-top: $spacer-M;
      max-width: 24rem;
    }

    @mixin motionReduced { animation-delay: -9s; }
  }

  .animation {
    margin-top: $spacer-M;
    position: relative;
    opacity: 0;
    animation: fadeIn 1000ms calc($titleTempo + 50ms * ($titleChars+15)) forwards;
    
    @mixin motionReduced { animation-delay: -9s; }
  }

  @media (--md) {
    .intro {
      padding: 0 0 0 $layout-margin;
      width: 100vw;
      height: 100vh;
      min-height: auto;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      flex-shrink: 0;
    }

    .content {
      width: calc(50vw - $layout-margin);
      margin-bottom: 15vh;
      flex-grow: 0;
    }

    .text {
      max-width: 35rem;
      font-size: $font-L2;
    }

    .animation {
      margin-top: 0;
    }
  }

  @media(--lg) {
    .content {
      width: calc(50vw - $layout-margin - $circleSizeHalf);
    }
  }
</style>

<div class="intro" id="intro" tabindex="-1">
  <div class="content">
    <h1 class="f-title title" aria-label={intro}>
      {#each intro.split('') as char}
        <span class="title-char">{char}</span>
      {/each}
    </h1>
    <p class="text">
      I'm a UX Engineer who helps to turn ideas
      into accessible experiences.
    </p>
    <NoScriptMsg />
  </div>
  <div class="animation">
    <CircleComposition />
  </div>
</div>
