<script>
export let activeLevel;
</script>

<style>
  @define-mixin motionDefault { :global(.jsMotionDefault) & { @mixin-content; } }
  @define-mixin motionReduced { :global(.jsMotionReduced) & { @mixin-content; } }

  .echos {
    position: fixed;
    top: 0; left: 0;
    height: 100vh;
    width: 100%;
    z-index: -1;
    transform: translate(var(--scrollY));
    pointer-events: none;

    /* OPTIMIZE: make this come from parent/props */
    --shape1S: var(--width-PEOPLE);
    --shape2W: var(--width-PEOPLE);
    --shape2H: var(--height-PEOPLE);
  }

  .echo {
    --t_x: 0%;
    --t_y: 0%; /* initial bottom effect - back to 0 for performance reasons */
    position: absolute;
    top: 50vh;
    left: 50vw;
    width: calc(var(--shape1S) / 4); /* reduce GPU memory */
    height: calc(var(--shape1S) / 4);
    transform: scale(var(--scale, 1)) translate(calc(-50% + var(--t_x)), calc(-50% + var(--t_y)));
    transform-origin: 0 0;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    z-index: -1;
  	clip-path: inset(0 round 50%);	

    :global(.jsGoOn) & {
      transition:
        opacity 300ms var(--delayOpacity) ease-out,
        transform 300ms var(--delayOpacity) ease-out,
        visibility 0ms 600ms;
    }

    &::after { /* the gradient itself, as a mask */
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      transform: rotate(0deg) translate(-50%, -50%);
      transform-origin: 0 0;
      animation: live 15s infinite linear;
      animation-play-state: paused;  
    }

    &:nth-child(1) { --delayOpacity: 170ms }
    &:nth-child(2) { --delayOpacity: 100ms }
    &:nth-child(3) { --delayOpacity: 0ms }

    &.isActive {
      opacity: 1;
      visibility: visible;
      --t_y: 0rem;
      transition:
        opacity 700ms var(--delayOpacity) ease-in,
        /* get ready to next phase .isRect */
        transform 1000ms var(--delayOpacity) cubic-bezier(0.19, 1, 0.22, 1),
        clip-path 450ms 1ms ease-in-out;

      @mixin motionReduced {
        transition:
          opacity 700ms ease-in,
          /* get ready to next phase .isRect */
          transform 1000ms cubic-bezier(0.19, 1, 0.22, 1),
          clip-path 450ms 1ms ease-in-out;
      }

      will-change: clip-path;

      &:nth-child(1) { --delayOpacity: 250ms }
      /* a small delay to "popup effect" - TODO grow effect. */
      &:nth-child(2) { --delayOpacity: 1ms }
      &:nth-child(3) { --delayOpacity: 250ms }

      &::after {
        @mixin motionDefault {
          animation-play-state: running;
        }
      }
    }

    &:nth-child(1) {
      --scale: 3.5;
      &::after {
        background: linear-gradient(70deg, rgba(113, 168, 255, 0.28), rgba(255, 255, 255, 0) 71%);
      }
    }

    &:nth-child(2) {
      --scale: 4.2;
      &::after {
        animation-direction: reverse;
        background: linear-gradient(200deg, rgba(0, 16, 255, 0.07), rgba(255, 255, 255, 0) 71%);
      
        :global(.dark) & {
          background: linear-gradient(200deg, rgba(205, 102, 255, 0.21) -15%, rgba(255, 255, 255, 0) 48%);
        }
      }
    }

    &:nth-child(3) {
      --scale: 5;
      &::after {
        background: linear-gradient(136deg, rgba(255, 0, 0, 0.21), rgba(255, 255, 255, 0) 30%);
      
        :global(.dark) & {
          background: linear-gradient(136deg, rgba(221, 141, 141, 0.33), rgba(255, 255, 255, 0) 30%);
        }
      }
    }

    .isRect & {
      transition:
        transform 450ms ease-in-out,
        opacity 450ms ease-in-out,
        clip-path 450ms ease-in-out;

      --gut: 0rem; 
      --ratio: 1;
      --y: calc(var(--shape2H)/4 * 1.65); /* 1.7 - eye picky */
      --x: calc(var(--shape2W)/4 * 0.1 - var(--gut)); /* 0.1*4 = size reduction GPU */

      clip-path: inset(var(--y) var(--x));

      &:nth-child(1) {
        --t_y: 3rem;
        --t_x: 2rem;
      }

      &:nth-child(2) {
        --t_y: -2rem;
        --t_x: -2rem;
      }

      &:nth-child(3) {
        --gut: 0.3rem;
        --t_x: 1rem;
      }
    }

    .isGone & {
      will-change: unset;
      visibility: hidden;

      &::after {
        animation-play-state: paused;
      }
    }

    @media (--max-md) {
      &.isActive {
        &:nth-child(1) { --delayOpacity: 250ms }
        &:nth-child(2) { --delayOpacity: 450ms }
        &:nth-child(3) { --delayOpacity: 700ms }
      }

      .echos:not(.isRect) & {
        &:nth-child(1) { --scale: 1.5; }
        &:nth-child(2) { --scale: 2.2; }
        &:nth-child(3) { --scale: 3; }
      }

      .isRect & {
        &:nth-child(1) { --t_y: -2rem; --t_x: -6rem; }
        &:nth-child(2) { --t_y: -3rem; --t_x: 4rem; }
        &:nth-child(3) { --t_y: 0rem; --t_x: -5rem; }
      }

      .isGone & {
        transition: opacity 500ms ease-in-out,
          visibility 0ms 500ms;
        opacity: 0;
      }
    }
  }

  @keyframes live {
    0% { transform: rotate(0deg) translate(-50%, -50%); }
    100% { transform: rotate(360deg) translate(-50%, -50%); }
  }

</style>

<div class="echos"
  class:isRect={activeLevel > 2}
  class:isGone={activeLevel > 3}>
  <div class="echo" class:isActive={activeLevel > 0} />
  <div class="echo" class:isActive={activeLevel > 1} />
  <div class="echo" class:isActive={activeLevel > 1} />
</div>
