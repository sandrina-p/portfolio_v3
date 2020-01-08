<script>
  import { onMount, afterUpdate } from 'svelte';
  import { getInLimit, getIOstatusHorizontal } from '../utils';
  import { _window, afterResponsiveUpdate } from '../stores/responsive.js';
  import { strDabox, updateDabox } from '../stores/dabox.js';
  import { updateCircle } from '../stores/circle.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import Dots from './animations/Dots.svelte';
  import Gelly from './animations/Gelly.svelte';
  import Echo from './animations/Echo.svelte';
  import valuesData from '../data/values.js';

  const parts = ['MORPH', 'DOTS', 'ASK', 'WOLF', 'PEOPLE', 'FINALLE'];
  let onStage = true;
  let currentPart = 'MORPH';
  let elDots;
  let elAsk;
  let elWolf;
  let elPeople;
  let animations;

  let isMount = false; /* wait for Intro animations */
  let scrollY = 0;

  // ::: Morphose - a circle to a square (dabox)
  // REVIEW - Maybe this shouldn't be here it's only logic and between Intro and Values
  const size = 200; // OPTMIZE - get real CSS Variables form circle
  const scaleStart = 0.8;
  $: distance = isMount && $_window.innerWidth / 2 - size * 1.5;

  const morphCircleRatio = 2; // circle progression based on scroll. (ex: it needs to scroll 25px to change 10px)
  const morphBoxRatio = 150; // nr of scrolled pixels needed to change border-radius from circle to square
  let isMorphing = true;

  $: offLimit = isMount && $_window.innerWidth / 2 + distance * morphCircleRatio + morphBoxRatio;
  $: morphStyle = isMount && `width: ${(offLimit + size / 2)}px`; // REFINE this value... should match the begin of sDots

  $: daboxStyle =
    ($strDabox.progress
      ? `--radius: ${50 - $strDabox.progress * 50}%;` +
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
    isMount = true;
    window.addEventListener('scroll', verifyMetamorphose, { passive: true });

    animations = initAnimations();
  });

  afterGeneralUpdate((prevState, state) => {
    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    if (prevPageSection === pageSection) {
      return false;
    }

    if (pageSection !== 'intro') {
      if(currentPart !== 'FINALLE') {
        currentPart = 'FINALLE';
        animations.pause();
      }
      return;
    }
    
    if(window.scrollY === 0) { // It means it was triggered by navigation link
      currentPart = 'MORPH';
      verifyMetamorphose();
      animations.continue(true);
    } else {
      currentPart = 'PEOPLE';
      animations.continue(false);
    }
  });

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

    const daboxProgress = getInLimit(morphProgress, 0, 1);
    const offsetY = getInLimit(scrollY, 0, offLimit);
    const newDistance = getInLimit(progress, 0, distance);
    const scaleStartAdjusted = scaleStart + (0.2 - (newDistance * 0.2) / distance);

    isMorphing = true;

    updateCircle({
      style:
        `--scrollY: ${offsetY}px;` +
        `--distance: ${newDistance}px;` +
        `--scaleStart: ${scaleStartAdjusted};`,
      isPaused: newDistance === 0,
    });
    updateDabox({
      isActive: newDistance === 0,
      progress: daboxProgress,
    });
  }

  function initAnimations() {
    const headingsToClip = ['ASK', 'WOLF', 'PEOPLE'];
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
      const needsToScroll = $_window.innerWidth / 2;
      const awayFromMiddle = window.scrollY - scrollPivot - needsToScroll;

      styleClip[part] = `--clipx: ${getInLimit(awayFromMiddle, 0, clipLimit)}px;`;
    }

    function verifyClippingStatus(part, status, entry) {
      if (['enterLeft', 'enterRight'].includes(status)) {
        clipArgs[part] = {
          part: part,
          entry,
          scrollPivot:
            status === 'enterRight'
              ? window.scrollY
              : window.scrollY - entry.rootBounds.width - entry.boundingClientRect.width,
        };
        window.addEventListener('scroll', clipHandles[part]);
      } else {
        window.removeEventListener('scroll', clipHandles[part]);
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
      rootMargin: '0px',
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
      console.log('hum', lastPart)
      window.removeEventListener('scroll', clipHandles[lastPart])
    }

    start();

    return {
      continue: start,
      pause,
    }
  }

  $: getBoxClass = partName => {
    const isActive = partName === currentPart ? 'isActive' : '';
    const isGone = parts.indexOf(partName) < parts.indexOf(currentPart) ? 'isGone' : '';

    return `${isActive} ${isGone}`;
  };
</script>

