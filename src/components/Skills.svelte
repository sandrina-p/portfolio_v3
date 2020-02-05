<script>
  import { onMount, afterUpdate } from 'svelte';
  import tools from '../data/tools';
  import { getInLimit } from '../utils';
  import { _window, matchMq } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import { GITHUB_URL, CODEPEN_URL, SITE_REPO } from '../data/misc.js';

  const colorTypes = {
    '0': 'var(--primary_1_sat)',
    '1': 'var(--primary_2)',
    '2': 'var(--primary_3_darker)',
    '3': 'var(--primary_4)',
  };
  const sortByLevel = (() => {
    const lists = Array.from(Array(Object.keys(tools.lists).length), () => []);
    for(let tool of tools.tools) {
      tool.list.forEach(listIndex => {
        return lists[listIndex].push(tool)
      })
    }
    return lists
  })();

  $: wHeight = $_window && $_window.innerHeight;

  let tabSelected = '0';
  let interactedWith = { '0': true };
  let elTitle;
  let isVisible = false;
  let limit;
  let fromTop;
  let isOnStage;
  let progressN = 0; // title scale
  let progressY = 0; // title translate

  afterGeneralUpdate((prevState, state) => {
    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    // REVIEW - Should move this index logic to general store?
    const prevSectionIndex = state.pageSections.indexOf('words');
    const currentSectionIndex = state.pageSections.indexOf(state.pageCurrentSection);
    
    if (!prevState.isReady && state.isReady) {
      // setTimeout(() => {
      //   window.scroll(0, 8000); // FOR DEBUG
      // }, 150)
    }

    if (!isOnStage && currentSectionIndex >= prevSectionIndex) {
      isOnStage = true;
      // The "scale" effect should start before 
      initAnimation();
    }

    if (prevPageSection !== pageSection && pageSection === 'skills') {
      updateFromTop();
      verifyAnimations();
    }
  });

  function updateFromTop(elTop) {
    fromTop = fromTop || (elTop || elTitle.getBoundingClientRect().top) + window.scrollY;
  }

  function verifyAnimations() {
    console.log('scrolling skills...');
    const scrollY = window.scrollY;
    const offset = wHeight / 4;
    const closeToTop = wHeight - (fromTop - scrollY + offset);
    const perc = closeToTop / limit;

    progressN = getInLimit(perc, 0, 1);
    const translate = progressN > -1 ? limit - progressN*limit/1 : 0
    progressY = `${getInLimit(translate, 0, limit) * -1}px`
    isVisible = progressN === 1;
  }

  function initAnimation() {
    limit = wHeight / 2;

    const watchTitle = ([entry]) => {
      if (entry.isIntersecting) {
        updateFromTop(entry.boundingClientRect.top)
        window.addEventListener('scroll', verifyAnimations);
      } else {
        window.removeEventListener('scroll', verifyAnimations);
      }
    };

    const observer = new IntersectionObserver(watchTitle);

    // OPTIMIZE - disconnect
    observer.observe(elTitle);

    updateFromTop();
    verifyAnimations();
  }

  function updateList(id) {
    interactedWith[id] = true;
    tabSelected = id;
  }

  function showExtraBtn(id) {
    /* EASTER_EGG - show "made me" when all 3 lists are viewed */
    return id !== '4' || Object.keys(interactedWith).length >= 3;
  }
</script>

