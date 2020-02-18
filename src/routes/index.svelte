<script>
  import { onMount, beforeUpdate, afterUpdate } from 'svelte';
  import smoothscroll from 'smoothscroll-polyfill';
  import Intro from '../components/Intro.svelte';
  import IntroTip from '../components/IntroTip.svelte';
  import Nav from '../components/navigation/Nav.svelte';
  import ValuesVertical from '../components/values/ValuesVertical.svelte';
  import Words from '../components/Words.svelte';
  import Skills from '../components/skills/Skills.svelte';
  import Journey from '../components/Journey.svelte';
  import Footer from '../components/Footer.svelte';
  import SvgSprite from '../components/SvgSprite.svelte';
  import { getInLimit, setRIC, focusOnlyWhenNeeded } from '../utils';
  import { matchMq, initResponsive, afterResponsiveUpdate } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';

  let scrollY = 0;
  let scrollSpeedCached = 0;
  let scrollSpeedCurrent = 0;
  let elHorizon;
  let browserClasses = '';
  let checkSpeed = true;
  let horizonSpace = '100vh';
  let ValuesHorizon = null;
  let hasScrolled = false;

  onMount(async () => {
    setRIC();
    initResponsive();
    smoothscroll.polyfill();
    focusOnlyWhenNeeded();

    if ($matchMq.md) {
      await loadValuesHorizon();
    } else {
      updateGeneral({ isValuesLoaded: true });
    }
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

  async function loadValuesHorizon() {
    const module = await import('../components/values/ValuesHorizon.svelte');
    ValuesHorizon = module.default;

    monitorizeScrollSpeed();
    window.addEventListener('scroll', handleIndexScroll);
    updateGeneral({ isValuesLoaded: true });
  }

  function monitorizeScrollSpeed() {
    // REVIEW - Keep or delete this?
    // scrollSpeedCurrent = scrollSpeedCached ? scrollSpeedCached - scrollY : 0;
    // scrollSpeedCached = scrollY;

    // if (checkSpeed) {
    //   requestAnimationFrame(monitorizeScrollSpeed);
    // }
  }

  function handleIndexScroll() {
    const currentY = window.scrollY;
    scrollY = currentY;
    hasScrolled = hasScrolled || window.scrollY > 15 
  }

  function handleNavCalculated(event) {
    const newHorizonSpace = event.detail.horizonSpace
    horizonSpace = newHorizonSpace;

    console.log('Nav and (horizonSpace) updated!', newHorizonSpace)

    // https://github.com/sveltejs/svelte/issues/3105
    document.body.classList.add('jsGoOn');
  }
</script>

<style>
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

<Nav on:calculated={handleNavCalculated} horizonSpace={horizonSpace} />
<div
  class="container"
  style="--scrollY: {scrollY}px; --scrollSpeed: {scrollSpeedCurrent};">
  <div class="horizon" bind:this={elHorizon}>
    <Intro />
    <IntroTip hasScrolled={hasScrolled} />
    <svelte:component this={$matchMq.md && ValuesHorizon ? ValuesHorizon : ValuesVertical} />
  </div>
</div>
<div class="horizonSpace" style="--marginTop: {horizonSpace}"></div>
<Words />
<Skills />
<Journey />
<Footer />
<SvgSprite />
