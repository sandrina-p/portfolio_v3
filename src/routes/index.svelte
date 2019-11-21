<script>
  import { onMount } from 'svelte';
  import Intro from '../components/Intro.svelte';
  import Values from '../components/Values.svelte';
  import Words from '../components/Words.svelte';
  import Tools from '../components/Tools.svelte';
  import Journey from '../components/Journey.svelte';
  import Footer from '../components/Footer.svelte';
  import Nav from '../components/Nav.svelte';
  import { getInLimit } from '../utils';
  import { _window, initResponsive } from '../stores/responsive.js';

  let isMounted = false;
  let translateX = 0;
  let scrollY = 0;
  let scrollSpeedLastY = 0;
  let scrollSpeed = 0;
  let elHorizon;

  $: innerHeight = isMounted ? $_window.innerHeight : 0;
  $: innerWidth = isMounted ? $_window.innerWidth : 0;
  $: maxScroll = isMounted ? elHorizon.offsetWidth - (innerWidth - innerHeight) : 0;
  $: marginTop = isMounted ? `${maxScroll + innerHeight}px` : '100vh'; // OPTIMIZE - find a more realistic value from SS;

  onMount(() => {
    initResponsive();
    scrollY = window.scrollY;
    isMounted = true;
    
    checkScrollSpeed();
    window.addEventListener('scroll', handleScroll);
  });

  function checkScrollSpeed() {
    scrollSpeed = scrollSpeedLastY - scrollY;
    scrollSpeedLastY = scrollY;

    requestAnimationFrame(checkScrollSpeed);
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
    position: relative;
    margin-top: 100vh;
  }
</style>

<svelte:head>
  <title>Sandrina Pereira - UX Developer</title>
</svelte:head>

<div class="panel" style="--scrollY: {scrollY}px; --scrollSpeed: {scrollSpeed};">
  <div class="horizon" bind:this={elHorizon}>
    <Intro />
    <Values />
  </div>
</div>
<div class="horizonAfter" style="margin-top: {marginTop}">
  <Words />
  <Tools />
  <Journey />
  <Footer />
</div>
<Nav />