<style>
  .wrapper {
    min-height: 100vh;
    overflow: hidden;
    padding-top: 50vw;
    padding-bottom: 4rem;
    background-color: var(--bg_0);
    transition: background-color 400ms cubic-bezier(0.19, 1, 0.22, 1);

    &.uAppear {
      background-color: var(--bg_invert);
    }

    @media (--md) {
      padding-bottom: 33vh;
    }
  }

  .header {
    position: relative;
    margin-top: $spacer-L;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    &Title {
      position: relative;
      font-size: calc($font-heading_1 * 0.8);
      color: transparent;
      transform-origin: 50% 0%;
      -webkit-text-stroke: 0.1rem var(--text_1);
      opacity: var(--progressN, 0);
      transform:
        scale(var(--progressN, 1))
        translateY(var(--progressY, 0));
      transition: transform 100ms ease,
        text-shadow 150ms; 

      .uAppear & {
        -webkit-text-stroke: initial;
        color: var(--text_invert);
        /* TIL: fake opacity without opacity */
        text-shadow:
          0 0 4.5rem var(--bg_invert),
          0 0 4.5rem var(--bg_invert),
          0 0 3.5rem var(--colorTabSelected);
      }
    }

    &Desc {
      padding: $spacer-S $layout-margin;
      color: var(--text_invert);
    }
  }

  /* -- Tools -- */
  .main {
    max-width: 90rem;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .tab {
    &List {
      display: flex;
      flex-direction: column;
      margin-top: $spacer-XL;
      z-index: 1; /* to be above stars */
      overflow: hidden; /* dont show scrollbar during entry animations */
    }

    &Item {
      position: relative;
      font-size: $font-L;
      font-weight: 500;
      border: none;
      cursor: pointer;
      color: var(--text_invert);
      padding: $spacer-S $spacer-M;
      margin: 0 $spacer-M $spacer-M;
      background: transparent;
      white-space: nowrap;
      flex-shrink: 0;
      width: 14rem;
      margin: 0 0 $spacer-L;

      opacity: 0;
      transform: translateY(1rem);
      transition: opacity 150ms ease-out, transform 150ms ease-out;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        z-index: -1;
        height: 100%;
        border-radius: 0.4rem; /* REVIEW borders */
        background-color: var(--text_1);
        opacity: 0.5;
        transform: scale(1, 0.3);
        transform-origin: 0 75%;
        transition: background 250ms ease-out, transform 250ms ease-out;
      }

      &:hover,
      &:focus {
        outline: none;
        color: var(--colorType);
      }

      &[aria-pressed='true'] {
        color: var(--text_0);

        &::before {
          opacity: 1;
          background-color: var(--colorType);
          transform: scale(1, 1);
          transition: transform 400ms cubic-bezier(0.28, 0.67, 0, 1.29);
        }
      }

      .uAppear & {
        opacity: 1;
        transform: translateY(0);
        transition:
          opacity 1000ms var(--delay) cubic-bezier(0.0, 0.0, 0.2, 1),
          transform 1000ms var(--delay) cubic-bezier(0.19, 1, 0.22, 1);

        $time: 75ms;

        &:nth-child(1) { --delay: calc(200ms + $time*1); }
        &:nth-child(2) { --delay: calc(200ms + $time*2); }
        &:nth-child(3) { --delay: calc(200ms + $time*3); }
      }
    }
  }

  .tools {
    position: absolute;
    top: 0;
    left: 0;
    margin-top: $spacer-XL;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    height: 28rem; /* static content luxuries */
    flex-direction: column;
    transform-origin: 50% 0;
    line-height: 1;

    &Item {
      position: relative;
      width: calc(33.333% - $spacer-M);
      margin: 0 $spacer-M $spacer-M 0;
      opacity: 0.5;
      padding-left: $spacer-MS;
      transition: opacity 250ms ease;
      animation: blink 10s infinite ease;
      white-space: nowrap;

      &.isActive {
        opacity: 1;
        animation: none;
        /* animation-name: blinkStrong; */
      }

      &Text {
        display: inline-block;
        transform: scale(0);
        transform-origin: 0 50%;
        transition: transform 250ms ease-out;
        color: var(--text_invert);

        .isActive & {
          transition-timing-function: $animate-bounce;
          transform: scale(1);
        }
      }

      @for $i from 1 to 24 {
        &:nth-child($i) {
          .pointOrbite {
            /* WOW discovery: Use @keyframes to create an animation.
              Use delay to start the animation at X point and use
              "animation-play-state:paused" to always stick there.
              And that's how we create random coordinates in a cleaner way */
            animation-delay: calc(1ms * random(-40000, 0));
            animation-play-state: paused;
          }

          .pointRotate {
            $reversed: random(0, 1);
            @if $reversed == 1 {
              animation-direction: reverse;
            }
          }

          &, /* blink animation */
          .pointRotate {
            animation-delay: calc(1ms * random(-40000, 0));
          }

          .toolsItemText,
          .pointStar {
            transition-delay: calc(1ms * random(0, 250));
          }
        }
      }

      .galaxy & {
        /* Handmade coordinates for each item */
        &:nth-child(1) {
          transform: translate(3rem, 23rem);
        }
        &:nth-child(2) {
          transform: translate(5rem, 1rem);
        }
        &:nth-child(3) {
          transform: translate(-5rem, -6rem);
        }
        &:nth-child(4) {
          transform: translate(0rem, 1rem);
        }
        &:nth-child(5) {
          transform: translate(-7rem, 1rem);
          /* visibility: hidden; Figma */
        }
        &:nth-child(6) {
          transform: translate(15rem, -15rem);
        }
        &:nth-child(7) {
          transform: translate(17rem, -7rem);
        }
        &:nth-child(8) {
          transform: translate(24rem, 2rem);
        }
        &:nth-child(9) {
          transform: translate(-4rem, 8rem);
        }
        &:nth-child(10) {
          transform: translate(-7rem, -2rem);
        }
        &:nth-child(11) {
          transform: translate(43rem, -8rem);
        }
        &:nth-child(12) {
          transform: translate(54rem, 12rem);
        }
        &:nth-child(13) {
          transform: translate(-18rem, 6rem);
        }
        &:nth-child(14) {
          transform: translate(-32rem, 1rem);
        }
        &:nth-child(15) {
          transform: translate(29rem, -8rem);
        }
        &:nth-child(16) {
          transform: translate(-2rem, 2rem);
          /* visibility: hidden; SEO */
        }
        &:nth-child(17) {
          transform: translate(2rem, -1rem);
        }
        &:nth-child(18) {
          transform: translate(-1rem, 19rem);
        }
        &:nth-child(19) {
          transform: translate(5rem, 10rem);
        }
        &:nth-child(20) {
          transform: translate(22rem, -5rem);
        }
        &:nth-child(21) {
          transform: translate(-4rem, 8rem);
          /* visibility: hidden; Wepback */
        }
        &:nth-child(22) {
          transform: translate(13rem, -9rem);
        }
        &:nth-child(23) {
          transform: translate(2rem, 6rem);
          /* visibility: hidden; GULP */
        }
        &:nth-child(24) {
          transform: translate(19rem, -9rem);
        }
      }
    }
  }

  .point {
    &Orbite {
      display: block;
      position: absolute;
      top: 0.7rem;
      left: 0;
      width: 1.1rem;
      height: 1.1rem;
      animation: orbite 15s infinite linear;
      transform-origin: 50% 50%;

      @media (--md) {
        top: 0;
        width: 1.6rem;
        height: 1.6rem;
        transform-origin: $spacer-L 50%;
      }
    }

    &Rotate,
    &Star {
      display: block;
      width: 100%;
      height: 100%;
      transform-origin: 50% 50%;
    }

    &Rotate {
      @media (--md) {
        animation: rotateSlider 25s infinite linear;

        :not(.uAppear) & {
          animation-play-state: pause;
        }
      }

      
    }

    &Star {
      background-color: var(--text_invert);
      transform: scale(0.5);
      transition: transform 250ms ease;
      cursor: zoom-in;
      border-radius: 0.4rem;

      .isActive & {
        background-color: var(--colorType);
        transition-timing-function: $animate-bounce;
        transform: scale(1);
      }
    }
  }
  
  /* -------- CAROUSEL VERSION ------------- */
  .main {
    position: relative;

    @media (--max-md) {
      padding-bottom: calc($layout-margin * 2);
      &::before { /* scroll shadow */
        content: '';
        position: absolute;
        top: 0;
        left: 100vw;
        height: 100%;
        width: calc($layout-margin*2);
        z-index: 1; /* above content */
        pointer-events: none;
        transform: translateX(-100%);
        background: linear-gradient(to left, var(--bg_invert), var(--bg_invert_transparent));
        visibility: hidden;
        opacity: 0;
        
        .uAppear & {
          /* avoid a weird clash of colors on fade in/out */
          transition: visibility 0ms 100ms, opacity 100ms 100ms;
          visibility: visible;
          opacity: 1;
        }
      }
    }
  }

  .slider {
    $gutter: calc($layout-margin*2);
    padding: $spacer-L $layout-margin;

    /* scroll margin on the end */
    &::after {
      display: block;
      width: 1px;
      height: 1px;
      content: '';
      scroll-snap-align: end;
      flex-shrink: 0;
    }

    &Title {
      position: relative;
      color: var(--text_invert);
      font-size: $font-XL;
      margin-bottom: $spacer-MS;
      line-height: 1;
      z-index: 0; /* so :before appears under */

      &::before {
        content: '';
        display: block;
        position: absolute;
        bottom: -0.2em;
        left: -0.2em;
        width: 100%;
        height: 0.5em;
        z-index: -1;
        opacity: 0.6;
        border-radius: 0.2rem;
        background-color: var(--colorType);
      }
    }

    &Item {
      width: calc(100vw - $layout-margin*5);
      max-width: 22rem;
      margin-right: $gutter;
    }

    /* Not worth mentioning on mobile */
    [data-tool='Git'],
    [data-tool='SEO'],
    [data-tool='Redux'],
    [data-tool='Webpack'],
    [data-tool='Gulp'],
    [data-tool='Figma'],
    [data-tool='Netlify']  {
      display: none;
    }
  }


  @media (--md) {
    .wrapper {
      padding-top: 25vh; /* enough to cover all in black I guess */
      min-height: 100vh;
    }

    .header {
      &Title {
        font-size: $font-heading_0;
      }

      &Desc {
        padding: 0;
      }
    }
  }

  @keyframes orbite {
    0% {
      transform: rotate(-45deg);
    }
    100% {
      transform: rotate(45deg);
    }
  }

  @keyframes rotateSlider {
    0% {
      transform: rotate(0deg) scale(0.7);
    }
    50% {
      transform: rotate(90deg) scale(1);
    }
    100% {
      transform: rotate(180deg) scale(0.7);
    }
  }

  @keyframes rotateGalaxy {
    0% {
      transform: rotate(0deg) scale(0.7);
    }
    50% {
      transform: rotate(180deg) scale(1);
    }
    100% {
      transform: rotate(360deg) scale(0.7);
    }
  }

  @keyframes blink {
    0% {
      opacity: 0.5;
    }
    2% {
      opacity: 0.2;
    }
    4% {
      opacity: 1;
    }
    6%,
    100% {
      opacity: 0.5;
    }
  }

  @keyframes blinkStrong {
    0% {
      opacity: 1;
    }
    1% {
      opacity: 0.5;
    }
    2% {
      opacity: 1;
    }
    3% {
      opacity: 0.2;
    }
    4%,
    100% {
      opacity: 1;
    }
  }
