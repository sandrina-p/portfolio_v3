<script>
  import { onMount, beforeUpdate, afterUpdate } from 'svelte';
  // import smoothscroll from 'smoothscroll-polyfill';
  import Intro from '../components/Intro.svelte';
  import ValuesVertical from '../components/values/ValuesVertical.svelte';
  import Words from '../components/Words.svelte';
  import Skills from '../components/skills/Skills.svelte';
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
  let hasScrolled = false;

  onMount(async () => {
    setRIC();
    // smoothscroll.polyfill(); // REVIEW - Do I really need this?
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

      const module = await import('../components/values/ValuesHorizon.svelte');
      ValuesHorizon = module.default;

      monitorizeScrollSpeed();
      window.addEventListener('scroll', handleScroll);
    }
  }

  function monitorizeScrollSpeed() {
    // REVIEW - Keep or delete this?
    // scrollSpeedCurrent = scrollSpeedCached ? scrollSpeedCached - scrollY : 0;
    // scrollSpeedCached = scrollY;

    // if (checkSpeed) {
    //   requestAnimationFrame(monitorizeScrollSpeed);
    // }
  }

  function handleScroll() {
    const currentY = window.scrollY;
    scrollY = currentY;
    hasScrolled = hasScrolled || window.scrollY > 15 
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

  .tip {
    display: none;
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

    .tip {
      display: block;
      position: absolute;
      top: 50%;
      left: 100vw;
      transform: translateX(calc(-100% + var(--scrollY, 0px)));
      padding-right: $spacer-MS;
      white-space: nowrap;
      visibility: visible;
      color: var(--text_1);

      &Text {
        opacity: 0;
        animation: fadeIn 400ms 2.3s forwards ease-out;
      }

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        height: 0.1rem;
        width: 100%;
        background-color: var(--primary_1);
        transform: translateX(100%);
        animation: slideIn 500ms 1.7s forwards ease-out;
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: var(--bg_0);
        opacity: 0;
        transition: opacity 600ms ease-out;
      }

      &.isHidden {
        visibility: hidden;
        transition: visibility 0ms 1000ms;

        &::after {
          opacity: 1;
        }
      }
    }
  }
  
  @keyframes slideIn {
    0% { transform: translateX(100%) }
    100% { transform: translateX(0) }
  }
</style>

<Nav on:calculated={handleNavCalculated} />
<div
  class="container {browserClasses}"
  style="--scrollY: {scrollY}px; --scrollSpeed: {scrollSpeedCurrent};">
  <div class="horizon" bind:this={elHorizon}>
    <Intro />
    <span class="tip" aria-hidden="true" class:isHidden={hasScrolled}>
      <span class="tipText">Start scrolling</span>
    </span>
    <svelte:component this={$matchMq.md ? ValuesHorizon : ValuesVertical} />
  </div>
</div>
<div class="horizonSpace" style="--marginTop: {horizonSpace}"></div>
<Words />
<Skills />
<Journey />
<Footer />
<SvgSprite />
