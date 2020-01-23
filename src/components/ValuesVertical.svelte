<script>
  import { onMount, afterUpdate, onDestroy } from 'svelte';
  import { getInLimit, getIOstatusVertical } from '../utils';
  import { _window, afterResponsiveUpdate } from '../stores/responsive.js';
  import { strDabox, updateDabox } from '../stores/dabox.js';
  import { updateCircle } from '../stores/circle.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import Dots from './animations/Dots.svelte';
  import Gelly from './animations/Gelly.svelte';
  import Echo from './animations/Echo.svelte';
  import valuesData from '../data/values.js';

  const parts = ['MORPH', 'DOTS', 'ASK', 'WOLF', 'PEOPLE', 'FINALLE'];
  $:isOnStage = $strGeneral.isReady && $strGeneral.pageCurrentSection === 'intro';
  
  let currentPart = 'MORPH';
  let elDots;
  let elAsk;
  let elWolf;
  let elPeople;
  let animations;
  let isOnWolfMax = false; // OPTMIZE this...

  let isMount = false; /* wait for Intro animations */
  let scrollY = 0;

  // ::: Morphose - a circle to a square (dabox)
  // REVIEW - Maybe this shouldn't be here it's only logic and between Intro and Values
  const size = 200; // OPTMIZE - get real CSS Variables from circle
  const distance = 300;
  const scaleStart = 0.8;
  $: wInnerWidthHalf = isMount && $_window.innerWidth / 2;
  // $: distance = isMount && wInnerWidthHalf - (size * 1.5);
  const morphCircleRatio = 2; // circle progression based on scroll. (it needs to scroll 20px to change 10px)
  const morphBoxRatio = 150; // nr of scrolled pixels needed to change border-radius from circle to square
  let isMorphing = true;

  $: offLimit = 0; // isMount && wInnerWidthHalf + (distance * morphCircleRatio) + morphBoxRatio;
  $: morphZone = 0; // distance && wInnerWidthHalf + distance + size; // size serves as a "gap" to avoid a direct morph from primary to bg when scrolling quickly though it. 
  $: morphStyle = ''; // morphZone && `width: ${morphZone}px`;

  $: daboxStyle = '';
    // ($strDabox.progress
    //   ? `--radius: ${50 - $strDabox.progress * 50}%;` +
    //     `--opacity: ${1 - $strDabox.progress};`
    //   : '') +
    // `--width: var(--width-${currentPart});` +
    // `--height: var(--height-${currentPart});`;

  const styleContainer = Object.keys(valuesData).reduce(
    (styles, part) =>
      (styles += `--width-${part}: ${valuesData[part].width}; --height-${part}: ${valuesData[part].height};`),
    ''
  );

  let styleClip = {}; // a list of clipping for each part

  onMount(() => {
    isMount = true;
    // window.addEventListener('scroll', verifyMetamorphose, { passive: true });
    animations = initAnimations();
  });

  onDestroy(() => {
    animations && animations.pause();
  })


  afterGeneralUpdate((prevState, state) => {
    // TODO - Handle THIS....
    
    // const prevPageSection = prevState.pageCurrentSection;
    // const pageSection = state.pageCurrentSection;

    // if (prevPageSection === pageSection) {
    //   return false;
    // }

    // // Pause animations in case user scrolled beyond intro
    // if (pageSection !== 'intro') {
    //   if(currentPart !== 'FINALLE') {
    //     currentPart = 'FINALLE';
    //     animations.pause();
    //   }
    //   return;
    // }
    
    // if(window.scrollY === 0) { // a.k.a triggered by navigation link
    //   currentPart = 'MORPH';
    //   // verifyMetamorphose();
    //   animations.continue(true);
    // } else {
    //   currentPart = 'PEOPLE';
    //   animations.continue(false);
    // }
  });

  function initAnimations() {
    const getNextPart = {
      enterTop: () => currentPart,
      enterBottom: partName => partName,
      leaveTop: () => currentPart,
      leaveBottom: partName => parts[parts.indexOf(partName) - 1],
    };
    let isFirstTime = true;

    function watchPart(entries) {
      if (isFirstTime) {
        isFirstTime = false;
        return false;
      }
      entries.forEach(entry => {
        const part = entry.target.getAttribute('data-part');
        const status = getIOstatusVertical(entry);
        const newPart = getNextPart[status](part);
        console.log('intersecting:', part, 'from:', currentPart, 'to:', newPart);

        currentPart = newPart;
      });
    };

    const observer = new IntersectionObserver(watchPart, {
      rootMargin: '0px 0px -45% 0%',
      threshold: 0,
    });

    function start(shouldResetFirstTime) {
      if(shouldResetFirstTime) {
        isFirstTime = true;
      }

      observer.observe(elDots);
      observer.observe(elAsk);
      observer.observe(elWolf);
      observer.observe(elPeople);
    }

    function pause() {
      observer.disconnect();
      // window.removeEventListener('scroll', clipHandles[lastPart])
    }

    start();

    return {
      continue: start,
      pause,
    }
  }

  $: getBoxClass = partName => '';
</script>

