<script>
  import { onMount } from 'svelte';
  import { _window, afterResponsiveUpdate } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import { strMotion, afterMotionUpdate } from '../stores/motion.js';
  import { getInLimit, scrollIntoView, sendGA } from '../utils';
  import { EMAIL_URL, CODEPEN_URL, TWITTER_URL, SITE_URL, SMASHING_URL, CSSTRICKS_URL } from '../data/misc.js';

  const workshopUrl = '/workshop-a11y-fundamentals'
  const speakUrl = 'https://medium.com/@a_sandrina_p/ive-spoken-at-jsconf-and-so-can-you-a9d92c1439a6'
  const mentorUrl = 'https://mentorcruise.com/mentor/SandrinaPereira/'

  let elHeader;
  let progress = 0;
  let animation;
  let isSkillsVisible = false;

  $: wHeight = $_window && $_window.innerHeight;
  $: goal = wHeight / 2;
  $: isActive = progress === 1;

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

    if (prevState.isSkillsVisible !== state.isSkillsVisible) {
      isSkillsVisible = state.isSkillsVisible
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

      if(progress === 1) {
        isSkillsVisible = true
      }
    }

    function removeAnimation() {
      console.debug('journey: Remove animation');
      isObserving = false;
      window.removeEventListener('scroll', handleJourneyScroll);
      observer.disconnect();
      progress = 1;
      isSkillsVisible = true;
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

<style lang="postcss">
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
      opacity: 0;
      /* Same speed as Skills. TODO reuse var or something */
      transition: opacity 250ms cubic-bezier(0.19, 1, 0.22, 1);

      .uAppear & {
        transition: opacity 1000ms cubic-bezier(0.19, 1, 0.22, 1);
        opacity: 1;
      }

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
  class:uAppear={isSkillsVisible}
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
      In 2020 I joined
      <a class="u-link" rel="noreferrer" target="_blank" href="https://remote.com/">Remote</a> where I'm the team lead responsible for the technical foundations of our product.
      <!-- Previously, I spent a year helping to bring an open source idea to life -
      <axx class="u-link" rel="noreferrer" target="_blank" href="https://github.com/okTurtles/group-income-simple">Group Income</a>. -->
      Back in office times, I was a Senior Frontend Developer at
      <a class="u-link" rel="noreferrer" target="_blank" href="https://www.farfetch.com">Farfetch</a>
      for a few years, guiding multiple teams to level up their knowledge within the React ecosystem, around accessibility, performance and, JS testing.
    </p>

    <p class="p">
      Although I've been a developer my entire career, I proudly hold a degree in Communication Design and post-grad in Digital Experience Design.
      Honestly, that's one of my secrets to succeed as a self-taught frontend engineer.
    </p>
    <p class="p">
      Over the time, I've been giving back to the community. I started by pushing pixels around on 
      <a class="u-link" rel="noreferrer" target="_blank" href={CODEPEN_URL} on:click={() => trackClick('codepen_journey')}>Codepen</a>
      just for fun.
      <!-- <a class="u-link" rel="noreferrer" target="_blank" href={TWITTER_URL} on:click={() => trackClick('twitter_journey')}>Twitter</a>. -->
    </p>
    <p class="p">
      I'm an author of 
      <a class="u-link" rel="noreferrer" target="_blank" href={CSSTRICKS_URL} on:click={() => trackClick('csstricks_journey')}>CSS-Tricks</a> 
      and
      <a class="u-link" rel="noreferrer" href={SMASHING_URL} target="_blank" on:click={() => trackClick('smashing_journey')}>Smashing Magazine</a>
      where I write articles occasionally.
      I also explored the world of <a class="u-link" rel="noreferrer" href={speakUrl} target="_blank" on:click={() => trackClick('speakJSConf_journey')}>public speaking</a> a few times, pushing myself outside of my comfort zone.
    </p>
    
    <p class="p">
      Solving problems is cool, but I aim to simplify existing solutions.
      I've been <a class="u-link" rel="noreferrer" href={mentorUrl} target="_blank" on:click={() => trackClick('smashing_journey')}>mentoring online</a>,
      which allowed me to refine my approach to teaching new topics in a clear and effective way.   
    </p>
    
    <p class="p">
      All of these experiences lead me to find my sweet spot: 
      For the last 3 years I've been giving workshops about multiple topics. 
      Currently, I'm focused on creating awareness of why
      <a class="u-link" rel="noreferrer" href={workshopUrl} target="_blank" on:click={() => trackClick('a11y_journey')}>Web Accessibility</a>
      is part of our duties as web creators.
    </p>

    <p class="p">
      Since I can remember, my meta-goal is to create humanly inclusive experiences within digital environments. And this has been my journey around it.
    </p>
    <!--
      [May be useful in the future. I hope not.]
      <p class="p">
      In a few months,
      <strong class="f-bold">I'll be open to new challenges</strong> (remote!) where I can help people with lines of code.
      If you believe we can excel together <a class="u-link" rel="noreferrer" target="_blank" href={ EMAIL_URL } on:click={() => trackClick('email_journey')}>get in touch</a>!
    </p> -->
  </div>
</section>
