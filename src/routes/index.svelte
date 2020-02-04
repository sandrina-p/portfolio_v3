<script>
  import { onMount, beforeUpdate, afterUpdate } from 'svelte';
  import Intro from '../components/Intro.svelte';
  import ValuesVertical from '../components/ValuesVertical.svelte';
  import Words from '../components/Words.svelte';
  import Skills from '../components/Skills.svelte';
  import Journey from '../components/Journey.svelte';
  import Footer from '../components/Footer.svelte';
  import Nav from '../components/Nav.svelte';
  import SvgSprite from '../components/SvgSprite.svelte';
  import { getInLimit, getBrowsers, setRIC } from '../utils';
  import { matchMq, initResponsive, afterResponsiveUpdate } from '../stores/responsive.js';
  import { strGeneral, updateGeneral } from '../stores/general.js';

  let scrollY = 0;
  let scrollSpeedCached = 0;
  let scrollSpeedCurrent = 0;
  let elHorizon;
  let browserClasses = '';
  let checkSpeed = true;
  let horizonSpace = '100vh';
  let isHorizonRequested = false;
  let ValuesHorizon = null;

  onMount(async () => {
    setRIC();
    initResponsive();
    browserClasses = getBrowsers();
    await verifyLayoutVariant();
  });

  beforeUpdate(() => {
    if (!$matchMq.md || checkSpeed && $strGeneral.pageCurrentSection !== 'intro') {
      scrollSpeedCurrent = 0;
      scrollSpeedCached = null; // prevent wrong speed when using nav links.
      checkSpeed = false;
    }

    if ($matchMq.md && !checkSpeed && $strGeneral.pageCurrentSection === 'intro') {
      scrollSpeedCurrent = 0;
      checkSpeed = true;
      monitorizeScrollSpeed();
    }
  });


  afterResponsiveUpdate(async () => {
    await verifyLayoutVariant();
  })

  async function verifyLayoutVariant() {
    if ($matchMq.md && !isHorizonRequested) {
      isHorizonRequested = true

      const module = await import('../components/ValuesHorizon.svelte');
      ValuesHorizon = module.default;

      monitorizeScrollSpeed();
      window.addEventListener('scroll', handleScroll);
    }
  }

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
    const newHorizonSpace = event.detail.horizonSpace
    horizonSpace = newHorizonSpace;

    console.log('Intro - horizonSpace updated!', newHorizonSpace)

    // https://github.com/sveltejs/svelte/issues/3105
    document.body.classList.add('jsGoOn');
  }
</script>

<style>
  .container {
  }

  /* prevent scroll while the page is loading */
  :global(body:not(.jsGoOn)) {
    height: 100%;
    overflow: hidden;
  }

  @media (--md) {
    .container {
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

    :global(main) {
      padding-top: 1px; /* so --marginTop works */
    }

    .horizonSpace {
      position: relative;
      margin-top: var(--marginTop, 100vh);
      height: 1px; /* so --marginTop works */
    }
  }
</style>

<Nav on:calculated={handleNavCalculated} />
<div
  class="container {browserClasses}"
  style="--scrollY: {scrollY}px; --scrollSpeed: {scrollSpeedCurrent};">
  <div class="horizon" bind:this={elHorizon}>
    <Intro />
    <svelte:component this={$matchMq.md ? ValuesHorizon : ValuesVertical} />
  </div>
</div>
<div class="horizonSpace" style="--marginTop: {horizonSpace}"></div>
<Words />
<Skills />
<Journey />
<Footer />
<SvgSprite />
