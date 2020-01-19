<script>
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
  import { _window } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import { TIMEOUTS } from '../utils';

  $: currentSection = $strGeneral.pageCurrentSection;
  let pageSections = $strGeneral.pageSections;
  let navPivots = undefined;
  let wasSelected = null; // when the link is clicked, trigger the fancyBubble
  let isRICScheduled = false;
	const dispatch = createEventDispatcher();

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
  });

  afterGeneralUpdate((prevState, state) => {
    if (!prevState.isReady && state.isReady) {
      setNavigationData();
    }

    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    if (prevPageSection !== pageSection) {
      console.log('pageSection changed:', pageSection);
      
      // Do I want or ** need ** this?
      // history.pushState(null, null, `#${pageSection}`);

      if(wasSelected) {
        setTimeout(() => {
          wasSelected = null;
        }, TIMEOUTS.NAV_ANIMATING);
      }
    }
  });

  function handleScroll() {
    if (isRICScheduled) { return; }

    isRICScheduled = true;

    requestIdleCallback(verifyPageSection, {
      timeout: 300
    });
  }

  function verifyPageSection() {
    isRICScheduled = false;
    const currentY = window.scrollY;

    for (let i = 3; i >= 0; i--) {
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

  function setNavigationData() {
    const valuesWidth = (() => {
      // BUG/REVIEW: valuesEnd' parent has a smaller width than its content.
      // Dunno why.... so, instead lets get the position directly from it.
      const { left, width } = document
        .querySelectorAll('[data-section="valuesEnd"]')[0]
        .getBoundingClientRect();

      return Math.round(left + width);
    })();
    const wWidth = $_window.innerWidth;
    const wHeight = $_window.innerHeight;
    const savedHorizonOffset = valuesWidth - wHeight + Math.round(wWidth / 2);

    navPivots = $strGeneral.pageSections.map(section => {
      if (section === 'intro') {
        return { name: 'intro', y: 0 };
      }

      // if (section === 'words') {
      //   // words should only appear when "values" disappear.
      //   return { name: 'words', y: valuesWidth };
      // }

      const sectionTop = document
        .querySelectorAll(`[data-section="${section}"]`)[0]
        .getBoundingClientRect().top;

      return {
        name: section,
        y: Math.round(savedHorizonOffset + sectionTop - wHeight),
      };
    });

    dispatch('calculated', {
			horizonAfterOffset: `${savedHorizonOffset}px`
		});
  }

  function goToSection(e, pageSection) {
    e.preventDefault();

    if (pageSection === currentSection) {
      return false;
    }

    console.log('pageSection changing to:', pageSection);

    const pivot = navPivots.find(p => p.name === pageSection).y;
    const to = pageSection !== 'intro' ? pivot : 0;

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
  $gutter: var(--spacer-M);

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 5; /* above everything */
    display: none;
  }

  .links {
    &List {
      position: absolute;
      top: $gutter;
      left: calc($gutter * 2);
      display: flex;
      margin: 0;
      padding: 0;
      font-size: var(--font-M);

      @media (height > 42em) {
        /* TODO review @media */
        flex-direction: column;
      }
    }

    &Item {
      margin: 0;
      padding: 0;
      margin: 0 var(--spacer-M) 0 0;
      padding: var(--spacer-S) 0;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: -50vw;
        left: -50vw;
        width: 200vw;
        height: 200vw;
        display: block;
        border-radius: 50%;
        transform: scale(0);
        transform-origin: 25% 25%;
        box-sizing: border-box;
        z-index: -1;
      }

      &::before {
        background: var(--morph_total);
      }

      &::after {
        background: var(--bg_0);
      }

      &.isCurrent {
        @for $i from 1 to 4 {
          &:nth-child($i) {
            ~ .decorative {
              transform: translateY(calc($i * 1.62em));
            }
          }
        }
      }

      &.wasSelected {
        &::before,
        &::after {
          animation: fancyBubble 850ms ease-out;
        }

        &::after {
          animation-duration: 1100ms;
        }
      }
    }

    &Anchor {
      display: inline-block;
      text-decoration: none;
      color: var(--text_1);

      &:hover,
      &:focus,
      &[aria-current='true'] {
        color: var(--primary_1);
      }
    }
  }

  .decorative {
    position: absolute;
    left: calc($gutter * -1);
    top: -0.75em;
    width: 1.5rem;
    border-bottom: 1px solid var(--text_0);
    transition: transform 250ms ease;
  }

  :global(.g-contacts) {
    position: absolute;
    bottom: $gutter;
    left: $gutter;
    width: 100%;
    white-space: nowrap;
    opacity: 0;
    animation: laserOn 750ms calc(600ms + 50ms * 14) steps(8) forwards;
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

{#if navPivots}
  <!-- TODO: Animate this -->
  <nav class="nav">
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
      <li class="decorative" aria-hidden="true" />
    </ul>
  </nav>
{/if}
