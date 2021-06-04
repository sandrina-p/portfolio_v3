<script>
  import { onMount, afterUpdate } from 'svelte';
  import { _window, afterResponsiveUpdate } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import { strMotion, afterMotionUpdate } from '../stores/motion.js';
  import { getInLimit, scrollIntoView } from '../utils';

  export let isOnStage;
  export let sectionName;
  export let klass = '';
  export let motionReduced = false;

  let elHeader;
  let progress = 1;
  let animation;

  $: wHeight = $_window && $_window.innerHeight;
  $: goal = wHeight / 2;
  $: isActive = progress === 1;

  onMount(() => {
    progress = 0; // in case JS is not supported
  })

  afterUpdate(() => {
    if (!animation && isOnStage) {
      if($strMotion.isReduced || motionReduced) {
        progress = 1;
      } else {
        animation = initAnimation();
      }
    }
  })

  afterMotionUpdate((prevState, state) => {
    if(!prevState.isReduced && state.isReduced) {
      animation && animation.remove();
    }

    if(prevState.isReduced && !state.isReduced && !motionReduced) {
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
      console.warn('Resize: section skew updated');
    }, 0) // execute after svelte update.
  })

  function initAnimation() {
    let isObserving = true;
    let scrollPivot;
    let progressOffset = 0;

    function handleScroll() {
      console.log('scrolling sectionSkew...');
      const percentage = (window.scrollY - progressOffset - scrollPivot) / goal;
      progress = getInLimit(percentage, 0, 1);
    }

    function removeAnimation() {
      console.debug('journey: Remove animation');
      isObserving = false;
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      progress = 1;
    }

    const watchHeader = ([{ isIntersecting, boundingClientRect }]) => {
      scrollPivot = window.scrollY - ($_window.innerHeight - boundingClientRect.top);
      progressOffset = progressOffset || boundingClientRect.height / 2;
      
      window.removeEventListener('scroll', handleScroll);

      if (isIntersecting) {
        handleScroll()
        window.addEventListener('scroll', handleScroll, { passive: true });
      }
    };

    const observer = new IntersectionObserver(watchHeader);

    observer.observe(elHeader);

    return {
      verify: () => {
        if (!isObserving) {
          console.debug('journey: Verify animation');
          isObserving = true;
          observer.observe(elHeader);
          return;
        }
        const boundingClientRect = elHeader.getBoundingClientRect()
        watchHeader([{
          isIntersecting: boundingClientRect.top < wHeight,
          boundingClientRect
        }])
      },
      remove: removeAnimation,
    }
  }

  function handleKeyboardFocus(e) {
    if (isActive) { return }

    scrollIntoView(e, {
      value: $_window.innerHeight * -0.25 + 32 // $paddingTop + visual margin.
    })
    animation.verify();
  }
</script>

<style lang="postcss">
  $headerHeight: 25rem; /* space for text even when rotated */
  $maskWidth: 120vw;
  $paddingTop: 100px;

  .wrapperJn {
    --section-pageBg: var(--bg_0);
    --section-pageTxt: var(--text_0);
    --section-contentBg: var(--primary_1_smooth);
    --section-contentTxt: var(--text_0);
    --section-contentWidth: 500px;
    --section-title: var(--primary_1);

    :global(.dark) & {
      --section-contentBg: var(--bg_1);
      --section-contentTxt: var(--text_0);
      --section-title: var(--primary_1);
    }

    position: relative;
    --rotate: -4deg;
    max-width: 100%;
    overflow: hidden; /* for the rotating header */
    margin-top: -1px; /* hide semi-pixel of bg_0 on safari */
    background-color: var(--section-contentBg);
    color: var(--section-contentTxt);
  }

  .header {
    position: relative;
    height: $headerHeight;
    font-size: calc($font-heading_3 * 0.6);
    line-height: 1;
    margin-bottom: -4rem;

    &::before {
      content: '';
      position: absolute;
      top: calc($paddingTop * -1);
      left: 0;
      height: $paddingTop;
      width: 100%;
      background-color: var(--section-pageBg);
      opacity: 0;
      /* OPTIMIZE: Same speed as Skills. TODO reuse var or something */
      transition: opacity 250ms cubic-bezier(0.19, 1, 0.22, 1);

      .uAppear & {
        transition: opacity 1000ms cubic-bezier(0.19, 1, 0.22, 1);
        opacity: 1;
      }
    }

    &Slide,
    &Fixed {
      width: var(--section-contentWidth);
      max-width: calc(100vw - $layout-margin*2);
    }

    &Slide {
      display: block;
      color: var(--section-pageTxt);
      position: absolute;
      bottom: 0.2em;
      left: 0;
      transform: translate(calc($maskWidth/2 - 50%), calc(3em - 3em * var(--progress)));
    }

    &Block {
      display: block;
    }

    &Fixed {
      position: absolute;
      white-space: nowrap;
      top: calc($headerHeight/2 + 0.2em);
      left: 50%;
      color: var(--section-title);
      transform: translate(-50%, -2em) rotate(var(--rotate));
      transition: transform 300ms ease-out;

      .isActive & {
        transform: translate(-50%, 0) rotate(var(--rotate));
        transition: transform 600ms cubic-bezier(0.0, 0.0, 0.2, 1),;
      }
    }
  }

  .sliding {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    overflow: hidden; /* to avoid scroll from rotate element */
    height: $headerHeight;

    &Rotate {
      display: block;
      position: absolute;
      background-color: var(--section-pageBg);
      top: calc($headerHeight / -2); /* to cover the bg from the rotate */
      left: calc(($maskWidth - 100vw) / -2); /* to make it centered based on width */
      width: $maskWidth;
      height: 100%;
      transform-origin: 50% 100%;
      /* Question: Why didn't I use skew instead?
          5 min later: Because of the text inside!
      */
      transform: rotate(calc(var(--rotate) * var(--progress)));
      overflow: hidden;
      z-index: 1; /* above 2nd line of text */

      /* :global(.dark) & {
        background-color: var(--bg_1);
      } */
    }
  }

  .text {
    width: var(--section-contentWidth);
    max-width: 100vw;
    padding: 0 $layout-margin;
    margin: 0 auto;
    line-height: 1.5;
    opacity: 0;
    transform: translateY(-3rem);
    transition: opacity 150ms ease-out, transform 150ms ease-out;

    .isActive & {
      opacity: 1;
      transform: translateX(0);
      transition:
        opacity 1000ms 300ms cubic-bezier(0.0, 0.0, 0.2, 1),
        transform 1000ms 300ms cubic-bezier(0.19, 1, 0.22, 1);
    }
  }

  @media (--max-lg) {
    .wrapperJn {
      margin-bottom: $spacer-XL;
    }
  }

  @media (--lg) {
    .wrapperJn {
      padding-top: $paddingTop;
    }

    .header {
      font-size: $font-heading_3;
      margin-bottom: 0;
    }

    .text {
      padding: 0;
      font-size: $font-L;
    }
  }
</style>

<section class="wrapperJn {klass}"
  class:isActive
  class:uAppear={true}

  style="--progress: {progress}"
  tabindex="-1"
  on:focusin={handleKeyboardFocus}>
  <h2 class="f-title header" bind:this={elHeader}>
    <span class="sliding">
      <span class="slidingRotate">
        <span class="headerSlide">
          <span class="headerBlock">
            <slot name="title_top" />
          </span>
        </span>
      </span>
    </span>
    <span class="headerFixed">
      <slot name="title_bottom" />
    </span>
  </h2>
  <div class="text">
    <slot />
  </div>
</section>
