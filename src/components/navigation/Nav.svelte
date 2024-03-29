<script>
  import { createEventDispatcher } from 'svelte';
  import debounce from 'lodash/debounce';
  import { _window, matchMq, afterResponsiveUpdate } from '../../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../../stores/general.js';
  import { afterMotionUpdate } from '../../stores/motion.js';
  import ToggleTheme from './ToggleTheme.svelte';
  import ToggleMotion from './ToggleMotion.svelte';
  import ToggleContrast from './ToggleContrast.svelte';
  import { TIMEOUTS } from '../../utils';
  import { sendTrack } from '../../utils/analytics';

  const workshopUrl = '/workshop-a11y'

  const dispatch = createEventDispatcher();
  // const sectionsId = $strGeneral.pageSectionsId || {};
  $: currentSection = $strGeneral.pageCurrentSection;
  let pageSections = $strGeneral.pageSections;
  let navPivots = $strGeneral.pageSections.map(section => ({ name: section }));
  $: navPivotsLg = navPivots.length;
  let isCalculated = false;
  let wasSelected = null; // when the link is clicked, trigger the fancyTransition
  let isRICScheduled = false;
  let isMenuOpen = false;
  let deviceType = '' // desktop or mobile
  let sectionCount = 0

  // avoid too much events when navigating through menu,
  // or users "playing" with transitions back and forward.
  const trackNavPath = debounce((section, isFromMenu) => {
    sendTrack('navigation_count', sectionCount++)
    sendTrack('navigation_name', `${deviceType}_${section}${isFromMenu ? '_menu' : ''}`)
  }, 1000);

  afterGeneralUpdate((prevState, state) => {
    if (!prevState.isReady && state.isReady) {
      setNavigationData();
      window.addEventListener('scroll', handleNavScroll);
      deviceType = `${$matchMq.lg ? 'desktop' : 'mobile'}`
    }

    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    if (prevPageSection !== pageSection) {
      console.log('pageSection changed:', pageSection);
      if(wasSelected) {
        setTimeout(() => {
          wasSelected = null;
        }, TIMEOUTS.NAV_ANIMATING);
      }
    }
  });

  afterMotionUpdate((prevState, state) => {
    if($strGeneral.isReady && (prevState.isReduced !== state.isReduced)) {
      // Some heights/margin/paddings change around,
      // so let's make sure nav is on point.
      setNavigationData();
    }
  });
  
  afterResponsiveUpdate((prevState, state) => {
    if(prevState.matchMq.lg !== state.matchMq.lg) {
      // There are so many animations and layout changes and edge cases
      // that the best UX is:
      // 1. set the scroll back to the beginning and... */
      window.scrollTo(0, 0);
      // 2.A reset/handle/adapt all animations around.
      // or...
      // 2.B Just refresh the page, and come back to this later (maybe never?)
      // Maybe I could show a banner to gently warn about this and count 3 2 1 before refresh.
      // TODO/OPTIMIZE. [*CODE_SHAME*]
      console.warn('The page changed between mobile/desktop. Reloading...')
      // Okay... this is the part I'm less proud off.
      sendTrack('ups_reload')
      // in case ga doesn't fire fast enough.
      setTimeout(() => { location.reload() }, 1000)
    } else {
      setNavigationData();
      sendTrack('resize', `${prevState.matchMq.lg}_${state.matchMq.lg}`);
    }
  })

  function updateSection(section) {
    updateGeneral({ pageCurrentSection: section });
    trackNavPath(section, wasSelected);
  }

  function handleNavScroll() {
    if (isRICScheduled) { return; }

    isRICScheduled = true;

    requestIdleCallback(verifyPageSection, {
      timeout: 150
    });
  }

  function verifyPageSection() {
    isRICScheduled = false;
    const currentY = window.scrollY;

    if(isMenuOpen) { isMenuOpen = false; }

    for (let i = navPivotsLg - 1; i >= 0; i--) {
      if (currentY < navPivots[i].y) {
        continue;
      }

      const newCurrentSection = navPivots[i].name;
      if (newCurrentSection !== currentSection) {
        updateSection(newCurrentSection)
      }
      break;
    }
  }

  function getHorizonOffset(scrollY, wHeight) {
    // BUG/REVIEW/EDGE_CASE: valuesEnd' parent has a smaller width than its content.
    // Dunno why.... so, instead lets get the position directly from it.
    const valuesEnd = document.getElementById('nav_valuesEnd');

    // It means Values is still loading/rendering...
    if (!valuesEnd) {
      console.warn('nav_valuesEnd does not exist! Is still rendering...');
      return 0
    };

    const valuesWidth = (() => {      
      const { left, width } = valuesEnd.getBoundingClientRect();

      // add scrollY in case the resize happens in the "middle" of the page.
      return Math.round(scrollY + left + width);
    })();

    return valuesWidth - wHeight
  }

  function setNavigationData() {
    const isDesktop = $matchMq.lg;
    const wWidth = $_window.innerWidth;
    const wHeight = $_window.innerHeight;
    const scrollY = window.scrollY; 
    const horizonOffset = isDesktop ? getHorizonOffset(scrollY, wHeight) : -wHeight*0.5;
    // use this offset to show the section in a better position.
    const dataSection = isDesktop ? 'data-section-offset-h' : 'data-section-offset-v';
    // When recalculating the nav on page resize, we should ignore the horizonSpace
    // so all the math matches correctly. Explaining this is hard.
    const horizonSpaceInPixels = horizonSpace === '100vh' ? wHeight : parseFloat(horizonSpace);
    const anullPrevHorizon = isDesktop ? horizonSpaceInPixels : 0;
    const newHorizonSpace = isDesktop ? horizonOffset + Math.round(wWidth / 2) : horizonOffset;

    const newNavPivots = $strGeneral.pageSections.map(section => {
      if (section === 'intro') {
        return { name: 'intro', y: 0 };
      }

      const elSection = document.getElementById(section);
      const sectionTop = scrollY + elSection.getBoundingClientRect().top;
      return {
        name: section,
        y: Math.round(newHorizonSpace + sectionTop - anullPrevHorizon),
        offset: Math.round((elSection.getAttribute(dataSection) || 0)/100 * wHeight)
      };
    });

    navPivots = newNavPivots;
    console.log('::newNavPivots', newNavPivots)
    isCalculated = true;

    dispatch('calculated', {
      horizonSpace: isDesktop ? `${newHorizonSpace}px` : 0
		});
  }

  function goToSection(e, pageSection) {
    e.preventDefault();

    if (pageSection === currentSection) {
      return false;
    }

    console.log('nav clicked at:', pageSection);

    const pivot = navPivots.find(p => p.name === pageSection);
    const to = pageSection !== 'intro' ? pivot.y + pivot.offset : 0;

    wasSelected = pageSection;
    isMenuOpen = false;

    document.getElementById(pageSection).focus({ preventScroll: true }); // Help keyboard users

    if(!$matchMq.lg) {
      window.scroll({ top: to, behavior: 'smooth' });
      return
    }

    setTimeout(() => {
      console.log('scrolled by click');
      // NOTE: Make sure to call scrollTo before updateGeneral,
      // so all sections read currectly the current scrollY
      window.scrollTo(0, to);

      setTimeout(() => {
        updateSection(pageSection);
      }, TIMEOUTS.NAV_SCROLLED);

    }, TIMEOUTS.NAV_ANIMATING);
  }

  function handleMenuBtnClick() {
    isMenuOpen = !isMenuOpen
  }

  function trackClick(action) {
    sendTrack('click_nav', action)
  }

  export let horizonSpace;
