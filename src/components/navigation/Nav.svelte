<script>
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import { _window, matchMq, afterResponsiveUpdate } from '../../stores/responsive.js';
  import ToggleTheme from './ToggleTheme.svelte';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../../stores/general.js';
  import { TIMEOUTS } from '../../utils';

  $: currentSection = $strGeneral.pageCurrentSection;
  let pageSections = $strGeneral.pageSections;
  let navPivots = $strGeneral.pageSections.map(section => ({ name: section }));
  $: navPivotsLg = navPivots.length;
  let isCalculated = false;
  let wasSelected = null; // when the link is clicked, trigger the fancyBubble
  let isRICScheduled = false;
  let isMenuOpen = false;

	const dispatch = createEventDispatcher();

  afterGeneralUpdate((prevState, state) => {
    if (!prevState.isReady && state.isReady) {
      setNavigationData();
      window.addEventListener('scroll', handleScroll);
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

    // OPTMIZE - Need this if I address [*CODE_SHAME*]
    // if (prevState.isValuesChanging && !state.isValuesChanging) {
    //   console.warn('isValuesChanging - finished: restarting nav');
    //   setNavigationData();
    // }
  });
  
  afterResponsiveUpdate((prevState, state) => {
    if(prevState.matchMq.md !== state.matchMq.md) {
      // There are so many animations and layout changes and edge cases
      // that the best UX is:
      // 1. set the scroll back to the beginning */
      window.scrollTo(0, 0);
      // 2.A and reset/handle/adapt all animations around.
      // or...!
      // 2.B Just refresh the page, and come back to this later (maybe never?)
      // TODO/OPTIMIZE. [*CODE_SHAME*]
      console.warn('The page changed between mobile/desktop. Reloading...')
      location.reload(); // Okay... this is the part I'm less proud off.
      // Maybe I could show a banner to gently warn about danger and ask for a refresh.
    } else {
      setNavigationData();
    }
  })

  function handleScroll() {
    if (isRICScheduled) { return; }

    isRICScheduled = true;

    requestIdleCallback(verifyPageSection, {
      timeout: 150
    });
  }

  function verifyPageSection() {
    isRICScheduled = false;
    const currentY = window.scrollY;

    for (let i = navPivotsLg - 1; i >= 0; i--) {
      if (currentY < navPivots[i].y) {
        continue;
      }

      const newCurrentSection = navPivots[i].name;
      if (newCurrentSection !== currentSection) {
        updateGeneral({ pageCurrentSection: newCurrentSection });
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
    const isDesktop = $matchMq.md;
    const wWidth = $_window.innerWidth;
    const wHeight = $_window.innerHeight;
    const scrollY = window.scrollY; 
    const horizonOffset = isDesktop ? getHorizonOffset(scrollY, wHeight) : -wHeight*0.5;
    // use this offset to show the section in a better position.
    const dataSection = isDesktop ? 'data-section-offset-h' : 'data-section-offset-v';
    // When recalculating the nav on page resize, we should ignore the horizonSpace
    // so all the math matches correctly. Explaining this is hard.
    const horizonSpaceInPixels = horizonSpace === '100vh' ? wHeight : parseFloat(horizonSpace);
    const anullPrevHorizon = horizonSpaceInPixels - wHeight;

    const newNavPivots = $strGeneral.pageSections.map(section => {
      if (section === 'intro') {
        return { name: 'intro', y: 0 };
      }

      const elSection = document.getElementById(section);
      const sectionTop = scrollY + elSection.getBoundingClientRect().top;

      return {
        name: section,
        y: Math.round(horizonOffset + sectionTop - anullPrevHorizon),
        offset: Math.round((elSection.getAttribute(dataSection) || 0)/100 * wHeight)
      };
    });

    navPivots = newNavPivots;
    console.log('::newNavPivots', newNavPivots)
    isCalculated = true;

    dispatch('calculated', {
      horizonSpace: isDesktop
        // horizonOffset may not exist when isDesktop.
        // it means valuesHorizon isn't loaded yet, so we pass 100vh to avoid
        // showing the other sections while Values is still loading.
        ? horizonOffset ? `${horizonOffset + Math.round(wWidth / 2)}px` : '100vh'
        : 0
		});
  }

  function goToSection(e, pageSection) {
    e.preventDefault();

    if (pageSection === currentSection) {
      return false;
    }

    console.log('pageSection changing to:', pageSection);

    const pivot = navPivots.find(p => p.name === pageSection);
    const to = pageSection !== 'intro' ? pivot.y + pivot.offset : 0;

    wasSelected = pageSection;

    document.getElementById(pageSection).focus(); // Help keyboard users

    setTimeout(() => {
      console.log('scrolled by click');
      // NOTE: Make sure to call scrollTo before updateGeneral,
      // so all sections read currectly the current scrollY
      window.scrollTo(0, to);

      setTimeout(() => {
        updateGeneral({ pageCurrentSection: pageSection });
      }, TIMEOUTS.NAV_SCROLLED);

    }, TIMEOUTS.NAV_ANIMATING);
  }

  function handleMenuBtnClick() {
    isMenuOpen = !isMenuOpen
  }

  export let horizonSpace;
</script>

<style>
  $itemW: 6rem;

  .nav {
    position: fixed;
    top: $spacer-M;
    right: $spacer-M;
    display: flex;
    color: var(--text_1);
    z-index: 5; /* above everything */

    &.isInverted {
      color: var(--text_invert);
    }

    :global(.dark) &.isInverted {
      color: var(--text_1);
    }
  }

  :global(.toggleBtn),
  .menu {
    opacity: 0;
    pointer-events: none;
  }

  .isReady {
    $time: 75ms;

    :global(.toggleBtn),
    .menu {
      opacity: 1;
      pointer-events: auto;
      transition:
        opacity 1000ms cubic-bezier(0.0, 0.0, 0.2, 1),
        transform 1000ms cubic-bezier(0.19, 1, 0.22, 1);
    }
  }

  :global(.toggleBtn) {
    margin-right: $spacer-S;
  }

  .menu {
    position: relative;
  }

  .links {
    &List {
      position: absolute;
      margin: 0;
      padding: 0;
      top: 4.4rem; /* btn height */
      right: 0;
      display: block;
      text-align: right;
    }

    &Item {
      --time: 300ms;
      &:nth-child(1) { --delay: calc($time*5); }
      &:nth-child(2) { --delay: calc($time*4); }
      &:nth-child(3) { --delay: calc($time*3); }
      &:nth-child(4) { --delay: calc($time*2); }
      &:nth-child(5) { --delay: calc($time*1); }

      .isOpen & {
        --time: 1000ms;
        &:nth-child(1) { --delay: calc($time*1); }
        &:nth-child(2) { --delay: calc($time*2); }
        &:nth-child(3) { --delay: calc($time*3); }
        &:nth-child(4) { --delay: calc($time*4); }
        &:nth-child(5) { --delay: calc($time*5); }
      }
    }

    &Anchor {
      display: block;
      color: inherit;
      padding: $spacer-S;
      text-decoration: none;
      visibility: hidden;
      opacity: 0;
      font-size: $font-S;
      pointer-events: none;
      transition: opacity var(--time, 1000ms) var(--delay, $time) cubic-bezier(0.0, 0.0, 0.2, 1),
        visibility 1ms var(--delayVis, 500ms);

      &[aria-current="true"] {
        color: var(--primary_1_sat);
      }

      .isOpen & {
        opacity: 1;
        pointer-events: auto;
        visibility: visible;
        --delayVis: 0ms;

        &:hover,
        &:focus {
          outline: none;
          color: var(--primary_1_sat);
        }
      }

      @media (--max-md) {
        margin-top: $spacer-S; /* more space to click */
      }
    }
  }

  .burger {
    &Btn {
      width: 4.4rem;
      height: 4.4rem;
      background: none;
      border: none;
      border-radius: 0.3rem;
      color: inherit;
      cursor: pointer;

      &[aria-pressed="true"],
      &:focus,
      &:hover {
        outline: none;
        color: var(--primary_1_sat);
      }

      &[aria-pressed="true"] {
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
    position: absolute;
    z-index: -1;

    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 50%;
      width: 100vw;
      height: 100vw;
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      box-sizing: border-box;

      @media (orientation: portrait) {
        width: 200vw;
        height: 200vw;
      }
    }

    &::before { background-color: var(--morph_total); }
    &::after { background-color: var(--bg_0); }

    &.wasSelected {
      &::before,
      &::after {
        animation: fancyBubble 1150ms ease-out;
      }

      &::after {
        animation-duration: 1400ms;
      }
    }
  }

  @keyframes fancyBubble {
    0% {
      transform: translate(-50%, -50%) scale(0);
    }
    75% {
      opacity: 1;
    }
    100% {
      transform:translate(-50%, -50%) scale(3);
      opacity: 0;
    }
  }
</style>

<nav class="nav"
  class:isReady={isCalculated}
  class:isInverted={currentSection === 'skills'}>
  <span class="bubble" class:wasSelected={wasSelected}></span>
  <ToggleTheme klass='toggleBtn' />
  <div class="menu" class:isOpen={isMenuOpen}>
    <button class="burgerBtn" aria-label="open menu" aria-pressed={isMenuOpen} on:click={handleMenuBtnClick}>
      <svg class="burgerSvg u-svg" style="display: none;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16">
        <rect x="0" y="0" width="20" height="2" rx="1" class="burgerSvgTop" />
        <rect x="5" y="7" width="15" height="2" rx="1" class="burgerSvgMid" />
        <rect x="0" y="14" width="20" height="2" rx="1" class="burgerSvgBott" />
      </svg>
    </button>
    <ul class="linksList">
      {#each pageSections as name}
        <li
          class="linksItem"
          class:isCurrent={currentSection === name}>
          <a
            href="#{name}"
            class="linksAnchor"
            aria-current={currentSection === name}
            on:click={e => goToSection(e, name)}>
            {name}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>
