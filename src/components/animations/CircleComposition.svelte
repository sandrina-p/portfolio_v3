<script>
  import { strCircle } from '../../stores/circle.js';

  let circleCount = Array(7);

  $: state = $strCircle;
  
  // const isPaused = state.isPaused;
  // const style = state.style;
</script>

<style>
  .container {
    --size: 20rem;
    --speed: 4.5s;
    --delay: 150ms;
    --delay-1stframe: 500ms;
    --ease: cubic-bezier(0.48, 0, 0.48, 1);
    --scaleStart: 0.8;
    --scaleEnd: 1;
    --rotate: 30deg;
    --rotatePivot: 2deg;
    --fill: var(--morph_color);
    --scrollY: 0px; /* to be manipulated by JS */
    --distance: calc(50vw - (var(--size) * 1.5));
    height: var(--size);
    width: var(--size);
    
    transform: translateX(calc(var(--scrollY, 0px) - 50%));

    &.isPaused {
      visibility: hidden;

      .circle {
        animation-play-state: paused;
      }
    }
  }

  .circle {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--size);
    stroke: var(--bg_1);
    stroke-width: 1;
    fill: var(--fill);
    animation: circleMove var(--speed) var(--ease) infinite alternate-reverse;
  }

  /* Svelte BUG: @for and &: dont work together */
  @for $i from 1 to 10 {
    .circle:nth-child($i) {
      /* make the animation start in the middle from the end */
      animation-delay: calc((var(--speed) * -1) - (-$i * var(--delay)) - var(--delay-1stframe));
      $dash: 0;
      $gap: 0;
      @if $i > 1 {
        $dash: calc(10 - $i);
        $gap: calc($i - 1);
      }
      stroke-dasharray: $dash, $gap;
      opacity: calc(1- (1 * $i * 0.07));
      --rotatePivot: calc($i * 3deg);

      transform: translateX(0)
        scale(var(--scaleStart))
        rotate(calc(0deg + var(--rotatePivot))); /* 1 */
    }
  }

  @keyframes circleMove {
    from {
      transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
      filter: drop-shadow(3px 0px 0px rgba(#900, 0.5));
    }
    to {
      transform: translateX(var(--distance)) scale(var(--scaleEnd))
        rotate(calc(var(--rotate) + var(--rotatePivot)));
      filter: drop-shadow(1px 0px 0px rgba(#900, 0.8));
    }
  }
</style>

<div class="container" class:isPaused={state.isPaused} style={state.style}>
  {#each circleCount as circle}
    <svg viewbox="0 0 100 100" class="circle">
      <circle cx="50" cy="50" r="49" />
    </svg>
  {/each}
</div>
