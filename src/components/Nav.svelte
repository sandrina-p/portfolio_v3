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
  let theme = 'light';
  let hasReducedMotion = false;
  let sunH = 4;

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

  afterResponsiveUpdate((prevState, state) => {
    if(prevState.matchMq.md !== state.matchMq.md) {
      console.warn('Changing between desktop to mobile!')
      /* Make sure Values and Navigation data are resetted correctly. */
      window.scroll(0, 0);
    }
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
    const horizonOffset = isDesktop ? getHorizonOffset(wHeight) : -wHeight*0.5;
    // use this offset to show the section in a better position.
    const dataSection = isDesktop ? 'data-section-offset-h' : 'data-section-offset-v';

    const newNavPivots = $strGeneral.pageSections.map(section => {
      if (section === 'intro') {
        return { name: 'intro', y: 0 };
      }

      const elSection = document.getElementById(section);
      // TODO remove 99999 after finish responsive stuff 
      const sectionTop = elSection.getBoundingClientRect().top || 999999999;

      return {
        name: section,
        y: Math.round(horizonOffset + sectionTop),
        offset: (elSection.getAttribute(dataSection) || 0)/100 * wHeight
      };
    });

    navPivots = newNavPivots;
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

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    sunH = newTheme === 'dark' ? 3 : 4;
    // https://github.com/sveltejs/svelte/issues/3105
    document.body.classList.remove(theme);
    document.body.classList.add(newTheme);
    theme = newTheme;
  }
</script>

<style>
  $itemW: 6rem;

  .nav {
    position: fixed;
    top: $spacer-L;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5; /* above everything */
    display: flex;
    align-items: center;
  }

  .toggleTheme,
  .toggleMotion,
  .linksItem {
    /* entry animation */
    opacity: 0;
    $time: 75ms;
  }

  .isReady {
    .toggleTheme,
    .toggleMotion,
    .linksItem {
      opacity: 1;
      transition:
        opacity 1000ms var(--delay, $time) cubic-bezier(0.0, 0.0, 0.2, 1),
        transform 1000ms var(--delay, $time) cubic-bezier(0.19, 1, 0.22, 1);
    }

    .linksList::before {
      transform: scale(1);
      transition: transform 700ms cubic-bezier(0.19, 1, 0.22, 1);
    }

    .linksItem {
      &:nth-child(1) { --delay: calc($time*3); }
      &:nth-child(2) { --delay: calc($time*2); }
      &:nth-child(3) { --delay: calc($time*1); }
      &:nth-child(4) { --delay: calc($time*2); }
      &:nth-child(5) { --delay: calc($time*3); }
    }

    .toggleTheme,
    .toggleMotion {
      --delay: calc($time*4);
    }
  }

  .links {
    &List {
      position: relative;
      display: flex;
      margin: 0;
      padding: 0;
      font-size: $font-S;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: calc($itemW/2);
        width: calc(100% - $itemW);
        height: 0.1rem;
        background-color: var(--text_invert);
        transform: scale(0, 1);
        pointer-events: none;
      }
    }

    &Item {
      position: relative;
      margin: 0;
      margin-top: calc($spacer-S * -1);
      width: $itemW;
      text-align: center;

      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0; left: 50%;
        width: $spacer-S;
        height: $spacer-S;
        border-radius: 50%;
        background-color: var(--text_invert);
        transform: translate(-50%, calc($spacer-S/2));
        pointer-events: none;
      }

      &.isCurrent,
      &:hover,
      &:focus-within {
        &::before {
          opacity: 1;
          transition: background-color 400ms;
          background-color: var(--primary_1);
        }
      }
    }

    &Anchor {
      display: block;
      color: var(--text_1);
      padding-top: $spacer-M;
      opacity: 0;
      transition: opacity 400ms;
      text-decoration: none;

      &:hover,
      &:focus {
        outline: none;
        opacity: 1;
        color: var(--primary_1);
      }
    }
  }

  .toggleTheme,
  .toggleMotion {
    position: relative;
    margin: 0 $spacer-S;
    background: transparent;
    border: none;
    width: 3rem;
    height: 3rem;
    padding: 0;
    border-radius: 50%;
    margin-top: -3rem;
    color: var(--text_1);

    &:hover,
    &:focus {
      outline: none;
      color: var(--primary_1);
    }
  }

  .sun {
    width: 100%;
    height: 100%;

    &Ray,
    &Center {
      fill: currentColor;
    }

    &Ray {
      opacity: 0.5;
    }
  }

  .motion {
    width: 1.6rem;
    height: 1.6rem;
    background: var(--text_1);
    border-radius: 50%;
    display: block;
    border: 0.2rem solid var(--bg_0);
    outline: 1px dashed red;
  }

  @media (--md) {
    /* decorative animation */
    .bubble {
      z-index: -1;

      &::before,
      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 50%;
        width: 200vw;
        height: 200vw;
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        box-sizing: border-box;
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
  }

  @keyframes fancyBubble {
    0% {
      transform: translate(-50%, -50%) scale(0);
    }
    75% {
      opacity: 1;
    }
    100% {
      transform:translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }
</style>

<nav class="nav" class:isReady={isCalculated} class:invert={currentSection === 'skills'}>
  <span class="bubble" class:wasSelected={wasSelected}></span>
  <button class="toggleTheme" on:click={toggleTheme} aria-pressed={theme === 'dark'} aria-label="Dark Theme">
    <svg class="sun u-svg" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="display:none;">
      <rect class="sunCenter" x="17.4" y="12.3" width="8" height="8" rx="4" transform="rotate(135 17.4 12.3)" fill="#3F3F3F"/>
      <rect class="sunRay" x="12.5" y="5.9" width="1.5" height={sunH} rx=".5" transform="rotate(-180 12.5 5.9)" fill="#3F3F3F"/>
      <rect class="sunRay" x="11" y="18.8" width="1.5" height={sunH} rx=".5" fill="#3F3F3F"/>
      <rect class="sunRay" x="18.2" y="13.1" width="1.5" height={sunH} rx=".5" transform="rotate(-90 18.2 13)" fill="#3F3F3F"/>
      <rect class="sunRay" x="5.2" y="11.6" width="1.5" height={sunH} rx=".5" transform="rotate(90 5.2 11.6)" fill="#3F3F3F"/>
      <rect class="sunRay" x="15.6" y="17.6" width="1.5" height={sunH} rx=".5" transform="rotate(-45 15.6 17.6)" fill="#3F3F3F"/>
      <rect class="sunRay" x="7.6" y="7.2" width="1.5" height={sunH} rx=".5" transform="rotate(135 7.6 7.2)" fill="#3F3F3F"/>
      <rect class="sunRay" x="16.8" y="8.3" width="1.5" height={sunH} rx=".5" transform="rotate(-135 16.8 8.3)" fill="#3F3F3F"/>
      <rect class="sunRay" x="6.6" y="16.3" width="1.5" height={sunH} rx=".5" transform="rotate(45 6.6 16.3)" fill="#3F3F3F"/>
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
  <button class="toggleMotion" on:click={() => true} aria-pressed={hasReducedMotion} aria-label="Reduced Motion">
    <span class="motion"></span>
  </button>
</nav>
