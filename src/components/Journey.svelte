<script>
  import { onMount } from 'svelte';
  import { _window } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import { getInLimit } from '../utils';

  let elHeading;
  let scrollPivot;
  let progressOffset;
  let progress = 0;
  $: isActive = progress === 1;

  afterGeneralUpdate((prevState, state) => {
    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;
    
    if(!prevState.isReady && state.isReady) {
      initAnimations();
    }

    if (prevPageSection !== pageSection && pageSection === 'about') {
      verifyRotating();
    }
  });

  function verifyRotating() {
    console.log('scrolling journey...');

    const goal = $_window.innerHeight/2;
    const percentage = getInLimit(((window.scrollY - progressOffset - scrollPivot) / goal), 0, 1);
    progress = percentage;
  }

  function initAnimations() {
    const watchSlidding = ([{ isIntersecting, boundingClientRect, rootBounds }]) => {
      if (isIntersecting) {
        scrollPivot = window.scrollY - (rootBounds.height - boundingClientRect.top),
        progressOffset = progressOffset || boundingClientRect.height / 2
        
        window.addEventListener('scroll', verifyRotating, { passive: true });
      } else {
        window.removeEventListener('scroll', verifyRotating);
      }
    };

    const observer = new IntersectionObserver(watchSlidding);

    observer.observe(elHeading);
  }

</script>

<style>
  $headingHeight: 40rem; /* space for text even when rotated */
  $headingWidth: 70rem;
  $paddingTop: 25vh;

  .wrapper {
    position: relative;
    padding-top: $paddingTop;
    margin-bottom: 50vh;
    --rotate: -4deg;
  }

  .heading {
    position: relative;
    height: $headingHeight;
    font-size: var(--font-heading_3);

    &::before {
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
      color: var(--text_1);
      z-index: -1;
      transform: translate(-50%, -2em) rotate(var(--rotate));
      transition: transform 300ms 150ms cubic-bezier(0,0,.2,1);

      .isActive & {
        transform: translate(-50%, 0) rotate(var(--rotate));
        transition: transform 600ms 300ms cubic-bezier(0,0,.2,1);
      }
    }
  }

  .sliding {
    position: absolute;
    top: 0; left: 0;
    width: 100vw;
    overflow: hidden; /* to avoid scroll from rotate element */
    height: $headingHeight;

    &Rotate {
      position: absolute;
      background: var(--bg_invert);
      top: -20rem; /* to cover the bg from the rotate */
      left: -50vw; /* to make it centered based on 200vw */
      width: 200vw;
      height: 100%;
      transform-origin: 50% 100%;
      transform: rotate(calc(var(--rotate) * var(--progress)));
      overflow: hidden;
    }
  }

  .text {
    max-width: 50rem;
    margin: -5rem auto 0;
    font-size: var(--font-L);
    line-height: 1.5;
    color: var(--text_1);
    opacity: 0;
    transform: translateY(-2rem);
    transition: transform 300ms ease-ine, opacity 300ms ease-ine;
    transition-timing-function: cubic-bezier(0,0,.2,1);
    pointer-events: none;

    .isActive & {
      opacity: 1;
      transform: translateY(0rem);
      pointer-events: auto;
      transition: opacity 600ms 700ms, transform 400ms 500ms;
      transition-timing-function: cubic-bezier(0,0,.2,1);
    }

  }

  a {
    color: var(--text_0);
  }
</style>

<section class="wrapper" style='--progress: {progress}' class:isActive data-section="about">
  <h2 class="f-mono heading" bind:this={elHeading}>
    <div class="sliding">
      <div class="slidingRotate">
        <span class="headingSlide">
          Uff, <br /> you came so far...
        </span>
      </div>
    </div>
    <span class="headingFixed">and so did Sandrina!</span>
  </h2>
  <div>
  <p class="text">
    During the last year she have been helping to bring a new (open source) idea to life -
    <a href="TODO">Group Income</a>
    - a decentralized basic income system for small communities. Before that, she was a Senior UI
    Engineer at
    <a href="TODO">Farfetch</a>
    for a few years.
    <br />
    <br />
    Since her early days, back when she was studying Communication Design, Sandrina always looked
    for ways to emerge these two fields: design and development. Her meta-goal is still the same:
    <strong>create human experiences through the digital world.</strong>
    <br />
    <br />
    Currently,
    <strong>Sandrina is looking for new opportunities</strong>
    where she can make the difference as a developer who cares not only about the code, but also
    about the people. Remote friendly or somewhere in North Europe.
    <a href="TODO">Get in touch!</a>
  </p>
  </div>
</section>
