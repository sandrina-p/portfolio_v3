<script>
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
  import { _window, matchMq, afterResponsiveUpdate } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import { TIMEOUTS } from '../utils';

  $: currentSection = $strGeneral.pageCurrentSection;
  let pageSections = $strGeneral.pageSections;
  let navPivots = $strGeneral.pageSections.map(section => ({ name: section }));
  let isCalculated = false;
  let wasSelected = null; // when the link is clicked, trigger the fancyBubble
  let isRICScheduled = false;
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
      
      // Do I want or _need_ this?
      // history.pushState(null, null, `#${pageSection}`);

      if(wasSelected) {
        setTimeout(() => {
          wasSelected = null;
        }, TIMEOUTS.NAV_ANIMATING);
      }
    }
  });

  afterResponsiveUpdate(async () => {
    setTimeout(() => {
      // HACK: wait for values layout to mount (in case it changed)
      setNavigationData();
    }, 0);
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

    for (let i = navPivots.length - 1; i >= 0; i--) {
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

  function getHorizonOffset(wHeight) {
    // It means Values is still rendering...
    if (!document.getElementById('nav_valuesEnd')) return;

    const valuesWidth = (() => {
      // BUG/REVIEW: valuesEnd' parent has a smaller width than its content.
      // Dunno why.... so, instead lets get the position directly from it.
      const valuesEnd = document.getElementById('nav_valuesEnd');
      
      if (!valuesEnd) {
        console.warn('Ups! Nav - nav_valuesEnd does not exist!');
        return 0;
      }

      const { left, width } = valuesEnd.getBoundingClientRect();

      return Math.round(left + width);
    })();

    return valuesWidth - wHeight
  }

  function setNavigationData() {
    const isDesktop = $matchMq.md;
    const wWidth = $_window.innerWidth;
    const wHeight = $_window.innerHeight;
    const horizonOffset = isDesktop ? getHorizonOffset(wHeight) : wHeight/-2;

    navPivots = $strGeneral.pageSections.map(section => {
      if (section === 'intro') {
        return { name: 'intro', y: 0 };
      }

      const elSection = document.getElementById(section);
      // TODO remove 99999 after finish responsive stuff 
      const sectionTop = elSection.getBoundingClientRect().top || 999999999;

      return {
        name: section,
        y: Math.round(horizonOffset + sectionTop),
        // on nav click, use this offset to show the section in a better position.
        offset: isDesktop ? (elSection.getAttribute('data-section-offset') || 0)/100 * wHeight : 0,
      };
    });

    isCalculated = true;

    dispatch('calculated', {
			horizonSpace: isDesktop ? `${horizonOffset + Math.round(wWidth / 2)}px` : 0,
		});
  }

  // TODO - handle screen reader navigation.

  function goToSection(e, pageSection) {
    e.preventDefault();

    if (pageSection === currentSection) {
      return false;
    }

    console.log('pageSection changing to:', pageSection);

    const pivot = navPivots.find(p => p.name === pageSection);
    const to = pageSection !== 'intro' ? pivot.y + pivot.offset : 0;

    wasSelected = pageSection;

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
</script>

<style>
  .nav {
    position: fixed;
    top: $spacer-L;
    right: $spacer-M;
    z-index: 5; /* above everything */

    @media (--max-md) {
      outline: 1px dashed red; /* TODO */
    }
  }

  .links {
    &List {
      display: flex;
      margin: 0;
      padding: 0;
      font-size: $font-M;
    }

    &Item {
      margin: 0;
      padding: 0;
      margin: 0 $spacer-M 0 0;

      /* decorative animation */
      &::before,
      &::after {
        content: '';
        position: absolute;
        top: -50vw;
        right: -50vw;
        width: 200vw;
        height: 200vw;
        display: block;
        border-radius: 50%;
        transform: scale(0);
        transform-origin: 75% 25%;
        box-sizing: border-box;
        z-index: -1;
      }

      &::before { background-color: var(--morph_total); }
      &::after { background-color: var(--bg_0); }

      &.wasSelected {
        z-index: 1; /* so animation appears above other navItem */
        &::before,
        &::after {
          animation: fancyBubble 850ms ease-out;
        }

        &::after {
          animation-duration: 1100ms;
        }
      }
      
      /* entry animation */
      opacity: 0;
      transform: translateY(-2rem);

      .isReady & {
        opacity: 1;
        transform: translateY(0);
        transition:
          opacity 1000ms var(--delay) cubic-bezier(0.0, 0.0, 0.2, 1),
          transform 1000ms var(--delay) cubic-bezier(0.19, 1, 0.22, 1);

        $time: 75ms;

        &:nth-child(1) { --delay: calc($time*1); }
        &:nth-child(2) { --delay: calc($time*2); }
        &:nth-child(3) { --delay: calc($time*3); }
        &:nth-child(4) { --delay: calc($time*4); }
        &:nth-child(5) { --delay: calc($time*5); }
      }
    }

    &Anchor {
      color: var(--text_1);

      .invert &:not([aria-current='true']) {
        color: var(--text_invert);
      }

      &:hover,
      &:focus,
      &[aria-current='true'] {
        color: var(--primary_1);
      }
    }
  }

  @keyframes fancyBubble {
    0% {
      transform: scale(0);
    }
    75% {
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
</style>

<nav class="nav" class:isReady={isCalculated} class:invert={currentSection === 'skills'}>
  <ul class="linksList">
    {#each pageSections as name}
      <li
        class="linksItem"
        class:isCurrent={currentSection === name}
        class:wasSelected={wasSelected === name}>
        <a
          href="#{name}"
          class="linksAnchor u-linkInteract"
          aria-current={currentSection === name}
          on:click={e => goToSection(e, name)}>
          {name}
        </a>
      </li>
    {/each}
  </ul>
</nav>
