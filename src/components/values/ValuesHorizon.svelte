<script>
  import { onMount, afterUpdate, onDestroy } from 'svelte';
  import { getInLimit, getIOstatusHorizontal, scrollIntoView } from '../../utils';
  import { _window, afterResponsiveUpdate } from '../../stores/responsive.js';
  import { strDabox, updateDabox } from '../../stores/dabox.js';
  import { updateCircle } from '../../stores/circle.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../../stores/general.js';
  import Dots from './Dots.svelte';
  import Gelly from './Gelly.svelte';
  import Echo from './Echo.svelte';
  import valuesData from '../../data/values.js';
  import debounce from 'lodash/debounce';

  const parts = ['MORPH', 'DOTS', 'ASK', 'WOLF', 'PEOPLE', 'FINALLE'];
  $:isOnStage = $strGeneral.isReady && $strGeneral.pageCurrentSection === 'intro';
  
  let currentPart = 'MORPH';
  let elDots;
  let elAsk;
  let elWolf;
  let elPeople;
  let animations;
  let isOnWolfMax = false; // OPTMIZE this...
  let scrollY = 0;

  // ::: Morphose - a circle to a square (dabox)
  // REVIEW - Maybe this shouldn't be here it's only logic and between Intro and Values
  const size = 200; // OPTMIZE - get real CSS Variables from circle
  const distance = 300;
  const scaleStart = 0.8;
  $: wInnerWidthHalf = $_window && $_window.innerWidth / 2;
  $: clipCenter = wInnerWidthHalf * 0.9; // subtract 5% of IO.

  const morphCircleRatio = 2; // circle progression based on scroll. (it needs to scroll 20px to change 10px)
  const morphBoxRatio = 200; // nr of scrolled pixels needed to change border-radius from circle to square
  let isMorphing = true;

  $: offLimit = $_window && wInnerWidthHalf + (distance * morphCircleRatio) + morphBoxRatio;
  $: morphZone = distance && wInnerWidthHalf + distance + size; // size serves as a "gap" to avoid a direct morph from primary to bg when scrolling quickly though it. 
  $: morphStyle = morphZone && `width: ${morphZone}px`;

  $: daboxStyle =
    ($strDabox.progress
      ? `--radius: ${currentPart === 'MORPH' ? 50 - $strDabox.progress * 50 + '%' : '3px'};` +
        `--opacity: ${1 - $strDabox.progress};`
      : '') +
    `--width: var(--width-${currentPart});` +
    `--height: var(--height-${currentPart});`;

  const styleContainer = Object.keys(valuesData).reduce(
    (styles, part) =>
      (styles += `--width-${part}: ${valuesData[part].width}; --height-${part}: ${valuesData[part].height};`),
    ''
  );

  let styleClip = {}; // a list of clipping for each part

  onMount(() => {
    const sanityCheckDebounced = debounce(sanityCheck, 500);

    window.addEventListener('scroll', verifyMetamorphose, { passive: true });
    window.addEventListener('scroll', sanityCheckDebounced, { passive: true });
    animations = initAnimations();
  });

  afterGeneralUpdate((prevState, state) => {
    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    if (prevPageSection === pageSection) {
      return false;
    }

    // Pause animations in case user scrolled beyond intro
    if (pageSection !== 'intro') {
      if(currentPart !== 'FINALLE') {
        currentPart = 'FINALLE';
        animations.pause();
      }
      return;
    }
    
    if(window.scrollY === 0) { // a.k.a triggered by navigation link
      currentPart = 'MORPH';
      verifyMetamorphose();
      animations.continue(true);
    } else {
      currentPart = 'PEOPLE';
      animations.continue(false);
    }
  });

  function sanityCheck() {
    // When people scroll too fast back to the top of the page (specially Safari),
    // the last scroll point might not be totally correct causing currentPart
    // to have an incorrect values -most of the times "DOTS" part.
    // So, we need to double check that one last time after a few ms:
    console.debug('ValuesHorizon: currentPart sanity check');
    if(currentPart !== 'MORPH' && window.scrollY === 0) {
      console.debug('Triggered!');
      currentPart = 'MORPH';
    }
  }

  function verifyMetamorphose() {
    // Metamorphose the initial circle into a square (dabox)
    // 🐻 with me, it's going to be a fun ride!
    // -  P.S. me doing this part: https://i.imgur.com/3uyRWGJ.jpg

    scrollY = window.scrollY;
    const progress = distance - scrollY / morphCircleRatio;
    const morphProgress = (progress * -1) / morphBoxRatio;

    if (morphProgress > 1 && $strDabox.progress === 1) {
      // metamorphose is completed, there's no point in calculating more stuff....
      isMorphing = false;
      return false;
    }

    const newDistance = getInLimit(progress, 0, distance);
    const isCirclePaused = newDistance === 0;
    const daboxProgress = getInLimit(morphProgress, 0, 1);
    const offsetY = getInLimit(scrollY, 0, morphZone);
    const scaleStartDynamic = scaleStart + (0.2 - (newDistance * 0.2) / distance);
    
    isMorphing = true;

    updateCircle({
      isPaused: isCirclePaused,
      ...(isCirclePaused ? {} : {
          style:
            `--scrollY: ${offsetY}px;` +
            `--distance: ${newDistance}px;` +
            `--scaleStart: ${scaleStartDynamic};`
        }
      )
    });
    updateDabox({
      isActive: isCirclePaused,
      progress: daboxProgress,
    });
  }

  function initAnimations() {
    const headingsToClip = ['ASK', 'WOLF'];
    const clipArgs = {}; // A list of args to be passed to handles, based on the part
    const clipHandles = headingsToClip.reduce(
      (handles, part) => ({
        ...handles,
        [part]: () => handleClipping(clipArgs[part]),
      }),
      {}
    );
    const getNextPart = {
      enterLeft: partName => partName,
      enterRight: partName => partName,
      leaveLeft: partName => parts[parts.indexOf(partName) + 1],
      leaveRight: partName => parts[parts.indexOf(partName) - 1],
    };
    // Prevent initial IO callback to take effect,
    // so it doesnt show any incorrect dabox text
    // - https://stackoverflow.com/a/47855484/4737729
    let isFirstTime = true;

    function handleClipping({ part, entry, scrollPivot }) {
      console.log('clipping', part, '...');
      const clipLimit = entry.boundingClientRect.width + 1; // just for pixel-sanity-check
      const awayFromMiddle = window.scrollY - scrollPivot - clipCenter;

      if(part === 'WOLF') {
        // once it passes the middle, it will stay true until the end.
        isOnWolfMax = isOnWolfMax || awayFromMiddle > 0;
      } else {
        isOnWolfMax = false;
      }

      styleClip[part] = `--clipx: ${getInLimit(awayFromMiddle, 0, clipLimit)}px;`;
    }

    function verifyClippingStatus(part, status, entry) {
      window.removeEventListener('scroll', clipHandles[part]);

      if (['enterLeft', 'enterRight'].includes(status)) {
        clipArgs[part] = {
          part: part,
          entry,
          scrollPivot:
            status === 'enterRight'
              ? window.scrollY - (entry.rootBounds.width - entry.boundingClientRect.x)
              : window.scrollY - entry.rootBounds.width - entry.boundingClientRect.width,
        };
        clipHandles[part](); // call immediately in case it was reached by keyboard focus.
        window.addEventListener('scroll', clipHandles[part]);
      }
    }

    function watchPart(entries) {
      if (isFirstTime) {
        isFirstTime = false;
        return false;
      }
      entries.forEach(entry => {
        const part = entry.target.getAttribute('data-part');
        const status = getIOstatusHorizontal(entry);
        const newPart = getNextPart[status](part);
        console.log('intersecting from:', part, 'to:', newPart);

        currentPart = newPart;
        if (headingsToClip.includes(part)) {
          verifyClippingStatus(part, status, entry);
        }
      });
    };

    const observer = new IntersectionObserver(watchPart, {
      rootMargin: '0px -5% 0px 0px',
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
      const lastPart = headingsToClip[headingsToClip.length - 1];
      for(let handle in clipHandles) {
        window.removeEventListener('scroll', clipHandles[handle])
      }
    }

    start();

    return {
      continue: start,
      pause,
    }
  }

  function handleKeyboardFocus(e) {
    scrollIntoView(e, {
      direction: 'left',
      value: $_window.innerWidth * 0.7
    })
  }

  $: getBoxClass = partName => {
    const isActive = partName === currentPart ? 'isActive' : '';
    const isGone = parts.indexOf(partName) < parts.indexOf(currentPart) ? 'isGone' : '';
    return `${isActive} ${isGone}`;
  };
</script>

<style>
  @define-mixin motionDefault { :global(.jsMotionDefault) & { @mixin-content; } }
  @define-mixin motionReduced { :global(.jsMotionReduced) & { @mixin-content; } }

  .container {
    display: flex;
    align-items: center;

    @media(--max-md) {
      display: none; /* ValuesVertical will replace this */
    }
  }

  .dabox {
    position: fixed;
    top: 50vh;
    left: 50vw;
    width: var(--width, 1rem);
    height: var(--height, 1rem);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    border-radius: var(--radius, 50%);
    transform: translate(calc(var(--scrollY) - 50%), -50%);
    /* TODO - speed up this when going to FINALLE */
    /* REVIEW - How could motionReduced behave here? */
    transition:
      width 400ms ease-in-out,
      height 400ms ease-in-out,
      visibility 0ms 400ms; /* time for any leaving animation */
    will-change: width, height; /* I'm sorry */
    z-index: 1;

    visibility: hidden; /* reduce GPU */

    .isOnStage & {
      visibility: visible;
      transition:
        width 400ms ease-in-out,
        height 400ms ease-in-out,
        visibility 0ms 0ms;
    }

    &.isMorphing {
      transition: width 50ms ease-out, height 50ms ease-out; /* reduce color glitch when scrolling backward too fast */
      border: 0.2rem solid var(--bg_1);
    }

    &.isActive {
      opacity: 1;
    }

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: var(--radius, 50%);
    }

    &::before {
      background-color: var(--bg_1);
      /* NOTE: in case I want to add skew effect again */
      /* transition: transform 300ms;
      transform: skew(calc(var(--scrollSpeed) * -0.1deg)); */
    }

    &::after {
      background-color: var(--morph_total);
      opacity: var(--opacity);
    }
  }

  /* Prevent "grow" animation when changing between section values and words */
  :not(.isOnStage) {
    @mixin motionReduced {
      .dabox {
        width: var(--width-PEOPLE);
        height: var(--height-PEOPLE);
      }
    }
  }

  .part {
    position: relative;
    min-width: 100vw;
    height: 100vh;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .title {
    font-size: $font-heading_2;
    margin-right: 75vw; /* white space is everything */

    &-line {
      display: block;
    }
  }

  .pBox {
    position: fixed;
    top: 50vh;
    left: 50vw;
    transform: translate(calc(var(--scrollY) - 50%), -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: $spacer-XL;
    z-index: 1;
    pointer-events: none;
    opacity: 0;

    :global(.jsGoOn) & {
      /* TIL [1] only apply opacity on client side, to avoid transition (1 to 0) on first render */
      transition: opacity 150ms 0ms ease-out;
    }

    &.isActive {
      opacity: 1;
      transition: opacity 600ms 350ms cubic-bezier(0.19, 1, 0.22, 1);
      pointer-events: auto;
    }

    &-text {
      display: block;
      transform: translateY(2rem);
      transition: transform 150ms 0ms ease-out;

      .isActive & {
        transition: transform 600ms 350ms cubic-bezier(0.19, 1, 0.22, 1);
        transform: translateY(0);
      }

      .isGone & {
        transition: transform 150ms 0ms ease-out;
        transform: translateY(-2rem);
      }

      @mixin motionReduced {
        transition: none;
        transform: translateY(0);
      }

      &-par:not(:last-child) {
        display: block;
        margin-bottom: $spacer-M;
      }

      :global(strong) {
        /* Svelte BUG  - 📝 this exists, but it's dynamic. Use global to persist */
        font-weight: 500;
      }
    }
  }

  .pMorph {
    min-width: auto;
  }

  .pDots {
    .pBox {
      width: var(--width-DOTS);
      height: var(--height-DOTS);
    }
  }

  .pAsk {
    .title {
      position: relative;
      line-height: 1;
      display: flex;
      flex-direction: column;

      &-part {
        display: block;

        &:first-child {
          /* NOTE: 150% is a safe value to avoid cutted char that pass the baseline
            (ex: in "you" the "y" would get cut on the bottom) */
          clip-path: polygon(var(--clipx) 0, 100% 0, 100% 150%, var(--clipx) 150%);
        }

        &:last-child {
          clip-path: polygon(0 0, var(--clipx, 0) 0, var(--clipx, 0) 150%, 0 150%);
          margin-top: -1em;
          color: var(--primary_1);
        }
      }
    }

    .pBox {
      width: var(--width-ASK);
      height: var(--height-ASK);
    }
  }

  .pWolf {
    .title {
      height: var(--height-WOLF);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      line-height: 1;

      &-part {
        display: block;

        &:first-child {
          clip-path: polygon(var(--clipx) 0, 100% 0, 100% 150%, var(--clipx) 150%);
        }

        &:last-child {
          clip-path: polygon(0 0, var(--clipx, 0) 0, var(--clipx, 0) 150%, 0 150%);
          color: var(--primary_1);
          margin-bottom: 0.2em; /* so it gets totally covered by the white box */
        }
      }
    }

    .pBox {
      width: var(--width-WOLF);
      height: var(--height-WOLF);
    }
  }

  .pPeople {
    min-width: auto;

    .title {
      margin-right: 0; /* so Words come right away */
      margin-top: -17rem; 

      &-part {
        &:first-child {
          position: relative;
          z-index: 2; /* to be above dabox */
        }
      }
    }

    .pBox {
      width: var(--width-PEOPLE);
      height: var(--height-PEOPLE);
    }
  }
</style>

<!--
  TODO - Merge "Values" variants, so both consume the same HTML. Svelte doesn't make it easy because of classes.
  
  OPTIMIZE/TODO::
  - Looks like I completely ignored SUIT/BEM conventions ._. -->
<!-- diffs with ValuesVertical: + pContent + .legend -->

<section
  class="container"
  class:isOnStage
  style="{styleContainer} {currentPart === 'MORPH' ? '--scrollSpeed: 0;' : ''}"
  data-variant="horizon">

  <h2 class="sr-only">Values</h2>

  <div class="dabox"
    class:isActive={$strDabox.isActive}
    class:isMorphing
    style={daboxStyle} />
    <!-- class:isGelly={currentPart === 'ASK' } -->

  <div class="part pMorph" style={morphStyle}>
    <Dots pattern='A' isActive={isOnStage && ['MORPH', 'DOTS'].includes(currentPart)} />
  </div>

  <div class="part pDots">
    <Dots pattern='B' isActive={isOnStage && ['DOTS', 'ASK'].includes(currentPart)} />
    <h3 class="f-mono title" data-part="DOTS" bind:this={elDots}>Let's connect the dots</h3>
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

  <div class="part pAsk" on:focusin={ handleKeyboardFocus }>
    <Gelly isActive={ currentPart === 'ASK' }/>
    <h3 class="f-mono title" data-part="ASK" bind:this={elAsk} style={styleClip.ASK}>
      <span class="title-part">Ask why</span>
      <span class="title-part">Understand how</span>
    </h3>
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

  <div class="part pWolf" on:focusin={ handleKeyboardFocus }>
    <Echo
      activeLevel={
        currentPart === 'WOLF'
          ? isOnWolfMax ? 2 : 1
          : currentPart === 'PEOPLE'
            ? 3
            : currentPart === 'FINALLE' ? 4 : -1 } /> <!-- OPTIMIZE: Find a more readable way for this nes-nes-ted ternary -->
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

  <div class="part pPeople" id="nav_valuesEnd">
    <h3 class="f-mono title" data-part="PEOPLE" bind:this={elPeople} style={styleClip.PEOPLE}>
      <span class="title-part">Progress over</span> <span class="title-part">processes</span>
    </h3>
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
</section>
