<script>
  import { _window } from '../../stores/responsive.js';
  import { afterGeneralUpdate } from '../../stores/general.js';
  import { getInLimit, getIOstatusHorizontal } from '../../utils';

  let elGum;
  let elFog;
  let offsets = {
    gum: 0,
    fog: 0,
  };

  $: wWidth = $_window && $_window.innerWidth;

  afterGeneralUpdate((prevState, state) => {
    if (!prevState.isReady && state.isReady) {
      // initParallaxHorizontal(elGum, { name: 'gum', offset: wWidth/4 });
      initParallaxHorizontal(elFog, { name: 'fog', offset: wWidth/2 });
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
  .gelly {
    position: absolute;
    height: 100vh;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1;
  }

  .gumArea {
    position: absolute;
    top: -15vh;
    left: -15%;
    width: 33vw;
    height: 33vh;
    transform: translate3d(var(--offset), 0, 0);
  }

  .gumItself {
    position: relative;
    width: 100%;
    height: 100%;
    background: var(--primary_1);
    box-shadow: inset -27px -31px 29px var(--primary_1_darker);
    opacity: 0.1;
    animation:
      gelly 30s alternate-reverse infinite ease-in-out,
      live 20s alternate-reverse infinite ease-in-out;
  }


  .fogArea {
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
  }

  @keyframes gelly {
    0%, 100% { border-radius: 60% 40% 45% 55% / 55% 45% 50% 60%; } 
    20% { border-radius: 54% 46% 40% 60% / 43% 57% 40% 65%; } 
    40% { border-radius: 40% 60% 46% 54% / 50% 60% 41% 50%; } 
    60% { border-radius: 56% 44% 60% 30% / 56% 44% 60% 30%; } 
    80% { border-radius: 46% 54% 35% 75% / 50% 50% 40% 65%; } 
  }

  @keyframes live {
    0%, 100% { transform: translate3d(0, 0, 0) }
    50% { transform: translate3d(-20%, -20%, 0) }
  }
</style>

<div class="gelly">
  <div class="gumArea" bind:this={ elGum } style="--offset: {offsets.gum}">
    <div class="gumItself" />
  </div>
  <div class="fogArea" bind:this={ elFog } style="--offset: {offsets.fog}">
    <div class="fogItself"/>
  </div>
</div>