<style>
  .container {
    @media(--md) {
      display: none; /* ValuesHorizon will replace it */
    }
  }

  .dabox,
  .pMorph {
    display: none;
  }

  .part {
    position: relative;
    padding: 25vw 0;
    --title-w: 100%;
    --text-w: 100%;
  }

  .pContent {
    position: relative;
    padding: var(--spacer-M) var(--l-margin);
    display: flex;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .title {
    font-size: var(--font-heading_2);
    width: var(--title-w);
    flex-shrink: 0;
    scroll-snap-align: center;

    &-part {
      display: block;
    }
  }

  .pBox {
    padding: var(--spacer-M) 10vw;
    margin-left: calc((100% - var(--title-w)) - 10vw + var(--spacer-M)); /* to show only the edge */
    width: 100vw;
    flex-shrink: 0;
    scroll-snap-align: center;

    &-text {
      display: block;
      margin: auto;
      width: var(--text-w);
      max-width: 40rem;
      background: var(--bg_1);
      padding: var(--spacer-L);
      font-size: var(--font-L);

      &-par:not(:last-child) {
        display: block;
        margin-bottom: var(--spacer-M);
      }

      :global(strong) {
        font-weight: 500;
      }
    }
  }

  .legend {
    $width: 150%;

    position: absolute;
    bottom: 0;
    left: 100vw;
    transform: translateX(calc(($width + var(--l-margin)) * -1));
    white-space: nowrap;
    font-size: var(--font-L);

    &::after {
      content: '';
      display: block;
      width: calc($width + var(--l-margin));
      height: 1px;
      background-color: var(--primary_1);
    }
  }


  .pDots {
    --title-w: 25rem;
  }

  .pAsk {
    --title-w: 35rem;
  }

  .pWolf {
    --title-w: 30rem;
  }

  .pAsk,
  .pWolf {
    .title {
      &-part:last-child {
        color: var(--primary_1);
      }

      &-br {
        display: none;
      }
    }
  }

  .pPeople {
    --title-w: 30rem;
  }
</style>

<section
  class="container"
  class:isOnStage
  style="{styleContainer} {currentPart === 'MORPH' ? '--scrollSpeed: 0;' : ''}"
  data-variant="vertical">

  <h2 class="sr-only">Values</h2>

  <div class="dabox"
    class:isActive={$strDabox.isActive}
    class:isMorphing
    style={daboxStyle} />
    <!-- class:isGelly={currentPart === 'ASK' } -->

  <!-- Not necessary on mobile, maybe a if mobile? -->
  <div class="part pMorph" style={morphStyle}>
    <Dots pattern='A' isActive={['MORPH', 'DOTS'].includes(currentPart)} />
  </div>

  <div class="part pDots">
    <!-- EDIT: removed isOnStage && and add 'MORPH' -->
    <Dots pattern='B' isActive={['MORPH', 'DOTS', 'ASK'].includes(currentPart)} />
    <div class="pContent"> <!-- NEW wrapper, add it to horizon -->
      <h3 class="f-mono title" data-part="DOTS" bind:this={elDots}>Let's connect the dots</h3>
      <span class="legend">swipe left</span> <!-- NEW add it to horizon -->
      <p class="pBox {getBoxClass('DOTS')}">
        <span class="pBox-text">
          {#each valuesData.DOTS.text as paragraph}
            <span class="pBox-text-par">
              {@html paragraph}
            </span>
          {/each}
        </span>
      </p>
    </div>
  </div>

  <div class="part pAsk">
    <Gelly isActive={ currentPart === 'ASK' }/>
    <div class="pContent">
      <h3 class="f-mono title" data-part="ASK" bind:this={elAsk} style={styleClip.ASK}>
        <span class="title-part">Ask why</span>
        <span class="title-part">Understand how</span>
      </h3>
      <span class="legend">swipe left</span>
      <p class="pBox {getBoxClass('ASK')}">
        <span class="pBox-text">
          {#each valuesData.ASK.text as paragraph}
            <span class="pBox-text-par">
              {@html paragraph}
            </span>
          {/each}
        </span>
      </p>
    </div>
  </div>

  <div class="part pWolf">
    <!-- NOTE: activelLevel logic changes based on layout variant -->
    <Echo
      activeLevel={
        currentPart === 'WOLF'
          ? isOnWolfMax ? 2 : 1
          : currentPart === 'PEOPLE'
            ? 3
            : currentPart === 'FINALLE' ? 4 : -1 } /> <!-- OPTIMIZE: Find a more readable way for this nes-nes-ted ternary -->
    <div class="pContent">
      <h3 class="f-mono title" data-part="WOLF" bind:this={elWolf} style={styleClip.WOLF}>
        <span class="title-part" aria-label="From a lone wolf to a team player">
          From a
          <br />
          lone wolf
        </span>
        <span class="title-part">
          to a
          <br class="title-br" />
          team player
        </span>
      </h3>
      <span class="legend">swipe left</span>
      <p class="pBox {getBoxClass('WOLF')}">
        <span class="pBox-text">
          {#each valuesData.WOLF.text as paragraph}
            <span class="pBox-text-par">
              {@html paragraph}
            </span>
          {/each}
        </span>
      </p>
    </div>
  </div>

  <div class="part pPeople" id="nav_valuesEnd">
    <div class="pContent">
      <h3 class="f-mono title" data-part="PEOPLE" bind:this={elPeople} style={styleClip.PEOPLE}>
        <span class="title-part">Progress over</span> <span class="title-part">processes</span>
      </h3>
      <span class="legend">swipe left</span>
      <p class="pBox {getBoxClass('PEOPLE')}">
        <span class="pBox-text">
          {#each valuesData.PEOPLE.text as paragraph}
            <span class="pBox-text-par">
              {@html paragraph}
            </span>
          {/each}
        </span>
      </p>
    </div>
  </div>
</section>

<!--
  TODO:: 
  - [ ] Pixel Perfect Animations (some parallax? Maybe if not too heavy).
  - Merge "Values" variants markup.
  
  OPTIMIZE/TODO::
  - Looks like I completely ignored SUIT/BEM conventions ._. -->
<!-- diffs so far: + pContent + .legend -->