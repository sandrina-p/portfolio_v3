<script>
  import { onMount } from 'svelte';
  import { _window } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import { getInLimit, TIMEOUTS } from '../utils';
  import { EMAIL_URL } from '../data/misc.js';

  let elHeading;
  let scrollPivot;
  let progressOffset = 0;
  let progress = 0;
  let isOnStage = false;
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
</script>

<style>
  $sectionWidth: 48rem;
  $headingHeight: 25rem; /* space for text even when rotated */
  $maskWidth: 120vw;
  $paddingTop: 25vh;

  .wrapper {
    position: relative;
    padding-top: $paddingTop;
    --rotate: -4deg;
    background-color: var(--bg_0);
    max-width: 100%;
    overflow: hidden; /* for the rotating header */
  }

  .heading {
    position: relative;
    height: $headingHeight;
    font-size: calc($font-heading_3 * 0.6);
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
    }

    &Fixed {
      position: absolute;
      white-space: nowrap;
      top: calc($headingHeight/2 + 0.2em);
      left: 50%;
      color: var(--primary_1);
      transform: translate(-50%, -2em) rotate(var(--rotate));
      transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);

      .isActive & {
        transform: translate(-50%, 0) rotate(var(--rotate));
        transition: transform 600ms cubic-bezier(0, 0, 0.2, 1);
      }
    }
  }

  .sliding {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    overflow: hidden; /* to avoid scroll from rotate element */
    height: $headingHeight;

    &Rotate {
      position: absolute;
      background-color: var(--bg_invert);
      top: calc($headingHeight / -2); /* to cover the bg from the rotate */
      left: calc(($maskWidth - 100vw) / -2); /* to make it centered based on width */
      width: $maskWidth;
      height: 100%;
      transform-origin: 50% 100%;
      transform: rotate(calc(var(--rotate) * var(--progress)));
      overflow: hidden;
      z-index: 1; /* above "and so did Sandrina" */
    }
  }

  .text {
    width: $sectionWidth;
    max-width: 100vw;
    padding: 0 $layout-margin;
    margin: 0 auto;
    line-height: 1.5;
    color: var(--text_1);
    opacity: 0;
    transform: translateY(-2rem);
    transition: transform 300ms ease-ine, opacity 300ms ease-ine;
    transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
    pointer-events: none;

    .isActive & {
      opacity: 1;
      transform: translateY(0rem);
      pointer-events: auto;
      transition: opacity 600ms 700ms, transform 400ms 500ms;
      transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }

    .f-bold {
      color: var(--text_0);
    }
  }

  .p:not(:last-child) {
    margin-bottom: $spacer-L;
  }

  @media (--md) {
    .heading {
      /* position: relative;
      height: $headingHeight; */
      font-size: $font-heading_3;
      margin-bottom: 0;

      /* &Slide,
      &Fixed {
        width: $sectionWidth;
        top: calc($headingHeight + 0.2em);
      } */
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
  id="journey">
  <h2 class="f-mono heading" aria-label="Uff, you came so far..." bind:this={elHeading}>
    <div class="sliding">
      <div class="slidingRotate">
        <span class="headingSlide">
          Uff,
          <br />
          you came so far...
        </span>
      </div>
    </div>
    <span class="headingFixed">and so did Sandrina!</span>
  </h2>
  <div class="text">
    <p class="p">
      During the last year she has been helping to bring an open source idea to life -
      <a class="u-link" href="https://github.com/okTurtles/group-income-simple" target="_blank">Group Income</a>.
      Before that, she was a Senior UI Engineer at
      <a class="u-link" href="https://www.farfetch.com" target="_blank">Farfetch</a>
      for a few years.
    </p>
    <p class="p">
      Since her early days, back when she was studying Communication Design, Sandrina always looked
      for ways to emerge these two fields: design and development. Her meta-goal is still the same:
      <strong class="f-bold">explore human experiences through the web world.</strong>
      That's why she loves to 
      <a class="u-link" href="https://codepen.io/sandrina-p" target="_blank">push pixels around</a>.
    </p>
    <p class="p">
      Currently,
      <strong class="f-bold">Sandrina is looking for new remote challenges</strong>.
      If you trully believe you both can rock together, <a class="u-link" href={ EMAIL_URL }>go talk to her!</a>
    </p>
  </div>
</section>
