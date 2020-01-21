<script>
  import { onMount } from 'svelte';
  import { _window } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import { getInLimit } from '../utils';
  import throttle from 'lodash/throttle';
  import Contacts from './ContactsClean.svelte';

  $: wHeight = $_window && $_window.innerHeight;
  $: wWidth = $_window && $_window.innerWidth;
  const figSize = 200; /* OPTMIZE - access DOM */

  let elFooter;
  let elCard;

  let footerHeight = null;
  let isCardOnView = false;

  let progress = 0;
  let cardInitialScale = 0;
  let titleProgress = '100vw';
  let cardProgress = 0;
  let isVisible = false;
  let scale1 = 0;
  let scale2 = 0;
  let scale3 = 0;
  let animation;

  afterGeneralUpdate((prevState, state) => {
    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    if (!prevState.isReady && state.isReady) {
      animation = initAnimation();
    }
    
    if (prevPageSection !== pageSection && ['journey', 'contact'].includes(pageSection)) {
      animation.verify();
    }
  });

  function initAnimation() {
    const handleScroll = throttle(handleScrollLol, 16);
    const figHalf = figSize / 2;
    let titleGoal;
    let titleScrollPivot;
    let cardGoal;
    let cardScrollPivot;
    let cardWidthHalf;
    let cardHeightHalf;

    function handleScrollLol() {
      const scrollY = window.scrollY;
      const scrollYpivot = scrollY - titleScrollPivot;
      const percentage = getInLimit(scrollYpivot / titleGoal, 0, 1);

      progress = percentage;
      isVisible = progress >= 1;
      titleProgress = wWidth - wWidth * progress + 'px';

      // Set "thing" (circle) state
      scale1 = Math.abs((figHalf - ((scrollYpivot * 0.2) % figSize)) * 0.01);
      scale2 = Math.abs((figHalf - (((scrollYpivot - 150) * 0.2) % figSize)) * 0.01);
      scale3 = Math.abs((figHalf - (((scrollYpivot - 300) * 0.2) % figSize)) * 0.01);

      // Set card size
      if (isCardOnView) {
        const cardScrollYpivot = scrollY - cardScrollPivot;
        const cardPercentage = getInLimit(cardScrollYpivot / cardGoal, 0, 1);
        cardProgress = cardInitialScale - ((cardInitialScale - 1) * cardPercentage);
      }

      // Create illusion of infinite scroll 🔮
      // You may run a lot but you'll always be close to home.
      if(scrollYpivot > footerHeight - figSize) {
        window.scrollTo(0, titleScrollPivot + titleGoal);
      }
    }

    const watchFooter = ([{ isIntersecting, boundingClientRect, rootBounds }]) => {
      const wHeightHalf = wHeight/2;
      cardWidthHalf = cardWidthHalf || elCard.offsetWidth / 2;
      cardHeightHalf = cardHeightHalf || elCard.offsetHeight / 2;
      cardGoal = cardGoal || wHeightHalf + cardHeightHalf;
      cardInitialScale = cardInitialScale || wWidth / elCard.offsetWidth;

      titleGoal = titleGoal || wHeightHalf + wWidth / 2 + cardWidthHalf;

      if (isIntersecting) {
        footerHeight = titleGoal + figSize * 12;
        titleScrollPivot = window.scrollY - (rootBounds.height - boundingClientRect.top);
        window.addEventListener('scroll', handleScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };

    const watchCard = ([{ isIntersecting, boundingClientRect, rootBounds }]) => {
      isCardOnView = isIntersecting;
      cardScrollPivot = isIntersecting && window.scrollY - (rootBounds.height);
    };

    const observerFooter = new IntersectionObserver(watchFooter);
    const observerCard = new IntersectionObserver(watchCard);

    observerFooter.observe(elFooter);
    observerCard.observe(elCard);

    return {
      verify: handleScroll
    }
  }
</script>

<style>
  $cardW: 70rem; /* static content luxuries */
  $cardH: 30rem;

  .footer {
    position: relative;
    padding: 0 var(--spacer-M);
    min-height: 200vh;
    /* padding-top: 25vh; */
    /* overflow: hidden; */
    background-color: var(--bg_0);
  }

  .title,
  .card {
    position: sticky;
    top: 50vh;
  }

  .title {
    font-size: var(--font-heading_3);
    line-height: 1em;
    margin-left: calc(50vw - ($cardW/2));
    transform: translate(var(--titleProgress, 100vw), calc($cardH/-2 - 0.6em));
    z-index: 2; /* above card */
    margin-bottom: -2em; /* fake position: absolute, 2em = 2 lines */

    &-part {
      display: block;

      &:first-child {
        transform-origin: 0 100%;
        transform: translateY(0);
        transition: transform 150ms ease-out;

        .isVisible & {
          transform: translateY(-1em) scale(0.5);
          transition:
            transform 1000ms cubic-bezier(0.19, 1, 0.22, 1);
        }
      }

      &:last-child {
        color: var(--primary_1);
        opacity: 0;
        transform: translateY(0);
        transition: opacity 150ms ease-out, transform 150ms ease-out;

        .isVisible & {
          opacity: 1;
          transform: translateY(-1em);
          transition:
            opacity 1000ms cubic-bezier(0.0, 0.0, 0.2, 1),
            transform 1000ms cubic-bezier(0.19, 1, 0.22, 1);
        }
      }
    }
  }

  .card {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: $cardW;
    height: $cardH;
    padding: var(--spacer-L);
    background-color: var(--bg_1);
    margin: calc(50vw + ($cardW/2)) auto 0;
    transform: translateY(calc($cardH/-2));

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--bg_1);
      z-index: -1; /* be bellow text */
      transform: scale(var(--cardProgress)); 
      transform-origin: 50% 0;
    }

    &Child {
      &:nth-child(1) {
        flex-basis: 50%;
        margin-right: var(--spacer-M);
      }

      &:nth-child(2) {
        flex-grow: 1;
        text-align: center;
      }
    }
  }

  .cardChild,
  .credits {
    opacity: 0;
    transform: translateY(2rem);
    transition: opacity 150ms ease-out, transform 150ms ease-out;

    .isVisible & {
      opacity: 1;
      transform: translateY(0);
      transition:
        opacity 1000ms cubic-bezier(0.0, 0.0, 0.2, 1),
        transform 1000ms cubic-bezier(0.19, 1, 0.22, 1);
    }
  }

  .text {
    font-size: var(--font-L);
    margin-bottom: var(--spacer-M);

    &Line {
      display: block;
    }
  }

  .credits {
    position: absolute;
    bottom: -2em;
    left: 0;
    width: 100%;
    text-align: center;
    z-index: -2;
    transform: translateY(-2rem);
    color: var(--text_1);
    font-size: var(--font-S);

    .isVisible & {
      transition-delay: 500ms;
    }
  }

  .thing {
    display: inline-block;
    width: 20rem;
    height: 20rem;
    animation: rotate 50s linear infinite;
    animation-play-state: paused;

    .isVisible & {
      animation-play-state: running;
    }

    &Itself {
      position: relative;
      width: 100%;
      height: 100%;
      transform-origin: 50% 50%;
      transform: scale(var(--thingSize));
    }

    &Svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-origin: 50% 50%;
      transform: scale(calc((var(--scale) * 1)));
      transition: transform 500ms ease-out;
      will-change: transform;

      &Rect {
        fill: var(--morph_color);
        stroke: var(--bg_1);
        stroke-width: 2px;
        stroke-dasharray: 10px 15px;
      }
    }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>

