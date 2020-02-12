<script>
  import { onMount } from 'svelte';
  import { _window } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import { getInLimit, scrollIntoView } from '../utils';
  import { EMAIL_URL, CODEPEN_URL, TWITTER_URL } from '../data/misc.js';

  let elHeading;
  let scrollPivot;
  let progressOffset = 0;
  let progress = 0;
  let animation;

  $: isActive = progress === 1;

  afterGeneralUpdate((prevState, state) => {
    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    if (!prevState.isReady && state.isReady) {
      animation = initAnimations();
    }

    // if (!prevState.isReady && state.isReady) {
    //   window.scroll(0, 4000); // FOR DEBUG
    // }

    if (prevPageSection !== pageSection && pageSection === 'journey') {
      animation.verify();
    }
  });

  function initAnimations() {
    function handleScroll() {
      console.log('scrolling journey...');
      const goal = $_window.innerHeight / 2;
      const percentage = getInLimit((window.scrollY - progressOffset - scrollPivot) / goal, 0, 1);
      progress = percentage;
    }

    const watchSlidding = ([{ isIntersecting, boundingClientRect, rootBounds }]) => {
      scrollPivot = window.scrollY - (rootBounds.height - boundingClientRect.top);
      progressOffset = progressOffset || boundingClientRect.height / 2;
      
      if (isIntersecting) {
        window.addEventListener('scroll', handleScroll, { passive: true });
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };

    const observer = new IntersectionObserver(watchSlidding);

    observer.observe(elHeading);

    return {
      verify: handleScroll
    }
  }

  function handleKeyboardFocus(e) {
    scrollIntoView(e, {
      value: $_window.innerHeight * -0.25 + 32 // $paddingTop + visual margin.
    })
    animation.verify();
  }
</script>

<style>
  $sectionWidth: 48rem;
  $headingHeight: 25rem; /* space for text even when rotated */
  $maskWidth: 120vw;
  $paddingTop: 25vh;

  .wrapper {
    position: relative;
    padding-top: 0;
    --rotate: -4deg;
    max-width: 100%;
    overflow: hidden; /* for the rotating header */
    margin-top: -1px; /* hide semi-pixel of bg_0 on safari */
  }

  .heading {
    position: relative;
    height: $headingHeight;
    font-size: calc($font-heading_3 * 0.6);
    line-height: 1;
    margin-bottom: -4rem;

    &::before {
      /* REVIEW/BUG pixel perfect - blacks are not rendered the same! ... */
      content: '';
      position: absolute;
      top: calc($paddingTop * -1);
      left: 0;
      height: $paddingTop;
      width: 100%;
      background-color: var(--bg_invert);

      :global(.dark) & {
        background-color: var(--bg_1);
      }
    }

    &Slide,
    &Fixed {
      width: $sectionWidth;
      max-width: calc(100vw - $layout-margin*2);
    }

    &Slide {
      display: block;
      color: var(--text_invert);
      position: absolute;
      bottom: 0.2em;
      left: 0;
      transform: translate(calc($maskWidth/2 - 50%), calc(3em - 3em * var(--progress)));
    
      :global(.dark) & {
        color: var(--text_0);
      }
    }

    &Block {
      display: block;
    }

    &Fixed {
      position: absolute;
      white-space: nowrap;
      top: calc($headingHeight/2 + 0.2em);
      left: 50%;
      color: var(--primary_1);
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
    height: $headingHeight;

    &Rotate {
      display: block;
      position: absolute;
      background-color: var(--bg_invert);
      top: calc($headingHeight / -2); /* to cover the bg from the rotate */
      left: calc(($maskWidth - 100vw) / -2); /* to make it centered based on width */
      width: $maskWidth;
      height: 100%;
      transform-origin: 50% 100%;
      transform: rotate(calc(var(--rotate) * var(--progress)));
      overflow: hidden;
      z-index: 1; /* above 2nd line of text */

      :global(.dark) & {
        background-color: var(--bg_1);
      }
    }
  }

  .text {
    width: $sectionWidth;
    max-width: 100vw;
    padding: 0 $layout-margin;
    margin: 0 auto;
    line-height: 1.5;
    color: var(--text_0);
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

    .f-bold {
      color: var(--text_0);
    }
  }

  .p:not(:last-child) {
    margin-bottom: $spacer-L;
  }

  @media (--md) {
    .wrapper {
      padding-top: $paddingTop;
    }
    .heading {
      font-size: $font-heading_3;
      margin-bottom: 0;
    }

    .text {
      padding: 0;
      font-size: $font-L;
    }
  }
</style>

<section class="wrapper"
  class:isActive
  style="--progress: {progress}"
  id="journey"
  on:focusin={handleKeyboardFocus}>
  <h2 class="f-mono heading" bind:this={elHeading}>
    <span class="sliding">
      <span class="slidingRotate">
        <span class="headingSlide">
          <span class="headingBlock">Uff,</span>
          you came so far...
        </span>
      </span>
    </span>
    <span class="headingFixed">and so did Sandrina!</span>
  </h2>
  <div class="text">
    <p class="p">
      During the last year she has been helping to bring an open source idea to life -
      <a class="u-link" href="https://github.com/okTurtles/group-income-simple">Group Income</a>.
      Before that, she was a Senior UI Engineer at
      <a class="u-link" href="https://www.farfetch.com">Farfetch</a>
      for a few years.
    </p>
    <p class="p">
      Sandrina always looked for ways to emerge design and development fields. Her meta-goal is still the same: create human experiences through the digital world.
      In her free time she loves to
      <a class="u-link" href={CODEPEN_URL}>push pixels around</a> and <a class="u-link" href={TWITTER_URL}>share her learnings</a> with the community.
    </p>
    <p class="p">
      Currently,
      <strong class="f-bold">Sandrina is open for new challenges</strong> where she can help people with code.
      If you believe both of you can rock together, <a class="u-link" href={ EMAIL_URL }>go talk to her!</a>
    </p>
  </div>
</section>
