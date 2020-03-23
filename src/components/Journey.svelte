<script>
  import { onMount } from 'svelte';
  import { _window, afterResponsiveUpdate } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import { strMotion, afterMotionUpdate } from '../stores/motion.js';
  import { getInLimit, scrollIntoView, sendGA } from '../utils';
  import { EMAIL_URL, CODEPEN_URL, TWITTER_URL, SITE_URL } from '../data/misc.js';

  let elHeader;
  let progress = 0;
  let animation;
  let workshopUrl = '/workshop-a11y-fundamentals'

  $: wHeight = $_window && $_window.innerHeight;
  $: goal = wHeight / 2;
  $: isActive = progress === 1;

  onMount(() => {
    // NOTE / OPTIMIZE: Turn the URL into an absolute path to force a total refresh.
    // At the moment this website isn't optimized to work as a SPA (because of all animations around)
    // so to prevent any bug, force a total refresh by changing the href to absolute URL.
    // P.S. The first render needs to have the relative URL so Sapper can "crawl" it and export the page.
    workshopUrl = `${SITE_URL}${workshopUrl}`
  })

  afterGeneralUpdate((prevState, state) => {
    if (!prevState.isReady && state.isReady) {
      if($strMotion.isReduced) {
        progress = 1;
      } else {
        animation = initAnimation();
      }
    }

    if($strMotion.isReduced) { return }

    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    if (prevPageSection !== pageSection && pageSection === 'journey') {
      animation.verify();
    }
  });

  afterMotionUpdate((prevState, state) => {
    // Same as Skills.svelte. Maybe it could be abstracted
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
      console.warn('Resize: journey updated');
    }, 0) // execute after svelte update.
  })

  function initAnimation() {
    let isObserving = true;
    let scrollPivot;
    let progressOffset = 0;

    function handleJourneyScroll() {
      console.log('scrolling journey...');
      const percentage = (window.scrollY - progressOffset - scrollPivot) / goal;
      progress = getInLimit(percentage, 0, 1);
    }

    function removeAnimation() {
      console.debug('journey: Remove animation');
      isObserving = false;
      window.removeEventListener('scroll', handleJourneyScroll);
      observer.disconnect();
      progress = 1;
    }

    const watchHeader = ([{ isIntersecting, boundingClientRect }]) => {
      scrollPivot = window.scrollY - ($_window.innerHeight - boundingClientRect.top);
      progressOffset = progressOffset || boundingClientRect.height / 2;
      
      window.removeEventListener('scroll', handleJourneyScroll);

      if (isIntersecting) {
        handleJourneyScroll()
        window.addEventListener('scroll', handleJourneyScroll, { passive: true });
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

  function trackClick(action) {
    sendGA('send', 'event', 'click', 'contacts', action)
  }
</script>

<style>
  $textWidth: 50rem;
  $textWidthEm: 31.25em;
  $headerHeight: 25rem; /* space for text even when rotated */
  $maskWidth: 120vw;
  $paddingTop: 25vh;

  .wrapperJn {
    position: relative;
    padding-top: 0;
    --rotate: -4deg;
    max-width: 100%;
    overflow: hidden; /* for the rotating header */
    margin-top: -1px; /* hide semi-pixel of bg_0 on safari */
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
      background-color: var(--bg_invert);

      :global(.dark) & {
        background-color: var(--bg_1);
      }
    }

    &Slide,
    &Fixed {
      width: $textWidth;
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
      top: calc($headerHeight/2 + 0.2em);
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
    height: $headerHeight;

    &Rotate {
      display: block;
      position: absolute;
      background-color: var(--bg_invert);
      top: calc($headerHeight / -2); /* to cover the bg from the rotate */
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
    width: $textWidth;
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
  }

  .p:not(:last-child) {
    margin-bottom: $spacer-L;
  }

  @media (--only-tablet) {
    .text {
      padding: 0 5vw; /* REVIEW this and all text sizes */
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

<section class="wrapperJn"
  class:isActive
  style="--progress: {progress}"
  id="journey" tabindex="-1"
  data-section-offset-v="45"
  data-section-offset-h="15"
  on:focusin={handleKeyboardFocus}
  data-cy="journey">
  <h2 class="f-title header" bind:this={elHeader}>
    <span class="sliding">
      <span class="slidingRotate">
        <span class="headerSlide">
          <span class="headerBlock">Uff,</span>
          you came so far...
        </span>
      </span>
    </span>
    <span class="headerFixed">Here's my journey</span>
  </h2>
  <div class="text">
    <p class="p">
      During the last year I have been helping to bring an open source idea to life -
      <a class="u-link" rel="noreferrer" target="_blank" href="https://github.com/okTurtles/group-income-simple">Group Income</a>.
      Before that, I was a Senior UI Engineer at
      <a class="u-link" rel="noreferrer" target="_blank" href="https://www.farfetch.com">Farfetch</a>
      for a few years. From time to time, I also challenge myself to give talks and <a class="u-link" href={workshopUrl} >workshops</a> about a topic I'm really into.
    </p>
    <p class="p">
      Create humanly accessible experiences within digital environments has been my meta-goal since I can remember.
      In my free time I have fun
      <a class="u-link" rel="noreferrer" target="_blank" href={CODEPEN_URL} on:click={() => trackClick('codepen_journey')}>pushing pixels around</a>
      and
      <a class="u-link" rel="noreferrer" target="_blank" href={TWITTER_URL} on:click={() => trackClick('twitter_journey')}>share ideas</a> with the community.
    </p>
    <p class="p">
      In a few months,
      <strong class="f-bold">I'll be open to new challenges</strong> (remote!) where I can help people with lines of code.
      <!-- svelte-ignore -->
      If you believe we can excel together <a class="u-link" rel="noreferrer" href={ EMAIL_URL } on:click={() => trackClick('email_journey')}>get in touch</a>!
    </p>
  </div>
</section>
