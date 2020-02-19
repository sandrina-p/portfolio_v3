<script>
  import { onMount, afterUpdate } from 'svelte';
  import SkillsList from './SkillsList.svelte';
  import { getInLimit, scrollIntoView } from '../../utils';
  import { _window, matchMq, afterResponsiveUpdate } from '../../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../../stores/general.js';
  import { strMotion, afterMotionUpdate } from '../../stores/motion.js';
  import { GITHUB_URL, CODEPEN_URL, SITE_REPO } from '../../data/misc.js';

  $: wHeight = $_window && $_window.innerHeight;

  let elTitle;

  let isVisible = false;
  let animation;
  let progressN = 0; // title scale
  let progressY = 0; // title translate
  let colorType = null;

  afterGeneralUpdate((prevState, state) => {
    if (!prevState.isReady && state.isReady) {
      if($strMotion.isReduced) {
        isVisible = true;
        progressN = 0;
        progressY = 0;
      } else {
        animation = initAnimation();
      }
    }

    if($strMotion.isReduced) { return }

    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    if (prevPageSection !== pageSection && pageSection === 'skills') {
      animation.verify();
    }
  });

  afterMotionUpdate((prevState, state) => {
    // Same as Journey.svelte. Maybe it could be abstracted
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
      console.warn('Resize: skills updated');
    }, 0) // execute after svelte update.
  })


  function initAnimation() {
    let isObserving = true;
    let startAt; // where animation starts
    let endsAt; // where it ends
    let range; // the space where "zoom magic" happens
    /*
      +--------------------+ 
      |                    | [2]+
      |                    |    |
      |      VIEWPORT      |    |-[3]
      |                    |    |
      |                    | [1]+
      +--------------------+
    */

    function handleSkillsScroll() {
      console.log('scrolling skills...');
      const scrollY = window.scrollY;
      const fromStart = scrollY - startAt;
      progressN = getInLimit(fromStart/range, 0, 1);
      progressY = `${(range - progressN*range/1) * -1}px`
      isVisible = progressN === 1;
    }

    function removeAnimation() {
      console.debug('skills: Remove animation');
      window.removeEventListener('scroll', handleSkillsScroll);
      observer.disconnect();
      isObserving = false;
      progressN = 1;
      progressY = '0px';
      isVisible = 1;
    }

    const watchTitle = ([{ isIntersecting, boundingClientRect }]) => {
      const topScreen = window.scrollY + $_window.innerHeight - ($_window.innerHeight - boundingClientRect.top);
      startAt = topScreen - wHeight / 1.5;
      endsAt = topScreen - wHeight / 4; // 25vh - same as $paddingTop
      range = endsAt - startAt;

      window.removeEventListener('scroll', handleSkillsScroll);

      if (isIntersecting) {
        handleSkillsScroll()
        window.addEventListener('scroll', handleSkillsScroll, { passive: true });
      }
    };

    const observer = new IntersectionObserver(watchTitle);

    observer.observe(elTitle);

    return {
      verify: () => {
        if (!isObserving) {
          console.debug('skills: Verify animation');
          isObserving = true;
          observer.observe(elTitle);
          return;
        }
        const boundingClientRect = elTitle.getBoundingClientRect();
        watchTitle([{
          isIntersecting: boundingClientRect.top < wHeight,
          boundingClientRect,
        }])
      },
      remove: removeAnimation,
    }
  }

  function handleColorType(ev) {
    colorType = ev.detail.colorType
  }

  function handleKeyboardFocus(e) {
    if(isVisible) { return }

    scrollIntoView(e, {
      value: $_window.innerHeight * -0.25 // same as css $paddingTop.
    })
    
    animation.verify();
  }
</script>

<style>
  @define-mixin motionDefault { :global(.jsMotionDefault) & { @mixin-content; } }
  @define-mixin motionReduced { :global(.jsMotionReduced) & { @mixin-content; } }

  .wrapper {
    --skills-bg: var(--bg_invert);
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    padding-top: 50vw;
    padding-bottom: 4rem;
    background-color: var(--bg_0);
    transition: background-color 400ms cubic-bezier(0.19, 1, 0.22, 1);

    :global(.dark) & {
      --skills-bg: var(--bg_1);
    }

    &.uAppear {
      background-color: #1b1b1b; /* var(--bg_invert) - manual fallback css variables */
      background-color: var(--skills-bg);

      &::before {
        opacity: 1;
      }
    }
  }

  .header {
    position: relative;
    margin-top: $spacer-L;
    display: flex;
    flex-direction: column;
    align-items: center;

    @mixin motionReduced {
      margin-top: 0; /* visually better */
    }
    
    &Title {
      position: relative;
      font-size: calc($font-heading_1 * 0.8);
      color: transparent;
      transform-origin: 50% 0%;
      -webkit-text-stroke: 0.1rem var(--text_1);
      opacity: var(--progressN, 0);
      transform:
        scale(var(--progressN, 1))
        translateY(var(--progressY, 0));
      transition: transform 100ms ease,
        text-shadow 150ms; 

      .uAppear & {
        -webkit-text-stroke: initial;
        color: var(--text_invert);

        :global(.dark) & {
          color: var(--text_0);
        }
      }
    }

    &Desc {
      padding: $spacer-S $layout-margin;
      color: var(--text_invert);

      :global(.dark) & {
        color: var(--text_1);
      }
    }
  }

  @media (--md) {
    $paddingTop: 25vh; /* enough to cover all in black I guess */

    .wrapper {
      padding-top: $paddingTop;
      min-height: 100vh;
    }

    .header {
      &Title {
        font-size: $font-heading_0;

        .uAppear & {
          /* TIL: fake opacity without opacity */
          text-shadow:
            0 0 4.5rem var(--skills-bg),
            0 0 4.5rem var(--skills-bg),
            0 0 3.5rem var(--colorTabSelected);
        }
      }

      &Desc {
        padding: 0;
      }
    }
  }
</style>

<section
  class="wrapper"
  class:uAppear={isVisible}
  class:uAppearSoon={!isVisible}
  id="skills" tabindex="-1"
  on:focusin={handleKeyboardFocus}
  data-section-offset-v="75"
  data-section-offset-h="5">
  <!-- 80 = 50 paddingTop + 10 skills visible -->
  <header class="header"
    style="--colorTabSelected: {colorType};"
    bind:this={elTitle}>
    <h2 class="headerTitle f-title"
      style='--progressN: {progressN}; --progressY: {progressY}'>
      skills
    </h2>
    <p class="headerDesc uAppear-0">
      Take a sneak peek on <a href={GITHUB_URL} rel="noreferrer" target="_blank" class="u-link">Github</a> and <a href={CODEPEN_URL} rel="noreferrer" target="_blank" class="u-link">Codepen</a>
    </p>
  </header>
  
  <SkillsList on:setColorType={handleColorType} />
</section>
