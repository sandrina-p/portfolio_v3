<script>
  import { onMount } from 'svelte';
  import { _window, afterResponsiveUpdate } from '../stores/responsive.js';
  import throttle from 'lodash/throttle';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import { strMotion, afterMotionUpdate } from '../stores/motion.js';
  import { getInLimit, scrollIntoView } from '../utils';
  import { EMAIL_URL } from '../data/misc.js';
  import Contacts from './Contacts.svelte';
  import TimeLoad from './TimeLoad.svelte';

  $: wWidth = $_window && $_window.innerWidth;
  $: wHeight = $_window && $_window.innerHeight;

  const figSize = 200; /* OPTMIZE - access DOM */

  let elFooter;
  let elCard;

  let footerHeight = 'auto';
  let isOnStage = false; // when footer enters the view.
  let isCardOnView = false; // self explanatory
  let isVisible = false; // when everything gets visible.

  let cardInitialScale = 0;
  let thingProgress = 0;
  let titleProgress = '100vw';
  let cardScale = 0;

  let scale1 = 0;
  let scale2 = 0;
  let scale3 = 0;
  let animation;

  afterGeneralUpdate((prevState, state) => {
    if (!prevState.isReady && state.isReady) {
      if($strMotion.isReduced) {
        isOnStage = true;
        isCardOnView = true;
        isVisible = true;
        titleProgress = '0';
        cardScale = 1;
      } else {
        animation = initAnimation();
      }
    }

    if($strMotion.isReduced) { return }

    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;
    
    if (prevPageSection !== pageSection && pageSection === 'contact') {
      animation.verify();
    }
  });

  afterMotionUpdate((prevState, state) => {
    // OPTIMIZE - Same as Skills and Journey. Maybe it could be abstracted
    if(!$strGeneral.isReady) { return }

    if(!prevState.isReduced && state.isReduced) {
      animation && animation.remove();
    }

    if(prevState.isReduced && !state.isReduced) {
      if (animation) {
        animation.verify()
      } else {
        animation = initAnimation();
      }
    }
  })

  afterResponsiveUpdate(() => {
    if(!animation) { return }
    setTimeout(() => {
      animation.verify();
      console.warn('Resize: footer updated');
    }, 0) // execute after svelte update.
  })

  function initAnimation() {
    const handleFooterScroll = throttle(handleFooterScrollThrottled, 16);
    const figHalf = figSize / 2;
    let isObserving = true;
    let titleGoal;
    let titleScrollPivot;
    let cardGoal;
    let cardScrollPivot;
    let cardScaleLimit; // define a limit equal to wWidth, so it avoids horizontal scroll when too big.

    function handleFooterScrollThrottled() {
      console.log('scrolling footer...')
      const scrollY = window.scrollY;
      const scrollYpivot = scrollY - titleScrollPivot;
      const percentage = getInLimit(scrollYpivot / titleGoal, 0, 1);

      thingProgress = percentage;
      isVisible = percentage >= 1;
      titleProgress = wWidth - wWidth * percentage + 'px';

      if (isCardOnView) {
          // Update Svg circles (.thing) size
          scale1 = Math.abs((figHalf - ((scrollYpivot * 0.2) % figSize)) * 0.01);
          scale2 = Math.abs((figHalf - (((scrollYpivot - 150) * 0.2) % figSize)) * 0.01);
          scale3 = Math.abs((figHalf - (((scrollYpivot - 300) * 0.2) % figSize)) * 0.01);
          
          const cardScrollYpivot = scrollY - cardScrollPivot;
          const cardPercentage = getInLimit(cardScrollYpivot / cardGoal, 0, 1);
          const cardScaleOriginal = cardPercentage === 1 ? 1 : cardInitialScale - ((cardInitialScale - 1) * cardPercentage);
          cardScale = getInLimit(cardScaleOriginal, 1, cardScaleLimit);
      }

      // Create illusion of infinite scroll 🔮
      // You may run a lot but you'll always be close to home.
      if(scrollYpivot > footerHeight - figSize) {
        window.scrollTo(0, titleScrollPivot + titleGoal + 50); /* 50 workaround on mobile*/
      }
    }

    function removeAnimation() {
      console.debug('footer: Remove animation');
      isObserving = false;
      window.removeEventListener('scroll', handleFooterScroll);
      observerFooter.disconnect();
      observerCard.disconnect();

      setTimeout(() => {
        isOnStage = true;
        isCardOnView = true;
        isVisible = true;
        titleProgress = '0px';
        cardScale = 1;
        footerHeight = 'auto';
      }, 16) // to be called after any possible scrollThrottled.

    }

    const watchFooter = ([{ isIntersecting, boundingClientRect }]) => {
      isOnStage = isIntersecting;

      window.removeEventListener('scroll', handleFooterScroll);

      if (isIntersecting) {
        const wHeightHalf = wHeight/2;
        const cardWidth = elCard.offsetWidth;
        const cardHeight = elCard.offsetHeight;

        cardGoal = wHeightHalf + cardHeight/2;
        cardInitialScale = wWidth / cardWidth;
        cardScaleLimit = wWidth/cardWidth;
        cardScale = cardScaleLimit;

        titleGoal = wHeightHalf + wWidth / 2 + cardWidth / 2;
        titleScrollPivot = window.scrollY - ($_window.innerHeight - boundingClientRect.top);

        footerHeight = titleGoal + figSize * 12;

        handleFooterScroll();
        window.addEventListener('scroll', handleFooterScroll, { passive: true });
      } else {
        isVisible = false;
      }
    };

    const watchCard = ([{ isIntersecting, boundingClientRect }]) => {
      isCardOnView = isIntersecting;
      if(boundingClientRect.top < $_window.innerHeight/2) {
        // 99% sure it was triggered by Nav, so we need to ignore card position because it's absolute
        // and instead use another el as pivot (elFooter) with a more expensive operation.
        const scrollYAdjusted = window.scrollY + elFooter.getBoundingClientRect().top;
        cardScrollPivot = isIntersecting && scrollYAdjusted;
      } else {
        cardScrollPivot = isIntersecting && window.scrollY - ($_window.innerHeight - boundingClientRect.top);
      }
    };

    const observerFooter = new IntersectionObserver(watchFooter);
    const observerCard = new IntersectionObserver(watchCard);

    observerFooter.observe(elFooter);
    observerCard.observe(elCard);

    return {
      verify: () => {
        if (!isObserving) {
          console.debug('footer: Verify animation');
          isObserving = true;
          observerFooter.observe(elFooter);
          observerCard.observe(elCard);
          return;
        }
        const boundingClientRectCard = elCard.getBoundingClientRect()
        const boundingClientRectFooter = elFooter.getBoundingClientRect()

        // Verify card first, so handleFooterScroll is runned with the correct value of isCardOnView
        watchCard([{
          isIntersecting: boundingClientRectCard.top < wHeight,
          boundingClientRect: boundingClientRectCard
        }])
        watchFooter([{
          isIntersecting: boundingClientRectFooter.top < wHeight,
          boundingClientRect: boundingClientRectFooter
        }]);
      },
      remove: removeAnimation,
    }
  }

  function handleKeyboardFocus(e) {
    if (isCardOnView) { return }

    scrollIntoView(e, {
      value: $_window.innerHeight * 0.25 // to make sure header is visible.
    })
    animation.verify();
  }