<style>
  .container {
    display: flex;
    align-items: center;
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
    transition: width 400ms ease-in-out, height 400ms ease-in-out;
    z-index: 1;

    &.isMorphing {
      border: 2px solid var(--bg_1);
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
      transition: transform 300ms;
      will-change: transform;
      background: var(--bg_1);
      transform: skew(calc(var(--scrollSpeed) * -0.2deg), 0deg);
    }

    &::after {
      background: var(--morph_total);
      opacity: var(--opacity);
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
    font-size: var(--font-heading_2);
    margin-right: 75vw; /* white space is everything */
  }

  .sBox {
    position: fixed;
    top: 50vh;
    left: 50vw;
    transform: translate(calc(var(--scrollY) - 50%), -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--text-L);
    line-height: 1.5;
    z-index: 1;
    /* outline: 1px dashed #aaa; */
    opacity: 0;
    pointer-events: none;
    transition: opacity 150ms 0ms ease-out;
    padding: var(--spacer-XL);

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

      &-par:not(:last-child) {
        display: block;
        margin-bottom: var(--spacer-M);
      }

      :global(strong) {
        /* Svelte BUG  - 📝 this exists, but it's dynamic. Use global to persist */
        font-weight: 500;
      }
    }
  }

  .sMorph {
    min-width: auto;
  }

  .sDots {
    .sBox {
      width: var(--width-DOTS);
      height: var(--height-DOTS);
    }
  }

  .sAsk {
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
          clip-path: polygon(0 0, var(--clipx) 0, var(--clipx) 150%, 0 150%);
          margin-top: -1em;
          color: var(--primary_1);
        }
      }
    }

    .sBox {
      width: var(--width-ASK);
      height: var(--height-ASK);
    }
  }

  .sWolf {
    .title {
      height: var(--height-WOLF);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      line-height: 1;
      display: flex;
      flex-direction: column;

      &-part {
        display: block;

        &:first-child {
          clip-path: polygon(var(--clipx) 0, 100% 0, 100% 150%, var(--clipx) 150%);
        }

        &:last-child {
          clip-path: polygon(0 0, var(--clipx) 0, var(--clipx) 150%, 0 150%);
          color: var(--primary_1);
          margin-bottom: 0.2em; /* so it gets totally covered by the white box */
        }
      }
    }

    .sBox {
      width: var(--width-WOLF);
      height: var(--height-WOLF);
    }
  }

  .sPeople {
    min-width: auto;

    .title {
      margin-right: 0; /* so Words can come right away */

      &-part {
        position: relative;
        display: block;
        color: var(--primary_1);

        &:first-child {
          z-index: 2; /* to be above dabox */
        }

        &:last-child {
          clip-path: polygon(0 0, var(--clipx) 0, var(--clipx) 100%, 0 100%);
          color: var(--text_1);
        }
      }
    }

    .sBox {
      width: var(--width-PEOPLE);
      height: var(--height-PEOPLE);
    }
  }
</style>

<section
  class="container"
  style="{styleContainer}
  {currentPart === 'MORPH' ? '--scrollSpeed: 0;' : ''}">

  <h2 class="sr-only">Values</h2>

  <div class="dabox" class:isActive={$strDabox.isActive} class:isMorphing style={daboxStyle} />

  <div class="part sMorph" style={morphStyle}>
    <Dots pattern='A' />
  </div>

  <div class="part sDots">
    <Dots pattern='B' />
    <h3 class="f-mono title" data-part="DOTS" bind:this={elDots}>Let's connect the dots</h3>
    <p class="sBox {getBoxClass('DOTS')}">
      <span class="sBox-text">
        {#each valuesData.DOTS.text as paragraph}
          <span class="sBox-text-par">
            {@html paragraph}
          </span>
        {/each}
      </span>
    </p>
  </div>

  <div class="part sAsk">
    <Gelly />
    <h3 class="f-mono title" data-part="ASK" bind:this={elAsk} style={styleClip.ASK}>
      <span class="title-part">Ask why</span>
      <span class="title-part">Understand how</span>
    </h3>
    <p class="sBox {getBoxClass('ASK')}">
      <span class="sBox-text">
        {#each valuesData.ASK.text as paragraph}
          <span class="sBox-text-par">
            {@html paragraph}
          </span>
        {/each}
      </span>
    </p>
  </div>

  <div class="part sWolf">
    <Echo />
    <h3 class="f-mono title" data-part="WOLF" bind:this={elWolf} style={styleClip.WOLF}>
      <span class="title-part">
        From a
        <br />
        lone wolf
      </span>
      <span class="title-part">
        to a
        <br />
        team player
      </span>
    </h3>
    <p class="sBox {getBoxClass('WOLF')}">
      <span class="sBox-text">
        {#each valuesData.WOLF.text as paragraph}
          <span class="sBox-text-par">
            {@html paragraph}
          </span>
        {/each}
      </span>
    </p>
  </div>

  <div class="part sPeople" data-section="valuesEnd">
    <h3 class="f-mono title" data-part="PEOPLE" bind:this={elPeople} style={styleClip.PEOPLE}>
      <span class="title-part">People come</span>
      <span class="title-part">before code</span>
    </h3>
    <p class="sBox {getBoxClass('PEOPLE')}">
      <span class="sBox-text">
        {#each valuesData.PEOPLE.text as paragraph}
          <span class="sBox-text-par">
            {@html paragraph}
          </span>
        {/each}
      </span>
    </p>
  </div>
</section>
