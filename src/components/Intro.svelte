<script>
  import { onMount } from 'svelte';
  import { strGeneral, updateGeneral } from '../stores/general.js';
  import CircleComposition from './animations/CircleComposition.svelte';
  import { TIMEOUTS } from '../utils';

  const intro = 'Oh, hi there!';

  onMount(() => {
    setTimeout(() => {
      updateGeneral({ isReady: true });
    }, TIMEOUTS.INTRO_ANIMATED);
  });
</script>

<style>
  $titleChars: 13;
  $titleTempo: 200ms; 
  $padding: 10rem;
  $circleSizeHalf: 10rem;

  .intro {
    display: flex;
    padding-left: $padding;
    width: 100vw;
    height: 100vh;
    flex-shrink: 0;
    align-items: center;
    background-color: var(--bg_0);
  }

  .content {
    width: calc(50vw - $padding - $circleSizeHalf);
    margin-bottom: 12vh;
  }

  .title {
    font-size: var(--font-heading_2);
    margin-bottom: var(--spacer-L);

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
    font-size: var(--font-L2);
    max-width: 44rem;
    opacity: 0;
    animation: laserOn 750ms calc($titleTempo + 50ms * $titleChars) steps(8) forwards;

    &:nth-of-type(2) {
      margin-top: var(--spacer-M);
      max-width: 31rem;
    }
  }

  .animation {
    position: relative;
    opacity: 0;
    animation: fadeIn 1000ms calc($titleTempo + 50ms * $titleChars) forwards;
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
      Let me introduce you to someone who helps to turn ideas into accessible experiences.
    </p>
    <p class="text">Her name is Sandrina Pereira and she’s a UX Engineer.</p>
  </div>
  <div class="animation">
    <CircleComposition />
  </div>
</div>
