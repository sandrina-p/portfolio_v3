<script>
export let pattern;
export let isActive;
</script>

<style>
  .dots {
    position: absolute;
    height: 100vh;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1;
    pointer-events: none;
    visibility: hidden;

    &.isActive {
      visibility: visible;
    }
 
    &.pattern-A {
      transform: scale(1, -1);
      transform-origin: 50% 50%;

      .dot {
        &:nth-child(3),
        &:nth-child(5),
        &:nth-child(6),
        &:nth-child(7) {
          display: none;
        }

        &:nth-child(1) {
          --top: 75%;
          --left: 0;
        }

        &:nth-child(2) {
          --top: 10%;
          --left: 15%;
          --size: 1.6rem;
          box-shadow: 0 0 2px 2px var(--primary_1);
        }

        &:nth-child(4) {
          --left: 50%;
          --top: 60%;
          --size: 2.4rem;
        }
      }
    }
  }

  .dot {
    position: absolute;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    top: var(--top);
    left: var(--left);
    opacity: var(--opacity, 1);
    background-color: var(--primary_1);
    animation: live 5s alternate-reverse infinite ease-in-out;
    animation-play-state: paused;

    .dots.isActive & {
      animation-play-state: running;
    }

    &:nth-child(1) {
      --size: 1.2rem; --top: 20%; --left: 0%;
      --rotate: -180deg;
      animation-delay: -3s;
    }
    &:nth-child(2) {
      --size: 2.4rem; --top: 7%; --left: 20%; --opacity: 0.5;
      --rotate: 5deg;
      animation-duration: 3s;
      box-shadow: 0 0 1px 1px var(--primary_1);
    }
    &:nth-child(3) {
      --size: 0.8rem; --top: 30%; --left: 56%; --opacity: 0.5;
      animation-delay: -1s;
      box-shadow: 0 0 5px 5px var(--primary_1);
    }
    &:nth-child(4) {
      --size: 1.2rem; --top: 55%; --left: 30%;
      --rotate: -10deg;
      animation-duration: 4s;
    }
    &:nth-child(5) {
      --size: 2.4rem; --top: 80%; --left: -5%; --opacity: 0.7;
      animation-delay: -2s;
      box-shadow: 0 0 3px 3px var(--primary_1);
    }
    &:nth-child(6) {
      --size: 0.8rem; --top: 75%; --left: 15%;  --opacity: 0.9;
      --rotate: -5deg;
      animation-duration: 3s;
    }
    &:nth-child(7) {
      --size: 2rem; --top: 80%; --left: 46%; --opacity: 0.6;
      --rotate: 20deg;
      animation-delay: -2s;
    }
  }

  @keyframes live {
    0% { transform: rotate(var(--rotate, 0deg)) translate3d(0, 0, 0) }
    100% { transform: rotate(var(--rotate, 0deg)) translate3d(15px, 15px, 0) }
  }
</style>

<div class={`dots pattern-${pattern}`} class:isActive>
  <div class="dot" />
  <div class="dot" />
  <div class="dot" />
  <div class="dot" />
  <div class="dot" />
  <div class="dot" />
  <div class="dot" />
</div>
