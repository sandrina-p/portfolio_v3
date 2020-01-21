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
  import { getInLimit, getBrowsers, setRIC } from '../utils';
  import { _window, initResponsive } from '../stores/responsive.js';
  import { strGeneral, updateGeneral } from '../stores/general.js';

  let scrollY = 0;
  let scrollSpeedCached = 0;
  let scrollSpeedCurrent = 0;
  let elHorizon;
  let browserClasses = '';
  let checkSpeed = true;
  let horizonSpace = '100vh';

  onMount(() => {
    initResponsive();
    browserClasses = getBrowsers();
    monitorizeScrollSpeed();
    setRIC();
    window.addEventListener('scroll', handleScroll);
  });

  beforeUpdate(() => {
    if (checkSpeed && $strGeneral.pageCurrentSection !== 'intro') {
      scrollSpeedCurrent = 0;
      scrollSpeedCached = null; // prevent wrong speed when using nav links.
      checkSpeed = false;
    }

    if (!checkSpeed && $strGeneral.pageCurrentSection === 'intro') {
      scrollSpeedCurrent = 0;
      checkSpeed = true;
      monitorizeScrollSpeed();
    }
  });

  function monitorizeScrollSpeed() {
    scrollSpeedCurrent = scrollSpeedCached ? scrollSpeedCached - scrollY : 0;
    scrollSpeedCached = scrollY;

    if (checkSpeed) {
      requestAnimationFrame(monitorizeScrollSpeed);
    }
  }

  function handleScroll() {
    const currentY = window.scrollY;
    scrollY = currentY;
  }

  function handleNavCalculated(event) {
    horizonSpace = event.detail.horizonSpace;
    // https://github.com/sveltejs/svelte/issues/3105
    document.body.classList.add('jsGoOn');
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

  .horizonSpace {
    position: relative;
    margin-top: var(--marginTop, 100vh);
    height: 1px; /* to make margin work */
  }

  /* prevent scroll while the page is loading */
  :global(body:not(.jsGoOn)) {
    height: 100%;
    overflow: hidden;
  }
</style>

<Nav on:calculated={handleNavCalculated} />
<div
  class="panel {browserClasses}"
  style="--scrollY: {scrollY}px; --scrollSpeed: {scrollSpeedCurrent};">
  <div class="horizon" bind:this={elHorizon}>
    <Intro />
    <Values />
  </div>
</div>
<div class="horizonSpace" style="--marginTop: {horizonSpace}"></div>
<Words />
<Tools />
<Journey />
<Footer />
<SvgSprite />
