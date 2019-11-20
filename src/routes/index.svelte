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
  import { strDabox } from '../stores/dabox.js';

  let isMounted = false;
  let translateX = 0;
  let elHorizon;

  $: innerHeight = isMounted ? $_window.innerHeight : 0;
  $: innerWidth = isMounted ? $_window.innerWidth : 0;
  $: maxScroll = isMounted ? elHorizon.offsetWidth - (innerWidth - innerHeight) : 0;
  $: maxScroll2 = isMounted ? maxScroll + (innerWidth - innerHeight) : 0;
  $: marginTop = isMounted ? `${maxScroll + innerHeight}px` : '100vh'; // OPTIMIZE - find a more realistic value from SS;
  $: style = `--radius: ${50 - $strDabox.progress*50}%; --opacity: ${1 - $strDabox.progress}`;

  onMount(() => {
    initResponsive();
    isMounted = true;
  });

  function handleHorizon() {
    translateX = getInLimit(window.scrollY, 0, maxScroll2);
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
  }

  .horizonAfter {
    position: relative;
    margin-top: 100vh;
  }

  .dabox {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20rem;
    height: 20rem;
    background: var(--text_0); /* TODO - better color */
    border: 2px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition-delay: 0ms;
    border-radius: var(--radius, 50%);
    color: var(--bg);

    &.isActive {
      opacity: 1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: #295047;
      border-radius: var(--radius, 50%);
      opacity: var(--opacity, 1);
    }
  }
</style>

<svelte:head>
  <title>Sandrina Pereira - UX Developer</title>
</svelte:head>

<svelte:window on:scroll={handleHorizon} />

<div class="panel">
  <div class="horizon" bind:this={elHorizon} style="transform: translateX(-{translateX}px)">
    <Intro />
    <Values />
  </div>
  <div class="dabox" class:isActive={$strDabox.isActive} style={style}>
    <span class="daboxText">Hello!</span>
  </div>
</div>
<div class="horizonAfter" style="margin-top: {marginTop}">
  <Words />
  <Tools />
  <Journey />
  <Footer />
</div>
<Nav />
