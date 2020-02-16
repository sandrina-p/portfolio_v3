<script>
  import { onMount, afterUpdate, onDestroy } from 'svelte';
  import { getInLimit, getIOstatusVertical } from '../../utils';
  import { _window, afterResponsiveUpdate } from '../../stores/responsive.js';
  import { strDabox, updateDabox } from '../../stores/dabox.js';
  import { updateCircle, strCircle } from '../../stores/circle.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../../stores/general.js';
  import Dots from './Dots.svelte';
  import Gelly from './Gelly.svelte';
  import Echo from './Echo.svelte';
  import valuesData from '../../data/values.js';

  const parts = ['MORPH', 'DOTS', 'ASK', 'WOLF', 'PEOPLE', 'FINALLE'];
  $:isOnStage = $strGeneral.isReady && $strGeneral.pageCurrentSection === 'intro';
  
  let currentPart = 'MORPH';
  let elDots;
  let elAsk;
  let elWolf;
  let elPeople;
  let animations;

  let isMount = false;
  let scrollY = 0;

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
    isMount = false;
    animations && animations.pause();
  })

  afterUpdate(() => {
    verifyCirclePauseStatus({ checkCurrent: true });
  })

  afterGeneralUpdate((prevState, state) => {
    if (!isMount) { return false };
    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    if (prevPageSection === pageSection) {
      return false;
    }

    // Pause animations in case user scrolled beyond intro
    if (pageSection !== 'intro') {
      if (currentPart !== 'FINALLE') {
        currentPart = 'FINALLE';
        animations.pause();
      }
      return;
    }
    
    if(window.scrollY === 0) { // a.k.a triggered by navigation link
      currentPart = 'MORPH';
      animations.continue(true);
    } else {
      currentPart = 'PEOPLE';
      animations.continue(false);
    }
  });

  // Need this if I address [*CODE_SHAME*]
  // afterResponsiveUpdate((prevState, state) => {
  //   if(prevState.matchMq.md !== state.matchMq.md) {
  //    verifyCirclePauseStatus({ checkCurrent: false });
  //   }
  // })

  function verifyCirclePauseStatus(checkCurrent) {
    const isPaused = $strCircle.isPaused;
    const includesParts = ['MORPH', 'DOTS'].includes(currentPart);

    if(!checkCurrent) {
      updateCircle({ isPaused: !includesParts })
      return
    }

    if (!isPaused && !includesParts) {
      updateCircle({ isPaused: true })
    } else if (isPaused && includesParts) {
      updateCircle({ isPaused: false })
    }
  }

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
    padding-top: 25vw;
    padding-bottom: $spacer-XL;

    /* ValuesHorizon will replace it */
    @media(--md) { display: none; }
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
    padding: $spacer-M $layout-margin;
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
    font-size: calc($font-heading_2 * 0.8);
    width: var(--title-w, 100%);
    flex-shrink: 0;
    scroll-snap-align: center;

    &-part {
      display: block;
    }
  }

  .pBox {
    padding: $layout-margin;
    margin-left: calc((100% - var(--title-w, 100%)) - $layout-margin); /* to show only the edge */
    width: 99vw; /* not 100vw, so the title is still on the viewport (by 1vw).
                    Enough to prevent IO from triggering to the next part. */
    flex-shrink: 0;
    scroll-snap-align: center;

    &-text {
      display: block;
      margin: auto;
      width: var(--text-w, 100%);
      max-width: 40rem;
      background: var(--bg_1);
      padding: $spacer-L;
      border-radius: 0.3rem;
      box-shadow: 0.2rem 0.2rem var(--primary_1_smooth);

      &-par:not(:last-child) {
        display: block;
        margin-bottom: $spacer-M;
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
    transform: translateX(calc(($width + $layout-margin) * -1));
    white-space: nowrap;
    font-size: $font-M;
    color: var(--text_1);

    &::after {
      content: '';
      display: block;
      width: calc($width + $layout-margin);
      height: 1px;
      background-color: var(--primary_1);
    }
  }


  .pDots {
    --title-w: 25rem;
  }

  .pAsk {
    --title-w: 28rem;
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

      &-line {
        display: block;
      }
    }
  }

  .pPeople {
    --title-w: 30rem;
  }
</style>

<!-- OPTIMIZE - Merge this with ValuesHorizontal -->
<section
  class="container"
  class:isOnStage
  style="{styleContainer} {currentPart === 'MORPH' ? '--scrollSpeed: 0;' : ''}"
  data-variant="vertical">

  <h2 class="sr-only">Values</h2>

  <div class="dabox"
    class:isActive={$strDabox.isActive} />
    <!--
    class:isMorphing
    style={daboxStyle} /> -->
    <!-- class:isGelly={currentPart === 'ASK' } -->

  <!-- Not necessary on mobile, maybe a if mobile? -->
  <!-- <div class="part pMorph" style={morphStyle}>
    <Dots pattern='A' isActive={['MORPH', 'DOTS'].includes(currentPart)} />
  </div> -->

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
     <!-- OPTIMIZE: Find a more readable way for this nes-nes-ted ternary -->
    <Echo
      activeLevel={
        currentPart === 'WOLF' ? 2
          : currentPart === 'PEOPLE'
            ? 3
            : currentPart === 'FINALLE' ? 4 : -1 } />
    <div class="pContent">
      <h3 class="f-mono title" data-part="WOLF" bind:this={elWolf} style={styleClip.WOLF}>
        <span class="title-part">
          <span class="title-line">From a</span>
          <span class="title-line">solo act</span>
        </span>
        <span class="title-part">
          <span class="title-line">to a</span>
          <span class="title-line">team player</span>
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