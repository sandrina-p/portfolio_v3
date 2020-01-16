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
    top: 25vh;
    left: calc(50vw - 25vh);
    width: 50vh;
    height: 50vh;
    border-radius: 50%;
    opacity: 0;
    animation: live 12s infinite linear;
    animation-play-state: paused;
    animation-delay: -5s;
    z-index: -1;

    :global(.jsGoOn) & {
      transition: opacity 300ms ease-in;
    }

    &.isActive {
      opacity: 1;
      transition: opacity 800ms 200ms ease-in;
      animation-play-state: running;

      &:nth-child(1) { transition-delay: 1200ms; }
      &:nth-child(2) { transition-delay: 400ms; }
      &:nth-child(3) { transition-delay: 1000ms; }
    }

    &:nth-child(1) {
      --scale: 1.3;
      background: linear-gradient(0deg, rgba(113, 168, 255, 0.28), transparent 71%);
    }

    &:nth-child(2) {
      --scale: 1.6;
      animation-direction: reverse;
      background: linear-gradient(140deg, rgba(0, 16, 255, 0.07), transparent 71%);
    }

    &:nth-child(3) {
      --scale: 1.9;
      background: linear-gradient(140deg, rgba(255, 0, 0, 0.21), transparent 31%),
        radial-gradient(circle at top right, rgba(0, 216, 255, 0.07), transparent 70%);
    }
  }

  @keyframes live {
    0% { transform: rotate(0deg) scale(var(--scale, 1)) }
    100% { transform: rotate(360deg) scale(var(--scale, 1)) }
  }

</style>

<div class="echos">
  <div class="echo" class:isActive={activeLevel > 0} />
  <div class="echo" class:isActive={activeLevel > 0} /> <!-- TODO THIS -->
  <div class="echo" class:isActive={activeLevel > 0} />
</div>
