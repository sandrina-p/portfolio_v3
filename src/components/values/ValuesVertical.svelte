<script>
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import { getInLimit, getIOstatusVertical } from '../../utils';
  import { updateCircle, strCircle } from '../../stores/circle.js';
  import { _window } from '../../stores/responsive.js';
  import { strGeneral, afterGeneralUpdate } from '../../stores/general.js';
  import valuesData from '../../data/values.js';
  import Dots from './Dots.svelte';
  import Gelly from './Gelly.svelte';
  import Echo from './Echo.svelte';

  const parts = ['MORPH', 'DOTS', 'ASK', 'WOLF', 'PEOPLE', 'FINALLE'];
  $:isOnStage = $strGeneral.isReady && $strGeneral.pageCurrentSection === 'intro';
  
  let isMount = false;
  let currentPart = 'MORPH';
  let elDots;
  let elAsk;
  let elWolf;
  let elPeople;
  let animations;

  const styleContainer = Object.keys(valuesData).reduce(
    (styles, part) =>
      (styles += `--width-${part}: ${valuesData[part].width}; --height-${part}: ${valuesData[part].height};`),
    ''
  );

  onMount(() => {
    isMount = true;
    animations = initAnimations();
  });

  onDestroy(() => {
    isMount = false;
  })

  afterUpdate(() => {
    verifyCirclePauseStatus();
  })

  afterGeneralUpdate((prevState, state) => {
    if (!isMount) { return }
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

  function verifyCirclePauseStatus() {
    const isPaused = $strCircle.isPaused;
    const includesParts = ['MORPH', 'DOTS'].includes(currentPart);

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

  function focusBox(elPart) {
    // Browser is smart enough to scroll horizontally to the element being focus.
    // Update: Safari is not!...
    // elPart.parentElement.getElementsByClassName('pBox')[0].focus()

    // ...so let's go with option 2:
    elPart.scroll({ left: $_window.innerWidth, behavior: 'smooth' })
  }
</script>

<style>
  .container {
    padding-top: 25vw;
    padding-bottom: $spacer-XL;

    /* ValuesHorizon will replace this */
    @media(--lg) { display: none; }
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

    &-part,
    &-line {
      display: block;
    }
  }

  .pBox {
    padding: $layout-margin;
    margin-left: calc((100% - var(--title-w, 100%)) - $layout-margin); /* to show only the edge */
    width: 100vw;
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
    $width: (100% + $layout-margin*2);

    position: absolute;
    bottom: 0;
    left: 100vw;
    transform: translateX(calc($width * -1));
    white-space: nowrap;
    font-size: $font-M;
    color: var(--text_1);

    &::after {
      content: '';
      display: block;
      width: calc($width);
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
      &-part {
        &:last-child {
          color: var(--primary_1);
        }
      }
    }
  }

  .pPeople {
    --title-w: 30rem;
  }

  @media (--md) {
    .container {
      padding-top: $spacer-XL;
    }

    .part {
      position: relative;
      padding: $spacer-XL 0;
    }

    .pBox {
      width: 50vw;
      margin-left: calc(50vw - var(--title-w, 100%) - $layout-margin - 1px);  /* 1px - remove 1px scroll on safari ipad */
    }

    .legend {
      display: none;
    }
  }
</style>

<!-- OPTIMIZE - Markup is very similar to ValuesHorizontal. Maybe merge both? -->
<section
  class="container"
  class:isOnStage
  style={styleContainer}
  data-variant="vertical">

  <h2 class="sr-only">Values</h2>

  <div class="part pDots">
    <Dots pattern='B' isActive={['MORPH', 'DOTS', 'ASK'].includes(currentPart)} />
    <div class="pContent" data-part="DOTS" bind:this={elDots}>
      <h3 class="f-title title">Let's connect the dots</h3>
      <span class="legend" aria-hidden="true" on:click={() => focusBox(elDots)}>Know more</span>
      <p class="pBox">
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
    <div class="pContent" data-part="ASK" bind:this={elAsk}>
      <h3 class="f-title title">
        <span class="title-part">Ask why</span>
        <span class="title-part">Understand how</span>
      </h3>
      <span class="legend" aria-hidden="true" on:click={() => focusBox(elAsk)}>Know more</span>
      <p class="pBox">
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
    <!-- OPTIMIZE: Find a more readable way for this nes-nes-ted ternary -->
    <Echo
      activeLevel={
        currentPart === 'WOLF' ? 2
          : currentPart === 'PEOPLE'
            ? 3
            : currentPart === 'FINALLE' ? 4 : -1 } />
    <div class="pContent" data-part="WOLF" bind:this={elWolf} >
      <h3 class="f-title title">
        <span class="title-part">
          <span class="title-line">From a</span>
          <span class="title-line">solo act</span>
        </span>
        <span class="title-part">
          <span class="title-line">to a</span>
          <span class="title-line">team player</span>
        </span>
      </h3>
      <span class="legend" aria-hidden="true" on:click={() => focusBox(elWolf)}>Know more</span>
      <p class="pBox">
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
    <div class="pContent" data-part="PEOPLE" bind:this={elPeople}>
      <h3 class="f-title title">
        <span class="title-part">Progress over</span> <span class="title-part">processes</span>
      </h3>
      <span class="legend" aria-hidden="true" on:click={() => focusBox(elPeople)}>Know more</span>
      <p class="pBox">
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