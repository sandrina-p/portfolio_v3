<script>
  import Contacts from './Contacts.svelte';
</script>

<style>
  .intro {
    display: flex;
    padding-top: 15vh;
    padding-left: 10rem;
    width: 100vw;
    height: 100vh;
  }

  .title {
    font-size: 7.5rem;
    margin-bottom: var(--spacer-L);
    font-family: 'PFDin', monospace;
    line-height: 1.2;
  }

  .text {
    font-size: 2.5rem;
    line-height: 1.5;
    max-width: calc(2.5rem * 20);

    &:nth-of-type(2) {
      margin-top: var(--spacer-L);
      max-width: calc(2.5rem * 14);
    }
  }

  .animation {
    position: relative;
    height: 30vw;
    width: 30vw;
    line-height: 30vw;
    margin-left: 10vw;
  }

  .container {
    --size: 15vw;
    --speed: 3s;
    --delay: 150ms;
    --ease: cubic-bezier(0.48, 0, 0.48, 1);
    --scaleStart: 0.8;
    --scaleEnd: 1;
    --rotate: 30deg;
    --rotatePivot: 2deg;
    --fill: transparent;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    height: var(--size);
    width: calc(var(--size) + 15vw);
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
  .circle:nth-child(1) {
    -webkit-animation-delay: calc((var(--speed) * -1) - -1 * var(--delay) - 2100ms);
    animation-delay: calc((var(--speed) * -1) - -1 * var(--delay) - 2100ms);
    stroke-dasharray: 0, 0;
    opacity: 0.9;
    --rotatePivot: 3deg;
    -webkit-transform: translateX(0) scale(var(--scaleStart))
      rotate(calc(0deg + var(--rotatePivot)));
    transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
  }
  .circle:nth-child(2) {
    -webkit-animation-delay: calc((var(--speed) * -1) - -2 * var(--delay) - 2100ms);
    animation-delay: calc((var(--speed) * -1) - -2 * var(--delay) - 2100ms);
    stroke-dasharray: 8, 1;
    opacity: 0.8;
    --rotatePivot: 6deg;
    -webkit-transform: translateX(0) scale(var(--scaleStart))
      rotate(calc(0deg + var(--rotatePivot)));
    transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
  }
  .circle:nth-child(3) {
    -webkit-animation-delay: calc((var(--speed) * -1) - -3 * var(--delay) - 2100ms);
    animation-delay: calc((var(--speed) * -1) - -3 * var(--delay) - 2100ms);
    stroke-dasharray: 7, 2;
    opacity: 0.7;
    --rotatePivot: 9deg;
    -webkit-transform: translateX(0) scale(var(--scaleStart))
      rotate(calc(0deg + var(--rotatePivot)));
    transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
  }
  .circle:nth-child(4) {
    -webkit-animation-delay: calc((var(--speed) * -1) - -4 * var(--delay) - 2100ms);
    animation-delay: calc((var(--speed) * -1) - -4 * var(--delay) - 2100ms);
    stroke-dasharray: 6, 3;
    opacity: 0.6;
    --rotatePivot: 12deg;
    -webkit-transform: translateX(0) scale(var(--scaleStart))
      rotate(calc(0deg + var(--rotatePivot)));
    transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
  }
  .circle:nth-child(5) {
    -webkit-animation-delay: calc((var(--speed) * -1) - -5 * var(--delay) - 2100ms);
    animation-delay: calc((var(--speed) * -1) - -5 * var(--delay) - 2100ms);
    stroke-dasharray: 5, 4;
    opacity: 0.5;
    --rotatePivot: 15deg;
    -webkit-transform: translateX(0) scale(var(--scaleStart))
      rotate(calc(0deg + var(--rotatePivot)));
    transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
  }
  .circle:nth-child(6) {
    -webkit-animation-delay: calc((var(--speed) * -1) - -6 * var(--delay) - 2100ms);
    animation-delay: calc((var(--speed) * -1) - -6 * var(--delay) - 2100ms);
    stroke-dasharray: 4, 5;
    opacity: 0.4;
    --rotatePivot: 18deg;
    -webkit-transform: translateX(0) scale(var(--scaleStart))
      rotate(calc(0deg + var(--rotatePivot)));
    transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
  }
  .circle:nth-child(7) {
    -webkit-animation-delay: calc((var(--speed) * -1) - -7 * var(--delay) - 2100ms);
    animation-delay: calc((var(--speed) * -1) - -7 * var(--delay) - 2100ms);
    stroke-dasharray: 3, 6;
    opacity: 0.3;
    --rotatePivot: 21deg;
    -webkit-transform: translateX(0) scale(var(--scaleStart))
      rotate(calc(0deg + var(--rotatePivot)));
    transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
  }
  .circle:nth-child(8) {
    -webkit-animation-delay: calc((var(--speed) * -1) - -8 * var(--delay) - 2100ms);
    animation-delay: calc((var(--speed) * -1) - -8 * var(--delay) - 2100ms);
    stroke-dasharray: 2, 7;
    opacity: 0.2;
    --rotatePivot: 24deg;
    -webkit-transform: translateX(0) scale(var(--scaleStart))
      rotate(calc(0deg + var(--rotatePivot)));
    transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
  }
  .circle:nth-child(9) {
    -webkit-animation-delay: calc((var(--speed) * -1) - -9 * var(--delay) - 2100ms);
    animation-delay: calc((var(--speed) * -1) - -9 * var(--delay) - 2100ms);
    stroke-dasharray: 1, 8;
    opacity: 0.1;
    --rotatePivot: 27deg;
    -webkit-transform: translateX(0) scale(var(--scaleStart))
      rotate(calc(0deg + var(--rotatePivot)));
    transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
  }
  .circle:nth-child(10) {
    -webkit-animation-delay: calc((var(--speed) * -1) - -10 * var(--delay) - 2100ms);
    animation-delay: calc((var(--speed) * -1) - -10 * var(--delay) - 2100ms);
    stroke-dasharray: 0, 9;
    opacity: 0;
    --rotatePivot: 30deg;
    -webkit-transform: translateX(0) scale(var(--scaleStart))
      rotate(calc(0deg + var(--rotatePivot)));
    transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
  }

  @-webkit-keyframes circleMove {
    from {
      -webkit-transform: translateX(0) scale(var(--scaleStart))
        rotate(calc(0deg + var(--rotatePivot)));
      transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
      -webkit-filter: drop-shadow(3px 0px 0px rgba(153, 0, 0, 0.5));
      filter: drop-shadow(3px 0px 0px rgba(153, 0, 0, 0.5));
    }
    to {
      -webkit-transform: translateX(15vw) scale(var(--scaleEnd))
        rotate(calc(var(--rotate) + var(--rotatePivot)));
      transform: translateX(15vw) scale(var(--scaleEnd))
        rotate(calc(var(--rotate) + var(--rotatePivot)));
      -webkit-filter: drop-shadow(1px 0px 0px rgba(153, 0, 0, 0.8));
      filter: drop-shadow(1px 0px 0px rgba(153, 0, 0, 0.8));
    }
  }

  @keyframes circleMove {
    from {
      -webkit-transform: translateX(0) scale(var(--scaleStart))
        rotate(calc(0deg + var(--rotatePivot)));
      transform: translateX(0) scale(var(--scaleStart)) rotate(calc(0deg + var(--rotatePivot)));
      -webkit-filter: drop-shadow(3px 0px 0px rgba(153, 0, 0, 0.5));
      filter: drop-shadow(3px 0px 0px rgba(153, 0, 0, 0.5));
    }
    to {
      -webkit-transform: translateX(15vw) scale(var(--scaleEnd))
        rotate(calc(var(--rotate) + var(--rotatePivot)));
      transform: translateX(15vw) scale(var(--scaleEnd))
        rotate(calc(var(--rotate) + var(--rotatePivot)));
      -webkit-filter: drop-shadow(1px 0px 0px rgba(153, 0, 0, 0.8));
      filter: drop-shadow(1px 0px 0px rgba(153, 0, 0, 0.8));
    }
  }
</style>

<div class="intro">
  <div>
    <h1 class="title">
      Oh,
      <br />
      hello there!
    </h1>
    <p class="text">
      Let me introduce you to somone who helps turn ideas into accessible experiences.
    </p>
    <p class="text">Her name is Sandrina Pereira and she’s a Frontend Developer.</p>

    <Contacts />
  </div>
  <div class="animation">
    <!-- Randomize the first animation the user sees -->
    <div class="container">
      <svg viewbox="0 0 100 100" class="circle">
        <circle cx="50" cy="50" r="40" />
      </svg>
      <svg viewbox="0 0 100 100" class="circle">
        <circle cx="50" cy="50" r="40" />
      </svg>
      <svg viewbox="0 0 100 100" class="circle">
        <circle cx="50" cy="50" r="40" />
      </svg>
      <svg viewbox="0 0 100 100" class="circle">
        <circle cx="50" cy="50" r="40" />
      </svg>
      <svg viewbox="0 0 100 100" class="circle">
        <circle cx="50" cy="50" r="40" />
      </svg>
      <svg viewbox="0 0 100 100" class="circle">
        <circle cx="50" cy="50" r="40" />
      </svg>
      <svg viewbox="0 0 100 100" class="circle">
        <circle cx="50" cy="50" r="40" />
      </svg>
    </div>
  </div>
</div>
