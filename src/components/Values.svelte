<script>
  import { onMount, afterUpdate } from 'svelte';
  import { getInLimit, getIOstatus } from '../utils';
  import { _window, afterResponsiveUpdate } from '../stores/responsive.js';
  import { strDabox, updateDabox } from '../stores/dabox.js';
  import { updateCircle } from '../stores/circle.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';

  // TODO - rename sections to "part" to avoid naming confusition with general.pageSection.
  const sections = ['MORPH', 'DOTS', 'ASK', 'WOLF', 'PEOPLE', 'FINALLE'];
  const valuesData = {
    // NOTE: The texts are static, so let's take advantage of that
    // and save ms from useless getBoundingClientRect, shall we?
    MORPH: {
      text: '',
      width: '20rem', /* same as circle */
      height: '20rem',
    },
    DOTS: {
      text: ["Combining both design and development processes is one of Sandrina’s expertises. She loves to <strong>work closely with the design team</strong> to define and implement exciting experiences."],
      width: '48rem',
      height: '21rem',
    },
    ASK: {
      text: [
        "You’ll see Sandrina asking a lot of questions around. Wanna create a simple but detailed solution?",
        "Let’s understand the problem first.",
        "Only then we can make wise decisions taken with true care.",
      ],
      width: '39rem',
      height: '30rem',
    },
    WOLF: {
      text: [
        "If you wanna go quickly, Sandrina can make it happen. As a fast paced worker with a <strong>high quality bar</strong>, she can be the lone wolf when needed.",
        "However, if you wanna go far, <a href='#TODO'>ask her to join</a> your wolves pack and let’s go together, as a team.",
      ],
      width: '30.8rem',
      height: '44rem',
    },
    PEOPLE: {
      text: [
        "At the end the best practices were followed, all the code was reused and each pixel is perfectly aligned. But <strong>it doesn't matters if there isn’t a human connection</strong> between the people who create a product.",
        // "The technology is only the starting point. The passion behind a team is the fuel to create a memorable experience to everyone.",
      ],
      width: '54rem',
      height: '27rem',
    },
    FINALLE: {
      text: '',
      width: '0',
      height: '0',
    }
  }
  
  let onStage = true;
  let currentSection = 'MORPH';
  let elContainer;
  let elDots;
  let elAsk;
  let elWolf;
  let elPeople;

  let isMount = false; /* wait for Intro animations */
  let scrollY = 0;

  // ::: Morphose - a circle to a square (dabox)
  // TODO - Maybe this section shouldn't be here...
  // It's only logic, I was between Intro and Values
  const size = 200; // TODO - get real CSS Variables form circle
  const scaleStart = 0.8;
  $: distance = isMount && $_window.innerWidth/2 - size*1.5;
 
  const morphCircleRatio = 2; // circle progression based on scroll. (ex: it needs to scroll 25px to change 10px)
  const morphBoxRatio = 150; // nr of scrolled pixels needed to change border-radius from circle to square
  let isMorphing = true;

  $: offLimit = isMount && $_window.innerWidth/2 + (distance * morphCircleRatio) + morphBoxRatio;
  $: morphStyle = isMount && `width: ${offLimit + size}px`; // REFINE this value... should match the beginits of sDots

  $: daboxStyle = `
    ${$strDabox.progress ? `
      --radius: ${50 - $strDabox.progress*50}%;
      --opacity: ${1 - $strDabox.progress};
    ` : ''}
    --width: var(--width-${currentSection});
    --height: var(--height-${currentSection});
  `;
  
  const styleContainer = Object.keys(valuesData).reduce((styles, section) => (
    styles += `--width-${section}: ${valuesData[section].width}; --height-${section}: ${valuesData[section].height};`
  ), '')
  
  let styleClip = {} // a list of clipping for each section
  
  onMount(() => {
    isMount = true;
    window.addEventListener('scroll', verifyMetamorphose, { passive: true });

    updateValuesPivot();
    observeSections();
  })

  afterGeneralUpdate((prevState, state) => {
    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;
    
    if (prevPageSection === pageSection) {
      return false;
    }
    // When scroll is immediately, (by clicking on a nav link) Observers might not
    // be triggered, so we need to update the section manually.
    if (pageSection !== 'intro') {
      currentSection = 'FINALLE';
    } else if (window.scrollY === 0) { // It means it was triggered by navigation link
      currentSection = 'MORPH';
      updateDabox({ isActive: false, progress: 0 });
      verifyMetamorphose();
    }
  });

  afterResponsiveUpdate(() => {
    updateValuesPivot();
  })

  function updateValuesPivot() {
    // BUG: The parent (elContainer) has a smaller width than its content.
    // Dunno why. So, instead we pass the position of the last element (elPeople).
    const { left, width } = elPeople.getBoundingClientRect();
    updateGeneral({
      values: {
        el: elContainer,
        end: Math.round(left + width),
      }
    });
  }

  function verifyMetamorphose() {
    // Metamorphose the initial circle into a square (dabox)
    // 🐻 with me, it's going to be a fun ride!
    // -  P.S. me doing this part: https://i.imgur.com/3uyRWGJ.jpg
    
    scrollY = window.scrollY;
    const progress = distance - scrollY/morphCircleRatio;
    const morphProgress = progress*-1/morphBoxRatio;
    
    if (morphProgress > 1 && $strDabox.progress === 1) {
      // metamorphose is completed, there's no point in calculating more stuff.... 
      isMorphing = false;
      return false;
    }
    
    const daboxProgress = getInLimit(morphProgress, 0, 1);
    const offsetY = getInLimit(scrollY, 0, offLimit);
    const newDistance = getInLimit(progress, 0, distance);
    const scaleStartAdjusted = scaleStart + (0.2 - (newDistance * 0.2 / distance));

    isMorphing = true;

    updateCircle({
      style: `
        --scrollY: ${offsetY}px;
        --distance: ${newDistance}px;
        --scaleStart: ${scaleStartAdjusted};
      `,
      isPaused: newDistance === 0,
    })
    updateDabox({
      isActive: newDistance === 0,
      progress: daboxProgress,
    })
  }

  function observeSections() {
    const headingsToClip = ['ASK', 'WOLF', 'PEOPLE'];
    const clipArgs = {}; // A list of args to be passed to handles, based on the section
    const clipHandles = headingsToClip.reduce((handles, section) => ({
      ...handles,
      [section]: () => handleClipping(clipArgs[section]),
    }), {});
    const getNextSection = {
      enterLeft: (sectionName) => sectionName,
      enterRight: (sectionName) => sectionName,
      leaveLeft: (sectionName) => sections[sections.indexOf(sectionName) + 1],
      leaveRight: (sectionName) => sections[sections.indexOf(sectionName) - 1],
    }
    let isFirstTime = true;  // Prevent initial IO callback to take effect - https://stackoverflow.com/a/47855484/4737729

    function handleClipping({ section, entry, scrollPivot }) {
      console.log('clipping', section, '...');
      const clipLimit = entry.boundingClientRect.width + 1; // just for pixel-sanity-check
      const needsToScroll = $_window.innerWidth / 2;
      const awayFromMiddle = window.scrollY - scrollPivot - needsToScroll;

      styleClip[section] = `--clipx: ${getInLimit(awayFromMiddle, 0, clipLimit)}px;`;
    }

    function verifyClippingStatus (section, status, entry) {
      if (['enterLeft', 'enterRight'].includes(status)) {
        clipArgs[section] = {
          section: section,
          entry,
          scrollPivot: status === 'enterRight'
            ? window.scrollY
            : window.scrollY - entry.rootBounds.width - entry.boundingClientRect.width,
        }
        window.addEventListener('scroll', clipHandles[section]);
      } else {
        window.removeEventListener('scroll', clipHandles[section]);
      }
    }
    
    const watchSection = (entries) => {
      if(isFirstTime) {        
        isFirstTime = false;
        return false;
      }
      entries.forEach(entry => {
        // TODO - disable observers instead?
        if (!($strGeneral.pageCurrentSection === 'intro' && window.scrollY !== 0)) {
          return false;
        }

        const status = getIOstatus(entry);
        const section = entry.target.getAttribute('data-section');
        const newSection = getNextSection[status](section);
        console.log('intersecting from:', section, 'to:', newSection);

        currentSection = newSection;
        if (headingsToClip.includes(section)) {   
          verifyClippingStatus(section, status, entry);     
        }
      })
    };

    const observer = new IntersectionObserver(watchSection, {
      rootMargin: '0px',
      threshold: 0
    });

    observer.observe(elDots);
    observer.observe(elAsk);
    observer.observe(elWolf);
    observer.observe(elPeople);
  }

  $: getBoxClass = (sectionName) => {
    const isActive = sectionName === currentSection ? 'isActive' : '';
    const isGone = sections.indexOf(sectionName) < sections.indexOf(currentSection) ? 'isGone' : '';

    return `${isActive} ${isGone}`
  }
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

    &::before, &::after {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
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

  .section {
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
      transition: opacity 600ms 350ms cubic-bezier(.19,1,.22,1);
      pointer-events: auto;
    }

    &-text {
      display: block;
      transform: translateY(2rem);
      transition: transform 150ms 0ms ease-out;

      .isActive & {
        transition: transform 600ms 350ms cubic-bezier(.19,1,.22,1);
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

      :global(strong) { /* Svelte BUG - this exists, but it's dynamic. Use global to persist */
        font-weight: 600; /* TODO - this */
      }
    }
  }

  .sMorph {
    min-width: auto;

    /* TODO - add some life to these lines */
    &::before {
      content: '';
      position: absolute;
      top: 15vh;
      left: 50vw;
      width: 30vw;
      height: 1px;
      background: var(--text_1);
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 30vh;
      left: 5vw;
      width: 25vw;
      height: 1px;
      background: var(--text_1);
    }
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

<section class="container" bind:this={elContainer} style="{styleContainer} {currentSection === 'MORPH' ? '--scrollSpeed: 0;' : ''}">
  <h2 class="sr-only">Values</h2>
  
  <div class="dabox" class:isActive={$strDabox.isActive} class:isMorphing style={daboxStyle}>
  </div>

  <div class="section sMorph" style={morphStyle}></div>
  
  <!-- JSX I miss you... so lame having to write this multiple times -->
  <div class="section sDots">
    <h3 class="f-mono title" data-section="DOTS" bind:this={elDots}>
      Let's connect the dots
    </h3>
    <p class="sBox {getBoxClass('DOTS')}">
      <span class="sBox-text">
        {#each valuesData.DOTS.text as paragraph }
          <span class="sBox-text-par">{@html paragraph}</span>
        {/each}
      </span>
    </p>
  </div>

  <div class="section sAsk">
    <h3 class="f-mono title" data-section="ASK" bind:this={elAsk} style={styleClip.ASK}>
      <span class="title-part">Ask why</span>
      <span class="title-part">Understand how</span>
    </h3>
    <p class="sBox {getBoxClass('ASK')}">
      <span class="sBox-text">
        {#each valuesData.ASK.text as paragraph }
          <span class="sBox-text-par">{@html paragraph}</span>
        {/each}
      </span>
    </p>
  </div>

  <div class="section sWolf">
    <h3 class="f-mono title" data-section="WOLF" bind:this={elWolf} style={styleClip.WOLF}>
      <span class="title-part">From a<br/>lone wolf</span>
      <span class="title-part">to a<br/>team player</span>
    </h3>
    <p class="sBox {getBoxClass('WOLF')}">
      <span class="sBox-text">
        {#each valuesData.WOLF.text as paragraph }
          <span class="sBox-text-par">{@html paragraph}</span>
        {/each}
      </span>
    </p>
  </div>

  <div class="section sPeople">
    <h3 class="f-mono title" data-section="PEOPLE" bind:this={elPeople} style={styleClip.PEOPLE}>
      <span class="title-part">People come</span>
      <span class="title-part">before code</span>
    </h3>
    <p class="sBox {getBoxClass('PEOPLE')}">
      <span class="sBox-text">
        {#each valuesData.PEOPLE.text as paragraph }
          <span class="sBox-text-par">{@html paragraph}</span>
        {/each}
      </span>
    </p>
  </div>
</section>
