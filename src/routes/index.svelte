<script>
  import { onMount, beforeUpdate, afterUpdate } from 'svelte';
  import Intro from '../components/Intro.svelte';
  import Values from '../components/Values.svelte';
  import Words from '../components/Words.svelte';
  import Tools from '../components/Tools.svelte';
  import Journey from '../components/Journey.svelte';
  import Footer from '../components/Footer.svelte';
  import Nav from '../components/Nav.svelte';
  import SvgSprite from '../components/SvgSprite.svelte';
  import { getInLimit, getBrowsers } from '../utils';
  import { _window, initResponsive } from '../stores/responsive.js';
  import { strGeneral, updateGeneral } from '../stores/general.js';

  let scrollY = 0;
  let scrollSpeedCached = 0;
  let scrollSpeedCurrent = 0;
  let elHorizon;
  let browserClasses = '';
  let isReady = false;
  let checkSpeed = true;
  let horizonAfterOffset = '100vh';
  let navPivots = [];
  $: pageCurrentSection = $strGeneral.pageCurrentSection;

  onMount(() => {
    initResponsive();
    browserClasses = getBrowsers();    
    monitorizeScrollSpeed();
    window.addEventListener('scroll', handleScroll);
  });

  beforeUpdate(() => {
    if(!isReady && $strGeneral.isReady) {
      setNavigationData();
      isReady = true;
      // https://github.com/sveltejs/svelte/issues/3105
      document.body.classList.add('jsGoOn');
    }

    if(checkSpeed && $strGeneral.pageCurrentSection !== 'intro') {
      scrollSpeedCurrent = 0;
      scrollSpeedCached = null; // prevent wrong speed when using nav links.
      checkSpeed = false;
    }
    
    if(!checkSpeed && $strGeneral.pageCurrentSection === 'intro') {
      scrollSpeedCurrent = 0;
      checkSpeed = true;
      monitorizeScrollSpeed();
    };
  });

  function setNavigationData() {
    const wWidth =  $_window.innerWidth;
    const wHeight = $_window.innerHeight;
    const valuesWidth = getValuesWidth();
    const savedHorizonOffset = valuesWidth - wHeight + Math.round(wWidth/2);

		navPivots = $strGeneral.pageSections.map(section => {
			if (section === 'intro') {
				return { name: 'intro', y: 0 }
			}

			if (section === 'words') {
				// exception: because of sticky effect, words only appear when "values" disappear.
				return { name: 'words', y: valuesWidth }
			}

      const sectionTop = document.querySelectorAll(`[data-section="${section}"]`)[0].getBoundingClientRect().top;

      return {
        name: section,
        y: Math.round(savedHorizonOffset + sectionTop - wHeight)
      }
    });
    
    horizonAfterOffset = `${savedHorizonOffset}px`;
  }

  function getValuesWidth () {
    // BUG: its parent has a smaller width than its content (Values container).
    // Dunno why.... so, instead lets get the position of its last children 
    const { left, width } = document.querySelectorAll('[data-section="valuesEnd"]')[0].getBoundingClientRect();
    
    return Math.round(left + width);
  }

  function monitorizeScrollSpeed() {
    scrollSpeedCurrent = scrollSpeedCached ? scrollSpeedCached - scrollY : 0;
    scrollSpeedCached = scrollY;

    if(checkSpeed) {
      requestAnimationFrame(monitorizeScrollSpeed);
    }
  }

  function handleScroll() {
    const currentY = window.scrollY;
    const isScrollingDown = scrollY < currentY;
    
    scrollY = currentY;

    // OPTIMIZE - this should be done on requestAnimation/IdleFrame
    for (let i = 3; i >= 0; i--) {

      if (currentY < navPivots[i].y) {
        continue;
      }

      const newPageCurrentSection = navPivots[i].name;
      if(newPageCurrentSection !== pageCurrentSection) {
        updateGeneral({ pageCurrentSection: newPageCurrentSection })
      }
      break;
    }
  }
</script>

<style>
  .panel {
    position: fixed;
    top: 0;
    left: 0;
    display: grid; /* make it grow horizontally */
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .horizon {
    display: flex;
    transform: translateX(calc(var(--scrollY) * -1));
  }

  .horizonAfter {
    position: fixed;
    margin-top: var(--marginTop, '100vh');

    :global(.jsGoOn) & {
      position: relative;
    }
  }
</style>

<svelte:head>
  <title>Sandrina Pereira - UX Developer</title>
</svelte:head>

<Nav pivots={navPivots} />
<div class="panel {browserClasses}"
  style="--scrollY: {scrollY}px; --scrollSpeed: {scrollSpeedCurrent};">
  <div class="horizon" bind:this={elHorizon}>
    <Intro />
    <Values />
  </div>
</div>
<div class="horizonAfter" style="--marginTop: {horizonAfterOffset}">
  <Words />
  <Tools />
  <Journey />
  <Footer />
</div>
<SvgSprite />
