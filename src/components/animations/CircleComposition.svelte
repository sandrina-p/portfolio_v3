<script>
  let circleCount = Array(7);
  export let isPaused; // bool
</script>

<style>
  .container {
    --size: 25rem;
    --speed: 4.5s;
    --delay: 150ms;
    --delay-1stframe: 1850ms;
    --ease: cubic-bezier(0.48, 0, 0.48, 1);
    --scaleStart: 0.8;
    --scaleEnd: 1;
    --rotate: 30deg;
    --rotatePivot: 2deg;
    --fill: rgba(251, 97, 119, 0.07);
    --distance: 45vw;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    height: var(--size);

    &.isPaused {
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
    stroke: white;
    stroke-width: 1;
    fill: var(--fill);
    animation: circleMove var(--speed) var(--ease) infinite alternate-reverse;
  }

  /* Svelte BUG: @for and &: dont work together */
  @for $i from 1 to 10 {
    .circle:nth-child($i) {
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

<div class="container" class:isPaused>
  {#each circleCount as circle}
    <svg viewbox="0 0 100 100" class="circle">
      <circle cx="50" cy="50" r="40" />
    </svg>
  {/each}
</div>
