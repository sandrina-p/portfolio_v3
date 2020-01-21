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
  $headingHeight: 40rem; /* space for text even when rotated */
  $headingWidth: 70rem;
  $paddingTop: 25vh;

  .wrapper {
    position: relative;
    padding-top: $paddingTop;
    --rotate: -4deg;
    background-color: var(--bg_0);
  }

  .heading {
    position: relative;
    height: $headingHeight;
    font-size: var(--font-heading_3);

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

    &Slide {
      display: block;
      width: $headingWidth;
      color: var(--text_invert);
      position: absolute;
      bottom: 0.2em;
      left: 0;
      transform: translate(calc(100vw - 50%), calc(3em - 3em * var(--progress)));
    }

    &Fixed {
      position: absolute;
      width: $headingWidth;
      white-space: nowrap;
      top: calc(20rem + 0.2em);
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
      top: -20rem; /* to cover the bg from the rotate */
      left: -50vw; /* to make it centered based on 200vw */
      width: 200vw;
      height: 100%;
      transform-origin: 50% 100%;
      transform: rotate(calc(var(--rotate) * var(--progress)));
      overflow: hidden;
      z-index: 1; /* above "and so did Sandrina" */
    }
  }

  .text {
    max-width: 48rem;
    margin: -5rem auto 0;
    font-size: var(--font-L);
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
    margin-bottom: var(--spacer-L);
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
