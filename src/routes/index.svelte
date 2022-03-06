<script>
  import { onMount, beforeUpdate, afterUpdate } from 'svelte';
  import smoothscroll from 'smoothscroll-polyfill';

  import HeadMeta from '../components/HeadMeta.svelte';
  import Intro from '../components/Intro.svelte';
  import IntroTip from '../components/IntroTip.svelte';
  import Nav from '../components/navigation/Nav.svelte';
  import ValuesVertical from '../components/values/ValuesVertical.svelte';
  import Words from '../components/Words.svelte';
  import Skills from '../components/skills/Skills.svelte';
  import Journey from '../components/Journey.svelte';
  import Footer from '../components/Footer.svelte';
  
  import { SITE_URL } from '../data/misc';
  import { getInLimit, setRIC, focusOnlyWhenNeeded } from '../utils';
  import { matchMq, initResponsive, afterResponsiveUpdate } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';

  const workshopUrlOld = '/workshop-a11y-fundamentals'

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

    if ($matchMq.lg) {
      await loadValuesHorizon();
    } else {
      updateGeneral({ isValuesLoaded: true });
    }
  });

  async function loadValuesHorizon() {
    const module = await import('../components/values/ValuesHorizon.svelte');
    ValuesHorizon = module.default;

    window.addEventListener('scroll', handleIndexScroll);
    updateGeneral({ isValuesLoaded: true });
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

<style lang="postcss">
  /* prevent scroll while the page is loading */
  :global(body:not(.jsGoOn)) {
    height: 100%;
    overflow: hidden;
  }

  @media (--lg) {
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

<HeadMeta
  site={ SITE_URL }
  title='Sandrina Pereira - UX Engineer'
  description={`I'm a UX Frontend Engineer who helps to turn ideas into accessible experiences.`}
  coverUrl={`${SITE_URL}/cover_light-4.png`}
/>
<svelte:head>
  <script type="application/ld+json">
    [{"@context":"http://schema.org","@type":"WebSite","url":"https://sandrina-p.net","name":"Sandrina Pereira, UX Engineer"}]
  </script>
</svelte:head>
<header>
<Nav on:calculated={handleNavCalculated} horizonSpace={horizonSpace} />
</header>
<main>
<div
  class="container"
  style="--scrollY: {scrollY}px; --scrollSpeed: {scrollSpeedCurrent};">
  <div class="horizon" bind:this={elHorizon}>
    <Intro />
    <IntroTip hasScrolled={hasScrolled} />
    <svelte:component this={$matchMq.lg && ValuesHorizon ? ValuesHorizon : ValuesVertical} />
  </div>
</div>
<div class="horizonSpace" style="--marginTop: {horizonSpace}"></div>
<Words />
<Skills />
<Journey />
<Footer />


<!-- Just for Sapper build purposes -->
<a hidden href={workshopUrlOld}>Web Accessibility</a>
</main>
