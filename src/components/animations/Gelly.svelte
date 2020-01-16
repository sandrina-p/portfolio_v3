<script>
  import { _window } from '../../stores/responsive.js';
  import { afterGeneralUpdate } from '../../stores/general.js';
  import { getInLimit, getIOstatusHorizontal } from '../../utils';

  export let isActive;

  // let elGum;
  let elFog;
  let offsets = {
    // gum: 0,
    fog: 0,
  };

  $: wWidth = $_window && $_window.innerWidth;

  afterGeneralUpdate((prevState, state) => {
    if (!prevState.isReady && state.isReady) {
      // initParallaxHorizontal(elGum, { name: 'gum', offset: wWidth/4 });
      // initParallaxHorizontal(elFog, { name: 'fog', offset: wWidth/2 });
    }
  });

  function initParallaxHorizontal(element, {
    name = '',
    offset = 100,
  } = {}) {
    let scrollPivot;

    function verifyParallax() {
      console.log(':: parallaxing...', name)
      const percentage = (wWidth + (window.scrollY - scrollPivot)) / wWidth;
      offsets[name] = Math.round(percentage * offset) + 'px'
    }

    function watchGelly([entry]) {
      if(entry.isIntersecting) {
        scrollPivot = window.scrollY + entry.boundingClientRect.right
        window.addEventListener('scroll', verifyParallax);
      } else {
        window.removeEventListener('scroll', verifyParallax);
      }
    }

    const observer = new IntersectionObserver(watchGelly);
    observer.observe(element);
  }
</script>

<style>
  /* .gelly {
    position: absolute;
    height: 100vh;
    width: 100%;
    left: 0;
    top: 0;
    z-index: -1;
  } */

  .gumArea {
    --scale: 0;
    position: fixed;
    top: 20vh;
    left: calc(var(--scrollY) + 60vw);
    width: 40rem;
    height: 30rem;
    /* position: absolute;
    top: -15vh;
    left: -15%;
    width: 33vw;
    height: 33vh;
    transform: translate3d(var(--offset, -50%), 0, 0);
    */
    transform: translate3d(-50%, 0, 0) scale(var(--scale));
    transform-origin: 0 100%;
    pointer-events: none;

    :global(.jsGoOn) & {
      transition: transform 400ms ease-in;
    }

    /* prevent initial fadeIn */
    &.isActive {
      --scale: 1;
      transition: transform 1000ms 200ms cubic-bezier(0.17, 0.55, 0.24, 1.01);

      .gumItself {
        animation-play-state: running;
      }
    }
  }

  .gumItself {
    position: relative;
    width: 100%;
    height: 100%;
    background: var(--primary_1);
    box-shadow:
      /* border offset */
      /* -13px -46px var(--bg_0),
      -15px -48px var(--primary_1_darker), */

      /* bottom shadow */
      inset 119px 45px 65px var(--primary_1_darker),
      inset -33px 108px 88px #fffc00,
      inset -104px -89px 45px #00fff7;
    opacity: 0.1;
    animation:
      gelly 30s alternate-reverse infinite ease-in-out,
      live 20s alternate-reverse infinite ease-in-out;
    animation-play-state: paused;
  }


  /* .fogArea {
    position: absolute;
    bottom: 0;
    left: -50vw;
    width: 5vw;
    height: 5vw;
    transform: translateX(var(--offset));
  }

  .fogItself {
    position: relative;
    width: 100%;
    height: 100%;
    background: var(--primary_1);
    border-radius: 50%;
    margin-top: 25vw;
    opacity: 0.1;
    box-shadow: 0 0 30vw 30vw var(--primary_1);
    border-radius: 40% 60% 46% 54% / 50% 60% 41% 50%;
  } */

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

<!-- <div class="gelly"> -->
  <!-- <div class="gumArea" bind:this={ elGum } style="--offset: {offsets.gum}" style:isActive> -->

  <div class="gumArea" class:isActive>
    <div class="gumItself" />
  </div>
  <!-- <div class="fogArea" bind:this={ elFog } style="--offset: {offsets.fog}">
    <div class="fogItself"/>
  </div> -->
<!-- </div> -->