</style>

<section
  class="wrapper"
  class:uAppear={isVisible}
  class:uAppearSoon={!isVisible}
  id="skills"
  data-section-offset-h="5">
  <header class="header" style="--colorTabSelected: {colorTypes[tabSelected]};">
    <h2 class="headerTitle f-mono" bind:this={elTitle} style='--progressN: {progressN}; --progressY: {progressY}'>skills</h2>
    <p class="headerDesc uAppear-0">Take a sneak peek on <a href={GITHUB_URL} class="u-link invert">Github</a> and <a href={CODEPEN_URL} class="u-link invert">Codepen</a></p>
  </header>
  
  <div class="main">
    {#if $matchMq.md} 
      <div class="tabList uAppear-0" aria-label="Skill types">
        {#each Object.keys(tools.lists) as id}
          {#if showExtraBtn(id)}
            <button
              class="tabItem"
              style="--colorType: {colorTypes[id]}"
              aria-pressed={tabSelected === id}
              on:click={() => updateList(id)}>
              {tools.lists[id]}
            </button>
          {/if}
        {/each}
      </div>
      <ul class="tools galaxy uAppear-3" role="tabpanel">
        {#each tools.tools as { name, list, url }}
          <li
            class="toolsItem"
            class:isActive={list.includes(tabSelected)}
            aria-hidden={!list.includes(tabSelected)}
            on:click={() => (!list.includes(tabSelected) ? updateList(list[0]) : true)}
            style="--colorType: {colorTypes[list[0]]}">
            <span class="pointOrbite">
              <span class="pointRotate">
                <span class="pointStar" />
              </span>
            </span>
            {#if !url}
              <span class="toolsItemText">{name}</span>
            {:else}
              <a class="toolsItemText u-link" href={url}>{name}</a>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <ul class="slider u-carousel uAppear-1">
        {#each sortByLevel as level, lvlIndex}
          <li class='sliderItem u-carousel-item' style="--colorType: {colorTypes[lvlIndex]}">
            <h3 class="f-mono sliderTitle">
              {tools.lists[lvlIndex]}
            </h3>
            <ul aria-label={tools.lists[lvlIndex]}>
              {#each level as { name, list, url, hide }}
                <li
                  data-tool={name}
                  class="toolsItem isActive">
                  <span class="pointOrbite">
                    <span class="pointRotate">
                      <span class="pointStar" />
                    </span>
                  </span>
                  {#if !url}
                    <span class="toolsItemText">{name}</span>
                  {:else}
                    <a class="toolsItemText u-link" href={url}>{name}</a>
                  {/if}
                </li>
            {/each}
            </ul>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>