</script>

<style lang="postcss">
  @define-mixin motionDefault { :global(.jsMotionDefault) & { @mixin-content; } }
  @define-mixin motionReduced { :global(.jsMotionReduced) & { @mixin-content; } }

  $itemW: 6rem;
  $openDelay: 30ms;
  $introDelay: 250ms; /* IntroTip fadeout time * 2 */

  .nav {
    position: fixed;
    top: 0; right: 0;
    padding: $spacer-M $spacer-M 0 0;
    display: flex;
    color: var(--text_0);
    z-index: 5; /* above everything */
 
    opacity: 0;
    pointer-events: none;

    &.isReady {
      opacity: 1;
      pointer-events: auto;
      transition:
        opacity 1000ms $introDelay cubic-bezier(0.0, 0.0, 0.2, 1),
        transform 1000ms $introDelay cubic-bezier(0.19, 1, 0.22, 1);
    }

    :global(.u-btnMain) {
      margin-right: $spacer-M;
      align-self: center;
    }
  }

  :global(.btnTheme) {
    margin-right: $spacer-S;
    z-index: 2; /* above open menu */
  }

  .menu {
    position: relative;
  }

  .drawer {
    position: absolute;
    margin: 0;
    padding: 0;
    top: 4.4rem; /* btn height */
    right: 0;
    display: block;
    text-align: right;
    pointer-events: none;
    padding-right: $spacer-XS;

    .isOpen & {
      pointer-events: auto;
    }

    &::before { /* actual bg */
      --timeBg: calc($openDelay*3);
      content: '';
      width: calc(100% + $spacer-S*5);
      height: calc(100% + $spacer-M*6);
      display: block;
      position: absolute;
      background: var(--bg_1);
      border-bottom-left-radius: 3px;
      top: calc($spacer-M * -5);
      right: calc($spacer-M * -1);
      z-index: -1;
      transform: translateY(-100%) skew(0, 0);
      transition: transform 200ms 200ms ease-out;

      @mixin motionReduced { transition: none !important; }

      .isOpen & {
        transition: transform 500ms cubic-bezier(0.0, 0.0, 0.2, 1);
        transform: translateY(0) skew(0, 10deg);
      }
    }
  }

  .links {
    &Anchor {
      position: relative;
      display: inline-block;
      color: inherit;
      padding: calc($spacer-S + $spacer-XS) $spacer-S;
      text-decoration: none;
      font-size: $font-L;
      font-weight: 500;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        right: -3.1rem;
        width: $spacer-M;
        height: 0.2rem;
        border-radius: 3px;
        background-color: currentColor;
        transform: scale(var(--scale, 0), 1) translateX(-50%);
        transform-origin: 50%;

        @mixin motionDefault {
          transition: transform 250ms, background-color 250ms;
        }
      }

      &[aria-current="location"] {
        --scale: 1;
        color: var(--primary_1);
      }

        clip-path: polygon(0 0, 100% 0, 100% -2%, 0 -120%);

      .isOpen & {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      
        &:hover,
        &:focus {
          outline: none;
          --scale: 1;
          color: var(--primary_1);
        }
      }

      @media (--max-lg) {
        margin-top: $spacer-S; /* more space to click */
      }
    }
  }

  .linksAnchor,
  .line,
  :global(.btnToggle) {
    opacity: 0;

    @mixin motionDefault {
      transition: 
      opacity var(--time, 400ms) var(--delay, $openDelay) cubic-bezier(0.0, 0.0, 0.2, 1),
      clip-path var(--time, 400ms) var(--delay, $openDelay) cubic-bezier(0.0, 0.0, 0.2, 1);
    }

    .isOpen & {
      opacity: 1;
    }
  }

  .linksItem {
    --time: 300ms;
    &:nth-child(1) { --delay: calc($openDelay*3); }
    &:nth-child(2) { --delay: calc($openDelay*2.5); }
    &:nth-child(3) { --delay: calc($openDelay*2); }
    &:nth-child(4) { --delay: calc($openDelay*1.5); }
    &:nth-child(5) { --delay: calc($openDelay*1); }

    .isOpen & {
      --time: 400ms;
      &:nth-child(1) { --delay: calc($openDelay*0); }
      &:nth-child(2) { --delay: calc($openDelay*2); }
      &:nth-child(3) { --delay: calc($openDelay*3); }
      &:nth-child(4) { --delay: calc($openDelay*4); }
      &:nth-child(5) { --delay: calc($openDelay*5); }
    }
  }

  .line,
  :global(.btnToggle) {
    --time: 300ms;
    --delay: calc($openDelay*0.5);

    .isOpen & {
      --time: 1000ms;
      --delay: calc($openDelay*7);
    }
  }

  .toggles {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .burger {
    &Btn {
      width: 4.4rem;
      height: 4.4rem;
      background: none;
      border: none;
      border-radius: 0.3rem;
      color: var(--text_1);
      cursor: pointer;

      &[aria-expanded="true"],
      &:focus,
      &:hover {
        outline: none;
        color: var(--primary_1);
      }

      &[aria-expanded="true"] {
        .burgerSvgTop {
          transform: rotate(-45deg) translate(0.1rem, 0.8rem);
        }

        .burgerSvgMid {
          opacity: 0;
        }

        .burgerSvgBott {
          transform: rotate(45deg) translate(0.1rem, -0.8rem);
        }
      }
    }

    &Svg {
      width: 2rem;
      height: 1.6rem;
      fill: currentColor;
      margin: 0 auto;

      &Top,
      &Mid,
      &Bott {
        transform-origin: 50%;
        transition: transform 250ms ease-in-out, opacity 250ms ease-in-out;
      }

      &Mid {
        opacity: 0.7;
      }
    }
  }

  /* decorative animation */
  .bubble {
    @media(--max-lg) {
      display: none;
    }

    position: absolute;
    top: 0; right: 0;
    z-index: -1;

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0; right: 0;
      width: 100vw;
      height: 100vh;
      box-sizing: border-box;
      opacity: 0;
      pointer-events: none;
      background-color: var(--bg_0);
    }

    &.wasSelected {
       &::after {
        animation: fancyTransition 1150ms ease-out;
        animation-duration: 1000ms;
      }
    }
  }

  .line {
    display: block;
    border-bottom: 0.1rem solid var(--morph_total);
    padding-top: $spacer-S;
    margin: 0 $spacer-S $spacer-M;
  }

  @keyframes fancyTransition {
    /* not that fancy after all... */
    0%, 100% {
      opacity: 0;
    }
    45%,
    70% {
      opacity: 1;
    }
  }
