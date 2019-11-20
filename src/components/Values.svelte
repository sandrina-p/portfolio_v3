<script>
  import { onMount, afterUpdate } from 'svelte';
  import { getInLimit, getIOstatus } from '../utils';
  import { _window, onResponsiveChange } from '../stores/responsive.js';
  import { strDabox, updateDabox } from '../stores/dabox.js';
  import { updateCircle } from '../stores/circle.js';

  let isMounted = false;
  let elDots;
  let elAsk;
  let elWolf;
  let elPeople;
  let scrollY;

  // ::: Morphose - circle -> dabox
  const size = 200;   // TODO - get real CSS Variables form circle.
  const scaleStart = 0.8;
  $: distance = isMounted && $_window.innerWidth/2 - size*1.5;
  const morphRatio = 2.5; // morphose progression based on scroll. (ex: it needs to scroll 25px to change 10px)
  
  $: offLimit = distance * morphRatio;
  $: morphStyle = isMounted && `width: ${offLimit + size}px`; // REFINE this value... should match the beg of sDots
  $: daboxStyle = $strDabox.progress ?
    `
      --radius: ${50 - $strDabox.progress*50}%;
      --opacity: ${1 - $strDabox.progress};
      --translateX: ${scrollY}px;
      ${$strDabox.width ? `--width:${$strDabox.width};` : ''}
      ${$strDabox.height ? `--height:${$strDabox.height};` : ''}
    ` : '';
  
  let daboxText;

  // ::: Values
  const sections = ['INTRO', 'DOTS', 'ASK', 'WOLF', 'PEOPLE', 'FINALLE']
  let currentSection = 'INTRO';
  const valuesData = {
    // NOTE: The texts are static, so let's take advantage of that
    // and save ms from useless getBoundingClientRect, shall we?
    INTRO: {
      text: '',
      width: '',
      height: ''
    },
    DOTS: {
      text: ["Combining both design and development processes is one of Sandrina’s expertises. She loves to work closely with the design team to define and implement exciting experiences."],
      width: '37.5rem',
      height: '18.4rem'
    },
    ASK: {
      text: [
        "You’ll see Sandrina asking a lot of questions around. Wanna create a simple but detailed solution?",
        "Let’s understand the problem first.",
        "Only then we can make wise decisions taken with true care.",
      ],
      width: '33rem',
      height: '33rem'
    },
    WOLF: {
      text: [
        "If you wanna go quickly, Sandrina can make it happen. As a fast paced worker with a high quality bar, she can be the lone wolf when needed.",
        "However, if you wanna go far, ask her to join your wolves pack and let’s go together, as a team.",
      ],
      width: '26rem',
      height: '43rem',
    },
    PEOPLE: {
      text: [
        "At the end, it doesn’t matter if all the best practices are followed, all the code is reused and each pixel is perfectly aligned, if there isn’t a human connection between the people who create a product.",
        "The technology is only the starting point. The passion behind a team it’s the fuel to create a memorable experience to everyone.",
      ],
      width: '40rem',
      height: '40rem',
    },
    FINALLE: {
      text: '',
      width: '1rem',
      height: '1rem',
    }
  }
  
  // NOTE: I'm not sure if this is genius or just a *really* bad practice.
  // So basically this self-executes everytime currentSection changes.
  $: reactiveStuffBAMM = {
    doIt: (sectionName) => {
      console.log('Updating dabox based on', sectionName)
      daboxText = sectionName;
      updateDabox({
        width: valuesData[sectionName].width,
        height: valuesData[sectionName].height,
      })
    }
  }.doIt(currentSection)

  onMount(() => {
    isMounted = true;
    watchSections();
  });

  function handleHetamorphose() {
    // Metamorphose the initial circle into a square (dabox)
    // 🐻 with me, it's going to be a fun ride!
    // -    P.S. me doing this part: https://i.imgur.com/3uyRWGJ.jpg
    
    scrollY = window.scrollY;

    const threshold = size * 3;
    if (scrollY > offLimit + threshold) {
      // metamorphose is completed, there's no point in calculating more stuff.... 
      return false;
    }

    const offsetY = getInLimit(scrollY, 0, offLimit);
    const progress = distance - scrollY/morphRatio;
    const newDistance = getInLimit(progress, 0, distance);
    const scaleStartAdjusted = scaleStart + (0.2 - (newDistance * 0.2 / distance));
    const daboxProgress = getInLimit(progress*-1/50, 0, 1);

    updateCircle({
      style: `
        --scrollY: ${offsetY}px;
        --distance: ${newDistance}px;
        --scaleStart: ${scaleStartAdjusted}
      `,
      isPaused: newDistance === 0,
    })
    updateDabox({
      isActive: newDistance === 0,
      progress: daboxProgress,
    })
  }

  function watchSections() {
    const watchHeading = (entries) => {
      entries.forEach(entry => {
        const section = entry.target.getAttribute('data-section');
        const status = getIOstatus(entry)  
        const performReactionBasedOnStatus = {
          enterLeft: () => {
            currentSection = section
          },
          enterRight: () => {
            currentSection = section
          },
          leaveLeft: () => {
            currentSection = sections[sections.indexOf(section) + 1]
          },
          leaveRight: () => {
            currentSection = sections[sections.indexOf(section) - 1]
          },
        }[status]()
      })
    };

    const observer = new IntersectionObserver(watchHeading, {
      rootMargin: '0px',
      threshold: 0
    });

    observer.observe(elDots);
    observer.observe(elAsk);
    observer.observe(elWolf);
    observer.observe(elPeople);


    setTimeout(() => {
      // BUG - workaround first IO intersection
      currentSection = 'INTRO'
    }, 250)
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
    width: var(--width, 20rem); /* same as circle */
    height: var(--height, 20rem);
    background: var(--text_0); /* TODO - better color */
    border: 2px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition-delay: 0ms;
    border-radius: var(--radius, 50%);
    color: var(--bg);
    transform: translate(calc(var(--translateX, 0px) - 50%), -50%);
    z-index: 1;
    transition: width 400ms ease-in-out, height 400ms ease-in-out;

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
    font-size: var(--font-heading_1);
    margin-right: 75vw; /* white space is everything */
  }

  .sBox {
    position: fixed;
    width: var(--width);
    height: var(--height);
    top: 50vh;
    left: 50vw;
    transform: translate(calc(var(--textTranslateX, 0px) - 50%), -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: var(--text-L);
    line-height: 1.5;
    color: var(--bg);
    z-index: 1;
    outline: 1px dashed #aaa;
    opacity: 0;
    pointer-events: none;
    transition: opacity 50ms 0ms ease-out;
    
    &.isActive {
      opacity: 1;
      transition: opacity 300ms 350ms ease-in;
      pointer-events: auto;
    }

    &-text {
      display: block;
      transform: translateY(2rem);
      transition: transform 350ms 0ms ease-out;

      .isActive & {
        transition: transform 350ms 350ms cubic-bezier(.19,1,.22,1);
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
    }
  }

  .sMorph {
    min-width: auto;

    /* TODO - add some life to these lines */
    &::before {
      content: '';
      position: absolute;
      top: 15vh;
      left: 10vw;
      width: 30vw;
      height: 1px;
      background: var(--text_1);
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 30vh;
      right: 50vw;
      width: 25vw;
      height: 1px;
      background: var(--text_1);
    }
  }


  .sDots {
    .sBox {
      padding: var(--spacer-L);
    }
  }

  .sAsk {
    .title {
      position: relative;
      --clipx-first: 0; /* Here's the secret behind the title masks! */
      --clipx-last: 0;

      &-part:first-child {
        clip-path: polygon(var(--clipx-first) 0, 100% 0, 100% 100%, var(--clipx-first), 100%)
      }

      &-part:last-child {
        position: absolute;
        left: 0;
        top: 0;
        white-space: nowrap;
        clip-path: polygon(var(--clipx-last) 0, 100% 0, 100% 100%, var(--clipx-last), 100%)
      }
    }

    .sBox {
      padding: var(--spacer-XL) var(--spacer-L);
    }
  }

  .sWolf,
  .sPeople {
    .sBox {
      padding: var(--spacer-XL) var(--spacer-L);
    }
  }

  .finalle {
    width: 200vw;
    height: 100vh;
    /* background: var(--primary_1); */
  }
</style>

<svelte:window on:scroll={handleHetamorphose} />
<section class="container" style="--textTranslateX: {scrollY}px">
  <h2 class="sr-only">Values</h2>
  <div class="dabox" class:isActive={$strDabox.isActive} style={daboxStyle} />
  <div class="section sMorph" style={morphStyle}></div>
  
  <!-- JSX I miss you... lame having to write this multiple times -->
  <div class="section sDots">
    <h3 class="f-mono title" data-section="DOTS" bind:this={elDots}>
      Let's connect the dots
    </h3>
    <p class="sBox {getBoxClass('DOTS')}"
      style="--width:{valuesData.DOTS.width}; --height:{valuesData.DOTS.height};">
      <span class="sBox-text">
        {#each valuesData.DOTS.text as paragraph }
          <span class="sBox-text-par">{paragraph}</span>
        {/each}
      </span>
    </p>
  </div>

  <div class="section sAsk">
    <h3 class="f-mono title" data-section="ASK" bind:this={elAsk}>
      <span class="title-part">Ask why</span>
      <span class="title-part">Understand how</span>
    </h3>
    <p class="sBox {getBoxClass('ASK')}"
      style="--width:{valuesData.ASK.width}; --height:{valuesData.ASK.height};">
      <span class="sBox-text">
        {#each valuesData.ASK.text as paragraph }
          <span class="sBox-text-par">{paragraph}</span>
        {/each}
      </span>
    </p>
  </div>
  <div class="section sWolf">
    <h3 class="f-mono title" data-section="WOLF" bind:this={elWolf}>
      <span class="title-part">From a lone wolf</span>
      <span class="title-part">to a team player</span>
    </h3>
    <p class="sBox {getBoxClass('WOLF')}"
      style="--width:{valuesData.WOLF.width}; --height:{valuesData.WOLF.height};">
      <span class="sBox-text">
        {#each valuesData.WOLF.text as paragraph }
          <span class="sBox-text-par">{paragraph}</span>
        {/each}
      </span>
    </p>
  </div>
  <div class="section sPeople">
    <h3 class="f-mono title" data-section="PEOPLE" bind:this={elPeople}>
      <span class="title-part">People come</span>
      <span class="title-part">before code</span>
    </h3>
    <p class="sBox {getBoxClass('PEOPLE')}"
      style="--width:{valuesData.PEOPLE.width}; --height:{valuesData.PEOPLE.height};">
      <span class="sBox-text">
        {#each valuesData.PEOPLE.text as paragraph }
          <span class="sBox-text-par">{paragraph}</span>
        {/each}
      </span>
    </p>
  </div>
  <div class="section finalle" />
</section>
