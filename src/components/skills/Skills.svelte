<script>
  import { onMount, afterUpdate } from 'svelte';
  import SkillsList from './SkillsList.svelte';
  import tools from '../../data/tools';
  import { getInLimit } from '../../utils';
  import { _window, matchMq } from '../../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../../stores/general.js';
  import { GITHUB_URL, CODEPEN_URL, SITE_REPO } from '../../data/misc.js';

  $: wHeight = $_window && $_window.innerHeight;

  let elTitle;
  let isVisible = false;
  let limit;
  let fromTop;
  let isOnStage;
  let progressN = 0; // title scale
  let progressY = 0; // title translate
  let colorType = null;

  afterGeneralUpdate((prevState, state) => {
    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    // REVIEW - Should move this index logic to general store?
    const prevSectionIndex = state.pageSections.indexOf('words');
    const currentSectionIndex = state.pageSections.indexOf(state.pageCurrentSection);
    
    if (!prevState.isReady && state.isReady) {
      // setTimeout(() => {
      //   window.scroll(0, 8000); // FOR DEBUG
      // }, 150)
    }

    if (!isOnStage && currentSectionIndex >= prevSectionIndex) {
      isOnStage = true;
      // The "scale" effect should start before 
      initAnimation();
    }

    if (prevPageSection !== pageSection && pageSection === 'skills') {
      updateFromTop();
      verifyAnimations();
    }
  });

  function updateFromTop(elTop) {
    fromTop = fromTop || (elTop || elTitle.getBoundingClientRect().top) + window.scrollY;
  }

  function verifyAnimations() {
    console.log('scrolling skills...');
    const scrollY = window.scrollY;
    const offset = wHeight / 4;
    const closeToTop = wHeight - (fromTop - scrollY + offset);
    const perc = closeToTop / limit;

    progressN = getInLimit(perc, 0, 1);
    const translate = progressN > -1 ? limit - progressN*limit/1 : 0
    progressY = `${getInLimit(translate, 0, limit) * -1}px`
    isVisible = progressN === 1;
  }

  function initAnimation() {
    limit = wHeight / 2;

    const watchTitle = ([entry]) => {
      if (entry.isIntersecting) {
        updateFromTop(entry.boundingClientRect.top)
        window.addEventListener('scroll', verifyAnimations);
      } else {
        window.removeEventListener('scroll', verifyAnimations);
      }
    };

    const observer = new IntersectionObserver(watchTitle);

    // OPTIMIZE - disconnect
    observer.observe(elTitle);

    updateFromTop();
    verifyAnimations();
  }

  function handleColorType(ev) {
    colorType = ev.detail.colorType
  }
</script>

<style>
  .wrapper {
    --skills-bg: var(--bg_invert);
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
      background-color: #1b1b1b; /* var(--bg_invert) - fallback css variables */
      background-color: var(--skills-bg);
    }

    @media (--md) {
      padding-bottom: 33vh;
    }
  }

  .header {
    position: relative;
    margin-top: $spacer-L;
    display: flex;
    flex-direction: column;
    align-items: center;
    
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
        color: var(--text_0);
      }
    }
  }

  @media (--md) {
    .wrapper {
      padding-top: 25vh; /* enough to cover all in black I guess */
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
  id="skills"
  data-section-offset-h="15">

  <header class="header" style="--colorTabSelected: {colorType};">
    <h2 class="headerTitle f-mono"
      bind:this={elTitle}
      style='--progressN: {progressN}; --progressY: {progressY}'>
      skills
    </h2>
    <p class="headerDesc uAppear-0">
      Take a sneak peek on <a href={GITHUB_URL} class="u-link invert">Github</a> and <a href={CODEPEN_URL} class="u-link invert">Codepen</a>
    </p>
  </header>
  
  <SkillsList on:setColorType={handleColorType} />
</section>
