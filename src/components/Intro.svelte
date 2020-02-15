<script>
  import { onMount } from 'svelte';
  import { strGeneral, updateGeneral } from '../stores/general.js';
  import CircleComposition from './CircleComposition.svelte';
  import { TIMEOUTS } from '../utils';

  const intro = 'Oh, hi there!';
  let hasntScrollYet = true

  onMount(() => {
    setTimeout(() => {
      updateGeneral({ isReady: true });
    }, TIMEOUTS.INTRO_ANIMATED);
  });
</script>

<style>
  $titleChars: 13;
  $titleTempo: 200ms; 
  $circleSizeHalf: 10rem;

  .intro {
    padding: calc($layout-margin*2) $layout-margin 0;
    min-height: var(--w-height);
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
    /* TODO - centralize this * 0.8 thing */
    font-size: calc($font-heading_2 * 0.8);
    margin-bottom: $spacer-M;

    @media(--md) {
      font-size: $font-heading_2;
    }

    &-char {
      opacity: 0;
      animation: laserOn 500ms steps(8) forwards;
  
      /* 13 $titleChars */
      @for $i from 1 to 13 {
        $titleTempo: 200ms;

        &:nth-of-type($i) {
          @if $i == 4 {
            display: block; /* linebreak */
          }

          @if $i < 4 {
            animation-delay: calc($titleTempo + 50ms * ($i - 1));
          } @else {
            animation-delay: calc(($titleTempo*2) + 50ms * ($i - 1));
          }
        }
      }
    }
  }

  .text {
    font-size: $font-M;
    max-width: 25rem;
    opacity: 0;
    animation: laserOn 750ms calc($titleTempo + 50ms * $titleChars) steps(8) forwards;

    @media(--md) {
      font-size: $font-L2;
    }

    &:nth-of-type(2) {
      margin-top: $spacer-M;
      max-width: 24rem;

      @media(--md) {
        max-width: 31rem;
      }
    }
  }

  .animation {
    margin-top: $spacer-M;
    position: relative;
    opacity: 0;
    animation: fadeIn 1000ms calc($titleTempo + 50ms * $titleChars) forwards;
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
      width: calc(50vw - $layout-margin - $circleSizeHalf);
      margin-bottom: 15vh;
      flex-grow: 0;
    }

    .text {
      max-width: 42rem;
    }

    .animation {
      margin-top: 0;
    }
  }
</style>

<div class="intro" id="intro">
  <div class="content">
    <h1 class="f-mono title" aria-label={intro}>
      {#each intro.split('') as char}
        <span class="title-char">{char}</span>
      {/each}
    </h1>
    <p class="text">
      Let me introduce myself. I love to help
      turning ideas into accessible experiences.
    </p>
    <p class="text">
      My name is Sandrina Pereira
      and I'm a UX Engineer.
    </p>
  </div>
  <div class="animation">
    <CircleComposition />
  </div>
</div>
