<script>
  import { onMount } from 'svelte';
  import { _window } from '../stores/responsive.js';
  import { getInLimit } from '../utils';

  let elFooter;
  let scrollPivot;
  let progress = 0;
  let rx = 200;
  let isOnStage;
  let height = 10000;
  let scale1 = 0;
  let scale2 = 0;
  let scale3 = 0;
  // $: isActive = progress === 1;

  onMount(() => {
    setTimeout(() => {
      // TODO - only when reaching tools
      initAnimations()
    }, 3000);
  });

  function initAnimations() {
    let isIncreasing = true;
    let prevRXMode = 0;

    function handleScroll() {
      console.log('scrolling footer...');
      const scrollY = window.scrollY;
      const scrollYpivot = scrollY - scrollPivot;
      const goal = $_window.innerHeight/2;
      const percentage = getInLimit(((scrollYpivot) / goal), 0, 1);
      progress = percentage;
      // height += 100;
      scale1 = Math.abs((100 - scrollYpivot*0.2%200) * 0.01);
      scale2 = Math.abs((100 - (scrollYpivot-150)*0.2%200) * 0.01);
      scale3 = Math.abs((100 - (scrollYpivot-300)*0.2%200) * 0.01);
    }

    const watchFooter = ([{ isIntersecting, boundingClientRect, rootBounds }]) => {
      if (isIntersecting) {
        isOnStage = true;
        scrollPivot = window.scrollY - (rootBounds.height - boundingClientRect.top),        
        window.addEventListener('scroll', handleScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };

    const observer = new IntersectionObserver(watchFooter);

    observer.observe(elFooter);
  }

</script>
<style>
  .footer {
    position: relative;
    padding: 0 var(--spacer-M);
    min-height: 200vh;
    overflow: hidden;

    &.isOnStage {
      .canvas {
        display: block;
        animation: rotate 50s linear infinite;
      }
    }
  }

  .canvas {
    position: fixed;
    top: 50vh;
    left: 50vw;
    width: 20rem;
    height: 20rem;
    display: none;
    transform-origin: 50% 50%;
  }

  .figure {
    position: relative;
    width: 100%;
    height: 100%;
    transform-origin: 50% 50%;
    transform: scale(calc((var(--progress) * 1)));
  }

  .svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-origin: 50% 50%;
    transform: scale(calc((var(--scale) * 1)));
    transition: transform 500ms ease-out;

    &Rect {
      fill: var(--morph_color);
      stroke: var(--bg_1);
      stroke-width: 2px;
      stroke-dasharray: 10px 10px; 
    }
  }

  @keyframes rotate {
    from { transform: translate(-50%, -50%) rotate(0deg) }
    to { transform: translate(-50%, -50%) rotate(360deg) }
  }
</style>

<footer class="footer" class:isOnStage bind:this={elFooter}
  style="--progress: {progress}; height: {height}px;">
  <div class="canvas">
    <div class="figure">
      <svg class="svg"
        style="--scale: {scale1};"
        viewBox="0 0 201 201" xmlns="http://www.w3.org/2000/svg">
        <rect class="svgRect" x="1.13721" y="1.55859" width="198" height="198" rx={rx} />
      </svg>
      <svg class="svg"
        style="--scale: {scale2};"
        viewBox="0 0 201 201" xmlns="http://www.w3.org/2000/svg">
        <rect class="svgRect" x="1.13721" y="1.55859" width="198" height="198" rx={rx} />
      </svg>
      <svg class="svg"
        style="--scale: {scale3};"
        viewBox="0 0 201 201" xmlns="http://www.w3.org/2000/svg">
        <rect class="svgRect" x="1.13721" y="1.55859" width="198" height="198" rx={rx} />
      </svg>
    </div>
  </div>
</footer>