</style>

<nav class="nav" class:isReady={isCalculated} aria-label="Main">
  <span class="bubble" class:wasSelected={wasSelected}></span>
  <a class="u-btnMain asSm" href={workshopUrl} target="_self" on:click={() => trackClick('a11y')} >Join A11Y workshop</a>
  <ToggleTheme klass='btnTheme' /> 
  <div class="menu" class:isOpen={isMenuOpen}>

    <button class="burgerBtn" aria-expanded={isMenuOpen} aria-controls="nav" on:click={handleMenuBtnClick}>
      <span class="sr-only">Toggle navigation</span>
      <svg class="burgerSvg u-svg" style="display: none;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16">
        <rect x="0" y="0" width="20" height="2" rx="1" class="burgerSvgTop" />
        <rect x="5" y="7" width="15" height="2" rx="1" class="burgerSvgMid" />
        <rect x="0" y="14" width="20" height="2" rx="1" class="burgerSvgBott" />
      </svg>
    </button>

    <div class="drawer" inert={isMenuOpen ? undefined : ''} id="mainNav">
      <ul class="links">
        {#each pageSections as name}
          <li
            class="linksItem"
            class:isCurrent={currentSection === name}>
            <a
              href="#{name}"
              class="linksAnchor"
              aria-current={currentSection === name ? 'location' : undefined}
              on:click={e => goToSection(e, name)}>
              {name}
            </a>
          </li>
        {/each}
      </ul>
      <span class="line"></span>
      <div class="toggles">
        <ToggleMotion klass='btnToggle' />
        <!-- <ToggleContrast klass='btnToggle' /> -->
      </div>
    </div>
  </div>
</nav>