<footer
  class="footer"
  class:isVisible
  bind:this={elFooter}
  id="contact"
  data-section-offset="100"
  style="height: {footerHeight}px; --thingSize: {progress}; --titleProgress: {titleProgress}; --cardProgress: {cardProgress};">
 
  <h3 class="title f-mono">
    <span class="title-part">Well...</span>
    <span class="title-part">That's all for now!</span>
  </h3>

  <div class="card" bind:this={ elCard }>
    <div class="cardChild">
      <p class="text">Fell free to <a href="#TODO" class="u-link">say hi</a>!</p>
      <p class="text">
        <span class="textLine">It's easy to find Sandrina around</span>
        <span class="textLine">specially if you are a web lover too.</span>
      </p>
      <Contacts />
    </div>

    <div class="cardChild" aria-hidden="true">
      <div class="thing">
        <div class="thingItself">
          {#each [scale1, scale2, scale3] as scale}
            <svg class="thingSvg"
              style="--scale: {scale};"
              viewBox="0 0 201 201"
              xmlns="http://www.w3.org/2000/svg">
              <rect class="thingSvgRect" x="1.13721" y="1.55859" width="198" height="198" rx={figSize} />
            </svg>
          {/each}
        </div>
      </div>
    </div>
    <!-- REVIEW THIS -->
    <p class="credits">Curious about me? Here's my <a href="#TODO" class="u-link">source code</a>.</p>
  </div>
</footer>