</script>

<style>
  @define-mixin motionDefault { :global(.jsMotionDefault) & { @mixin-content; } }
  @define-mixin motionReduced { :global(.jsMotionReduced) & { @mixin-content; } }

  $cardW: 100%; /* static content luxuries */
  $cardH: auto;
  $cardTop: 11.5rem; /* by eye */

  .footer {
    position: relative;
    padding: $cardTop $spacer-M 0;
    min-height: 100vh;

    @mixin motionDefault {
      min-height: 200vh; /* enough to scroll from nav click */
    }
  }

  .title,
  .card {
    position: sticky;
  }

  .title {
    top: 10rem; /* by eye */
    display: block;
    width: 28rem; /* static content luxuries - reduce gpu usage */
    padding-left: $spacer-M;
    line-height: 1em;
    font-size: calc($font-heading_3 * 0.6);
    z-index: 2; /* above card */
    margin-bottom: -1.5em; /* fake position: absolute for sticky, 2em = 2 lines */

    &-part {
      display: block;

      &:first-child {
        transform-origin: 0 100%;
        transform: translateY(0);
        transition: transform 150ms ease-out;

        .isVisible & {
          transform: translateY(-1em) scale(0.7);
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
    top: $cardTop;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: auto;
    padding: $spacer-L $spacer-M $spacer-M;
    margin: 0 auto;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--bg_1);
      z-index: -1; /* be bellow text */
    }

    &Child {
      &:nth-child(1) {
        flex-grow: 1;
      }

      &:nth-child(2) {
        margin-top: $spacer-M;
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

      @mixin motionReduced {
        transition: none;
      }
    }
  }

  .text {
    font-size: $font-M;
    margin-bottom: $spacer-M;

    &Line {
      display: block;
    }
  }

  .thing {
    display: inline-block;
    width: 14rem;
    height: 14rem;
    animation: rotate 50s linear infinite;
    animation-play-state: paused;

    .isVisible & {
      @mixin motionDefault {
        animation-play-state: running;
      }
    }

    &Itself {
      position: relative;
      width: 100%;
      height: 100%;
      transform-origin: 50% 50%;

      @mixin motionDefault {
        transform: scale(var(--thingSize));
      }
    }

    &Svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-origin: 50% 50%;
      
      @mixin motionDefault {
        transition: transform 500ms ease-out;
        transform: scale(calc((var(--scale) * 1)));
      }

      @mixin motionReduced {
        &:nth-child(1) { transform: scale(0.9); }
        &:nth-child(2) { transform: scale(0.6); }
        &:nth-child(3) { transform: scale(0.3); }
      }

      &Rect {
        fill: var(--morph_color);
        stroke: var(--bg_1);
        stroke-width: 2px;
        stroke-dasharray: 10px 15px;
      }
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
    font-size: $font-S;

    .isVisible & {
      transition-delay: 500ms;
    }
  }

  @media (--max-xs) {
    .title {
      padding-left: 1.4rem;
    }

    .card {
      padding-right: 1.4rem;
      padding-left: 1.4rem;
    }
  }

  @media (--max-md) {
    .card {
      @mixin motionReduced {
        padding-top: $spacer-XL;
        padding-bottom: $spacer-XL;
      }
    }

    .thing {
      @mixin motionReduced {
        display: none;
      }
    }
  }

  @media (--md) {
    $cardW: 70rem; /* static content luxuries */
    $cardH: 30rem;

    .footer {
      padding-top: 1px; /* so it counts .card marign-top */
    }

    .title {
      position: relative;
      font-size: $font-heading_3;

      @mixin motionReduced {
        width: $cardW;
        margin: 0 auto;
        margin-bottom: -2.5em;
        transform: translateY(calc(50vh - $cardH));
      }

      @mixin motionDefault {
        top: 100vh; /* put out of view [1] */
        width: 42rem;
        padding-left: 0;
      }

      :not(.isVisible) & {
        @mixin motionDefault {
          pointer-events: none; /* so journey text can be selected while title is transforming X. */
        }
      }

      /* need the 2nd class to prevent fixed position while out of contacts.
      this was causing a bug when toggling reduce motion. It would appear on screen for a fr/s  */
      .isOnStage.isSectionContact & {
        @mixin motionDefault {
          /* [2]...put back on the view */
          /* can't be sticky because Safari adds scroll when title is transforming X */
          position: fixed;
          top: calc(50vh - $cardH/2 - 0.6em);
          left: calc(50vw - ($cardW/2) + $spacer-L);

          .title-content {
            transform: translateX(var(--titleProgress, 100vw));       
          }
        }
      }

      &-content {
        display: block;
      }

      &-part {
        &:first-child {
          .isVisible & {
            transform: translateY(-1em) scale(0.5);
          }
        }
      }
    }

    .card {
      top: 50vh;
      width: $cardW;
      height: $cardH;
      padding: $spacer-L;
      margin: calc(50vw + ($cardW/2)) auto 0;
      transform: translateY(calc($cardH/-2));

      @mixin motionReduced {
        position: relative;
        top: auto;
        margin-top: 50vh;
      }

      &::before {
        transform: scale(var(--cardScale)); 
        transform-origin: 50% 0;
        pointer-events: none;
        visibility: hidden;
      }

      &.isCardOnView { 
        &::before {
          visibility: visible; /* Save GPU memory (+4Mb) */
        }
      }

      &Child {
        &:nth-child(1) {
          flex-basis: 50%;
          margin-right: $spacer-M;
        }

        &:nth-child(2) {
          flex-grow: 1;
          text-align: center;
          margin-top: 0;
        }
      }
    }

    .text {
      font-size: $font-L;
    }

    .thing {
      width: 20rem;
      height: 20rem;
    }
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>

<footer
  class="footer"
  class:isOnStage
  class:isVisible
  class:isSectionContact={['journey', 'contact'].includes($strGeneral.pageCurrentSection)}
  bind:this={elFooter}
  id="contact" tabindex="-1"
  data-section-offset-v="100"
  data-section-offset-h="175"
  style="height: {footerHeight === 'auto' ? footerHeight : `${footerHeight}px`}; --thingSize: {thingProgress}; --titleProgress: {titleProgress}; --cardScale: {cardScale};">
 
  <h3 class="title f-title">
    <span class="title-content">
      <span class="title-part">Well...</span>
      <span class="title-part">That's all for now!</span>
    </span>
  </h3>

  <div class="card" bind:this={ elCard } class:isCardOnView>
    <div class="cardChild" on:focusin={handleKeyboardFocus}>
      <p class="text">Fell free to <a href={EMAIL_URL} target="_blank" class="u-link">say hi</a>!</p>
      <p class="text">
        <span class="textLine">It's easy to find me around,</span>
        <span class="textLine">specially if you are a web lover too.</span>
      </p>
      <Contacts />
    </div>
    <div class="cardChild" aria-hidden="true">
      <div class="thing">
        <div class="thingItself">
          {#each [scale1, scale2, scale3] as scale}
            <svg class="thingSvg u-svg"
              style="display: none; --scale: {scale};"
              viewBox="0 0 201 201"
              xmlns="http://www.w3.org/2000/svg">
              <rect class="thingSvgRect" x="1.13721" y="1.55859" width="198" height="198" rx={figSize} />
            </svg>
          {/each}
        </div>
      </div>
    </div>
    <p class="credits">Made without coffee. <TimeLoad /></p>
  </div>
</footer>
