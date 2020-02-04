<script>
  export let isActive;
</script>

<style>
  .gellyArea {
    --scale: 0;
    position: fixed;
    top: 20vh;
    left: calc(var(--scrollY) + 60vw);
    width: 40rem;
    height: 30rem;
    transform: translate3d(-50%, 0, 0) scale(var(--scale, 0));
    transform-origin: 0 100%;
    visibility: hidden;
    pointer-events: none;

    :global(.jsGoOn) & {
      transition: transform 400ms ease-in, visibility 0ms 400ms;
    }

    &.isActive {
      --scale: 1;
      visibility: visible;
      transition:
        visibility 0ms 0ms,
        transform 1000ms 200ms cubic-bezier(0.17, 0.55, 0.24, 1.01);

      .gellyItself {
        animation-play-state: running;
      }
    }
  }

  .gellyItself {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: var(--primary_1);
    box-shadow:
        inset 12rem 4.5rem 6.5rem var(--primary_1_darker),
        inset -3rem 11rem 8rem #fffc00,
        inset -10rem -90rem 4.5rem #00fff7;
    opacity: 0.1;
    animation:
      gelly 30s alternate-reverse infinite ease-in-out,
      live 20s alternate-reverse infinite ease-in-out;
    animation-play-state: paused;
  }

  @keyframes gelly {
    0%, 100% { border-radius: 60% 45% 47% 55% / 55% 48% 53% 60%; } 
    20% { border-radius: 54% 46% 40% 60% / 43% 57% 40% 65%; } 
    40% { border-radius: 40% 60% 46% 54% / 50% 60% 41% 50%; } 
    60% { border-radius: 56% 44% 60% 30% / 56% 44% 60% 30%; } 
    80% { border-radius: 46% 54% 35% 75% / 50% 50% 40% 65%; } 
  }

  @keyframes live {
    0%, 100% { transform: translate3d(10%, 10%, 0) }
    50% { transform: translate3d(-10%, -10%, 0) }
  }
</style>

<div class="gellyArea" class:isActive>
  <div class="gellyItself" />
</div>