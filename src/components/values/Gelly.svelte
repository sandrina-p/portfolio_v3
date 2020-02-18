<script>
  export let isActive;
</script>

<style>
  @define-mixin motionDefault { :global(.jsMotionDefault) & { @mixin-content; } }
  @define-mixin motionReduced { :global(.jsMotionReduced) & { @mixin-content; } }

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
      transition: transform 400ms ease-in, opacity 400ms ease-in, visibility 0ms 400ms;
      will-change: transform;
    }

    @mixin motionReduced {
      opacity: 0;
      --scale: 1;
    }

    &.isActive {
      --scale: 1;
      visibility: visible;
      will-change: unset;
      transition:
        visibility 0ms 0ms,
        opacity 1000ms 200ms cubic-bezier(0.17, 0.55, 0.24, 1.01),
        transform 1000ms 200ms cubic-bezier(0.17, 0.55, 0.24, 1.01);

      .gellyItself {
        animation-play-state: running;
      }

      @mixin motionReduced {
        opacity: 1;

        .gellyItself {
          animation-play-state: paused;
        }
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
        inset 10rem -3rem 6rem #d7eaff,
        inset 0rem 3rem 11rem #ffd8d8;
        /* inset 0rem -54rem 3rem #ffffd5; */
    opacity: 0.7;
    animation:
      gelly 30s alternate-reverse infinite ease-in-out,
      live 20s alternate-reverse infinite ease-in-out;
    animation-play-state: paused;
    animation-delay: -10s;

    :global(.dark) & {
      box-shadow:
        inset 10rem -3rem 6rem #586b88,
        inset 0rem 3rem 11rem #a07979;
    }
  }

  @keyframes gelly {
    0%, 100% { border-radius: 65% 68% 77% 50% / 59% 76% 58% 75%; } 
    20% { border-radius: 40% 58% 46% 54% / 50% 60% 41% 50%; } 
    40% { border-radius: 40% 60% 46% 54% / 50% 60% 41% 50%; } 
    60% { border-radius: 56% 44% 60% 30% / 56% 44% 60% 30%; } 
    80% { border-radius: 51% 52% 68% 36% / 56% 43% 60% 47%; } 
  }

  @keyframes live {
    0%, 100% { transform: translate3d(10%, 10%, 0) }
    50% { transform: translate3d(-10%, -10%, 0) }
  }
</style>

<div class="gellyArea" class:isActive>
  <div class="gellyItself" />
</div>