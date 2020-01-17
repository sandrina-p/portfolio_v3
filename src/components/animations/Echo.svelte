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

    /* TODO/NOTE: make this come from parent/props */
    --shape1S: var(--width-PEOPLE);
    --shape2W: var(--width-PEOPLE);
    --shape2H: var(--height-PEOPLE);
  }

  .echo {
    position: absolute;
    top: 50vh;
    left: 50vw;
    width: var(--shape1S); /* OPTIMIZE - Make this 2x smaller and adjust size */
    height: var(--shape1S);
    transform: scale(var(--scale, 1)) translate(-50%, -50%);
    transform-origin: 0 0;
    overflow: hidden;
    border-radius: 50%;
    opacity: 0;
    z-index: -1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);

    :global(.jsGoOn) & {
      transition: opacity 300ms ease-in;
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

    /* &:nth-child(1) { --delayOpacity: 200ms }
    &:nth-child(2) { --delayOpacity: 100ms }
    &:nth-child(3) { --delayOpacity: 0ms } */

    &.isActive {
      opacity: 1;
      transition:
        opacity 800ms var(--delayOpacity, 500ms) ease-in,
        /* get ready to next phase .isRect */
        border-radius 50ms 1ms ease-in-out,
        transform 450ms 1ms ease-in-out,
        clip-path 450ms 1ms ease-in-out;

      will-change: clip-path;

      &:nth-child(1) { --delayOpacity: 500ms }
      /* a small delay to "popup effect" - TODO grow effect. */
      &:nth-child(2) { --delayOpacity: 1ms }
      &:nth-child(3) { --delayOpacity: 500ms }

      &::after {
        animation-play-state: running;
      }
    }

    &:nth-child(1) {
      --scale: 0.85;
      &::after {
        background: linear-gradient(70deg, rgba(113, 168, 255, 0.28), rgba(255, 255, 255, 0) 71%);
      }
    }

    &:nth-child(2) {
      --scale: 1;
      &::after {
        animation-direction: reverse;
        background: linear-gradient(200deg, rgba(0, 16, 255, 0.07), rgba(255, 255, 255, 0) 71%);
        
      }
    }

    &:nth-child(3) {
      --scale: 1.2;
      &::after {
        background: linear-gradient(136deg, rgba(255, 0, 0, 0.21), rgba(255, 255, 255, 0) 30%),
          radial-gradient(circle at top right, rgba(0, 216, 255, 0.07), rgba(255, 255, 255, 0) 70%);
      }
    }

    .echos.isRect & {
      transition:
        transform 450ms ease-in-out,
        clip-path 450ms ease-in-out,
        border-radius 450ms 200ms ease-in-out;

      border-radius: 0;
      --scale: 1.02, 1.08;
    	--xLeft: calc((100% - var(--shape2W)) / 2);
      --yTop: calc((100% - var(--shape2H)) / 2);
      --xRight: calc(var(--shape2W) + ((100% - var(--shape2W)) / 2));
      --yBottom: calc(var(--shape2H) + ((100% - var(--shape2H)) / 2));

      clip-path: polygon(
        var(--xLeft) var(--yTop),
        var(--xRight) var(--yTop),
        var(--xRight) var(--yBottom),
        var(--xLeft) var(--yBottom)
      );

      &::after {
        animation-play-state: paused;
      }
    }

    .echos.isGone & {
      --yTop: 50%;
      --yBottom: 50%;
      will-change: none;
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
