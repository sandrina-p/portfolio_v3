<script>
  import { onMount, afterUpdate } from 'svelte';
  import Intro from '../components/Intro.svelte';
  import Values from '../components/Values.svelte';
  import Words from '../components/Words.svelte';
  import Tools from '../components/Tools.svelte';
  import Journey from '../components/Journey.svelte';
  import Footer from '../components/Footer.svelte';
  import Nav from '../components/Nav.svelte';
  import { getInLimit, getBrowsers } from '../utils';
  import { _window, initResponsive } from '../stores/responsive.js';
  import { strGeneral } from '../stores/general.js';

  let scrollY = 0;
  let scrollSpeedCached = 0;
  let scrollSpeedCurrent = 0;
  let elHorizon;
  let browserClasses = '';
  let isReady = false;
  let checkSpeed = true;

  $: innerHeight =  isReady ? $_window.innerHeight : 0;
  $: innerWidth =  isReady ? $_window.innerWidth : 0;
  $: marginTop = isReady ? `${innerWidth + elHorizon.offsetWidth + innerHeight/2}px` : '100vh';

  onMount(() => {
    initResponsive();
    browserClasses = getBrowsers();    
    monitorizeScrollSpeed();
    window.addEventListener('scroll', handleScroll);
  });

  afterUpdate(() => {
    if(!isReady && $strGeneral.isReady) {
      // https://github.com/sveltejs/svelte/issues/3105
      isReady = true;
      document.body.classList.add('jsGoOn');
    }

    if($strGeneral.valuesIsDone) {
      checkSpeed = false;
      scrollSpeedCurrent = 0;
    }
    
    if(!checkSpeed && !$strGeneral.valuesIsDone) {
      checkSpeed = true;
      monitorizeScrollSpeed();
    };
  });

  function monitorizeScrollSpeed() {
    scrollSpeedCurrent = scrollSpeedCached - scrollY;
    scrollSpeedCached = scrollY;

    if(checkSpeed) {
      requestAnimationFrame(monitorizeScrollSpeed);
    }
  }

  function handleScroll() {
    scrollY = window.scrollY;
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

<div class="panel {browserClasses}"
  style="--scrollY: {scrollY}px; --scrollSpeed: {scrollSpeedCurrent};">
  <div class="horizon" bind:this={elHorizon}>
    <Intro />
    <Values />
  </div>
</div>
<div class="horizonAfter" style="--marginTop: {marginTop}">
  <Words />
  <Tools />
  <Journey />
  <Footer />
</div>
<Nav />
