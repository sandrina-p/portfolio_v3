<script>
  export let isActive;
</script>

<style>
  .gellyArea {
    --scale: 0;
    position: fixed;
    top: 20vh;
    right: calc(var(--scrollY) - 15rem);
    width: 30rem;
    height: 25rem;
    transform: translate3d(-50%, 0, 0) scale(var(--scale, 0));
    transform-origin: 100% 100%;
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

    @media (--md) {
      right: auto;
      left: calc(var(--scrollY) + 60vw);
      width: 40rem;
      height: 30rem;
      transform-origin: 0 100%;
    }
  }

  .gellyItself {
    position: relative;
    width: 100%;
    height: 100%;
    box-shadow:
        inset 10rem -3rem 6rem #d7e7ff,
        inset 0rem 3rem 11rem #ffd8d8;
        /* inset 0rem -54rem 3rem #ffffd5; */
    opacity: 0.7;
    animation:
      gelly 30s alternate-reverse infinite ease-in-out,
      live 20s alternate-reverse infinite ease-in-out;
    animation-play-state: paused;
    animation-delay: -10s;
  }

  @keyframes gelly {
    0%, 100% { border-radius: 60% 45% 59% 55% / 55% 64% 58% 75%; } 
    20% { border-radius: 54% 46% 40% 60% / 43% 57% 40% 65%; } 
    40% { border-radius: 40% 60% 46% 54% / 50% 60% 41% 50%; } 
    60% { border-radius: 56% 44% 60% 30% / 56% 44% 60% 30%; } 
    80% { border-radius: 46% 54% 35% 75% / 50% 75% 30% 56%; } 
  }

  @keyframes live {
    0%, 100% { transform: translate3d(10%, 10%, 0) }
    50% { transform: translate3d(-10%, -10%, 0) }
  }
</style>

<div class="gellyArea" class:isActive>
  <div class="gellyItself" />
</div>