<script>
export let activeLevel
</script>
<style>
  .echos {
    position: fixed;
    top: 0; left: 0;
    height: 100vh;
    width: 100%;
    z-index: -1;
    transform: translate(var(--scrollY));
    pointer-events: none;
  }

  .echo {
    position: absolute;
    top: 50vh;
    left: 50vw;
    width: 50vh; /* REVIEW this size... should be pixel perfect */
    height: 50vh;
    transform: scale(var(--scale, 1)) translate(-50%, -50%);
    transform-origin: 0 0;
    overflow: hidden;
    border-radius: 50%;
    opacity: 0;
    z-index: -1;

    :global(.jsGoOn) & {
      transition: opacity 300ms ease-in;
    }

    &::after { /* the gradient itself, as a mask */
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: calc(var(--width-PEOPLE) + 2rem); /* to match correctly on isRect morph */
      height: calc(var(--width-PEOPLE) + 2rem);
      transform: rotate(0deg) translate(-50%, -50%);
      transform-origin: 0 0;
      animation: live 15s infinite linear;
      animation-play-state: paused;  
    }

    /* &:nth-child(1) { --delayOpacity: 200ms }
    &:nth-child(2) { --delayOpacity: 100ms }
    &:nth-child(3) { --delayOpacity: 0ms } */

    &.isActive {
      opacity: 1;
      transition:
        opacity 800ms var(--delayOpacity, 500ms) ease-in,
        /* get ready to turn into .isRect */
        width 400ms 1ms ease-in-out,
        height 400ms 1ms ease-in-out,
        transform 400ms 1ms ease-in-out,
        border-radius 400ms 1ms ease-in-out;

        &:nth-child(1) { --delayOpacity: 500ms }

        /* a small delay to "popup effect" - TODO grow effect. */
        &:nth-child(2) { --delayOpacity: 1ms }
        &:nth-child(3) { --delayOpacity: 500ms }

      &::after {
        animation-play-state: running;
      }
    }

    &:nth-child(1) {
      --scale: 1.3;
      &::after {
        background: linear-gradient(70deg, rgba(113, 168, 255, 0.28), transparent 71%);
      }
    }

    &:nth-child(2) {
      --scale: 1.6;
      &::after {
        animation-direction: reverse;
        background: linear-gradient(200deg, rgba(0, 16, 255, 0.07), transparent 71%);
        
      }
    }

    &:nth-child(3) {
      --scale: 1.9;
      &::after {
        background: linear-gradient(-10deg, rgba(255, 0, 0, 0.21), transparent 38%),
          radial-gradient(circle at top right, rgba(0, 216, 255, 0.07), transparent 70%);
      }
    }

    .echos.isRect & {
      width: calc(var(--width-PEOPLE) + 1rem);
      /* TODO/NOTE: --width/--height could be agnostic, but let's move on... */
      height: calc(var(--height-PEOPLE) + 1rem);

      border-radius: 0;
      --scale: 1;

      &::after {
        animation-play-state: paused;
      }
    }

    .echos.isGone & {
      height: 0;
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
