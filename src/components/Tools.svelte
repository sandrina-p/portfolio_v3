<script>
  import { onMount, afterUpdate } from 'svelte';
  import tools from '../data/tools';
  import { getInLimit } from '../utils';
  import { _window } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';

  const reducedMotion = false; // TODO this
  const noGravity = true; // TODO this
  const colorTypes = {
    '1': 'var(--primary_1)',
    '2': 'var(--primary_2)',
    '3': 'var(--primary_3_darker)',
    '4': 'var(--primary_4)',
  };
  let tabSelected = '1';
  let interactedWith = { '1': true };
  let elHeading;
  let headingStyle;
  let isVisible = false;
  let wHeight;
  let limit;
  let limitNeg;
  let fromTop;

  afterGeneralUpdate((prevState, state) => {
    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    if (!prevState.isReady && state.isReady) {
      initAnimation();
    }

    if (prevPageSection !== pageSection && pageSection === 'skills') {
      updateFromTop();
      verifyAnimations();
    }
  });

  function updateFromTop() {
    const elTop = elHeading.getBoundingClientRect().top;
    fromTop = fromTop || elTop + (window.innerHeight - elTop) + window.scrollY;
  }

  function verifyAnimations() {
    console.log('updating superpowers...');
    const scrollY = window.scrollY;
    const offset = wHeight / 4;
    const closeToTop = wHeight - (fromTop - scrollY + offset);
    const translate = limit - (fromTop - scrollY + offset);
    const perc = closeToTop / limit;
    const scale = getInLimit(perc, 0, 1).toFixed(2);
    isVisible = scale === '1.00';

    headingStyle = `
      opacity: ${scale};
      transform:
        scale(${scale})
        translateY(${getInLimit(translate, limitNeg, 0).toFixed(2)}px);
    `;
  }

  function initAnimation() {
    wHeight = $_window.innerHeight;
    limit = wHeight / 2;
    limitNeg = wHeight * -1;

    const watchHeading = ([entry]) => {
      if (entry.isIntersecting) {
        // OPTIMIZE - convert this to scrollPivot and create package.
        fromTop = entry.boundingClientRect.top + window.scrollY;
        window.addEventListener('scroll', verifyAnimations);
      } else {
        window.removeEventListener('scroll', verifyAnimations);
      }
    };

    const observer = new IntersectionObserver(watchHeading);

    observer.observe(elHeading);

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
    padding: var(--spacer-XL) var(--spacer-M) var(--spacer-XL);
    min-height: 100vh;
    overflow: hidden;
    padding-top: 50vh;
    transition: background-color 150ms ease-out;

    &.uAppear {
      transition: background-color 400ms cubic-bezier(0.19, 1, 0.22, 1);
      background-color: var(--bg_invert);
    }
  }

  .heading {
    position: relative;
    font-size: var(--font-XL);
    margin-top: var(--spacer-L);
    text-align: center;

    &Kicker {
      display: block;
      color: var(--text_1);
    }

    &Main {
      position: relative;
      display: block;
      font-size: var(--font-heading_0);
      color: transparent;
      transform-origin: 50% 0%;
      -webkit-text-stroke: 2px var(--text_1);
      will-change: transform;
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
      text-align: center;
      margin: var(--spacer-L) 0;
      margin-top: var(--spacer-XL);
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1; /* to be above tools */
    }

    &Item {
      display: inline-block;
      font-size: var(--font-L);
      border: none;
      cursor: pointer;
      color: var(--text_1);
      padding: var(--spacer-S) var(--spacer-M);
      margin-bottom: var(--spacer-L);
      background: transparent;
      border: 2px dashed;
      width: 14rem;
      opacity: 1;
      border-radius: 4px; /* TODO/REVIEW borders */
      position: relative;
      transform: scale(0);
      animation: wow 500ms cubic-bezier(0.28, 0.67, 0, 1.29) forwards;

      &:hover,
      &:focus {
        opacity: 0.7;
        color: var(--colorType);
      }

      &[aria-selected='true'] {
        color: var(--colorType);
      }
    }

    @keyframes wow {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
  }

  .tools {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    height: 28rem; /* static list content */
    flex-direction: column;
    margin-top: var(--spacer-XL);
    transform-origin: 50% 0;

    &Item {
      position: relative;
      width: calc(33.333% - var(--spacer-M));
      margin: 0 var(--spacer-M) var(--spacer-M) 0;
      opacity: 0.5;
      padding-left: calc(var(--spacer-M) + var(--spacer-S));
      transition: opacity 250ms ease;
      animation: blink 10s infinite ease;

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
          transition-timing-function: var(--bounce);
          transform: scale(1);
        }
      }

      .noGravity & {
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

        /* Handmade coordinates for each item */
        &:nth-child(1) {
          transform: translate(12rem, 19rem);
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
        }
        &:nth-child(6) {
          transform: translate(15rem, -15rem);
        }
        &:nth-child(7) {
          transform: translate(1rem, 5rem);
        }
        &:nth-child(8) {
          transform: translate(24rem, 2rem);
        }
        &:nth-child(9) {
          transform: translate(-4rem, 9rem);
        }
        &:nth-child(10) {
          transform: translate(-7rem, -2rem);
        }
        &:nth-child(11) {
          transform: translate(43rem, -8rem);
        }
        &:nth-child(12) {
          transform: translate(47rem, 10rem);
        }
        &:nth-child(13) {
          transform: translate(-14rem, 0rem);
        }
        &:nth-child(14) {
          transform: translate(-32rem, 1rem);
        }
        &:nth-child(15) {
          transform: translate(29rem, -8rem);
        }
        &:nth-child(16) {
          visibility: hidden;
          transform: translate(-2rem, 2rem);
        } /* SEO */
        &:nth-child(17) {
          transform: translate(2rem, -1rem);
        }
        &:nth-child(18) {
          transform: translate(26rem, 8rem);
        }
        &:nth-child(19) {
          transform: translate(5rem, 9rem);
        }
        &:nth-child(20) {
          transform: translate(-5rem, -4rem);
        }
        &:nth-child(21) {
          transform: translate(-4rem, 8rem);
        }
        &:nth-child(22) {
          transform: translate(13rem, -9rem);
        }
        &:nth-child(23) {
          visibility: hidden;
          transform: translate(2rem, 6rem);
        } /* GULP */
      }
    }
  }

  .point {
    &Orbite {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: var(--spacer-M);
      height: var(--spacer-M);
      transform-origin: var(--spacer-L) 50%;
      animation: orbite 15s infinite linear;
    }

    &Rotate,
    &Star {
      display: block;
      width: 100%;
      height: 100%;
      transform-origin: 50% 50%;
    }

    &Rotate {
      animation: rotate 25s infinite linear;

      :not(.uAppear) & {
        animation-play-state: pause;
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
        transition-timing-function: var(--bounce);
        transform: scale(1);
      }
    }
  }

  .footer {
    color: var(--text_invert);
    margin-top: var(--spacer-XL);
  }

  @keyframes orbite {
    0% {
      transform: rotate(-45deg);
    }
    100% {
      transform: rotate(45deg);
    }
  }

  @keyframes rotate {
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
  data-section="skills"
  id="skills">
  <h2 class="heading f-mono" style="--colorTabSelected: {colorTypes[tabSelected]};">
    <span class="sr-only">Get to know her</span>
    <span class="headingMain" bind:this={elHeading} style={headingStyle}>skills</span>
  </h2>
  <div class="main">
    <div class="tabList uAppear-0" role="tablist" aria-label="Type of tools">
      {#each Object.keys(tools.lists) as id}
        {#if showExtraBtn(id)}
          <button
            class="tabItem"
            style="--colorType: {colorTypes[id]}"
            role="tab"
            aria-selected={tabSelected === id}
            on:click={() => updateList(id)}>
            {tools.lists[id]}
          </button>
        {/if}
      {/each}
    </div>
    <ul class="tools uAppear-3" class:noGravity role="tabpanel">
      {#each tools.tools as { name, list }}
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
          <span class="toolsItemText">{name}</span>
        </li>
      {/each}
    </ul>
    <div class="footer">
      <p>
        See them in action on
        <a href="https://codepen.io/sandrina-p" target="_blank">Codepen</a>
        and
        <a href="http://github.com/sandrina-p" target="_blank">Github</a>
      </p>
      <p>
        Hey, I'm on
        <a href="https://github.com/sandrina-p/s008080_2019" target="_blank">Github</a>
        !
      </p>
    </div>
  </div>
</section>
