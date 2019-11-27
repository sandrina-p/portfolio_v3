<script>
  import { onMount, afterUpdate } from 'svelte';
  import tools from '../data/tools';
  import { getInLimit } from '../utils';
  import { _window } from '../stores/responsive.js';

  const reducedMotion = false; // TODO this
  const noGravity = true; // TODO this
  const colorTypes = {
    '1': 'var(--primary_1)',
    '2': 'var(--primary_2)',
    '3': 'var(--primary_3_darker)',
    '4': 'var(--primary_4)',
  };
  let tabSelected = '1';
  let elHeading;
  let headingStyle;
  let isVisible = false;

  onMount(() => {
    setTimeout(() => {
      // window.scroll(0, 12000); // easier debug

      // TODO only do this after marginTop on index.svelte
      !reducedMotion && initHeadingAnimation();
    }, 250);
  });

  function initHeadingAnimation() {
    const wHeight = $_window.innerHeight;
    const limit = wHeight / 2;
    const limitNeg = wHeight * -1;
    let fromTop;

    function verifyAnimations() {
      const closeToTop = wHeight - (fromTop - window.scrollY);
      const translate = limit - (fromTop - window.scrollY);
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

    const watchHeading = ([entry]) => {
      if (entry.isIntersecting) {
        // Note1: Add w.scrollY to make sure it's okay even when the page starts already scrolled.
        // Note2: Update fromTop to avoid bugs when the DOM changes - ex: All articles were expanded
        fromTop = entry.boundingClientRect.top + window.scrollY;
        window.addEventListener('scroll', verifyAnimations);
      } else {
        window.removeEventListener('scroll', verifyAnimations);
      }
    };

    const observer = new IntersectionObserver(watchHeading, {
      rootMargin: '0px',
      threshold: 0,
    });

    observer.observe(elHeading);

    verifyAnimations();
  }

  function updateList(id) {
    tabSelected = id;
  }
</script>

<style>
  .wrapper {
    padding: var(--spacer-XL) var(--spacer-M) var(--spacer-XL); /* REVIEW */
    min-height: 100vh;
    overflow: hidden;
    padding-top: 100vh;
    transition: background 250ms ease-in-out;

    &.uAppear {
      background-color: #1b1b1b;
    }
  }

  .heading {
    position: relative;
    font-size: var(--font-XL);
    margin-top: var(--spacer-L);
    text-align: center;
    line-height: 0.8;

    &Kicker {
      display: block;
      color: var(--text_1);
    }

    &Main {
      position: relative;
      display: block;
      font-size: 12rem; /* var(--font-heading_1);
      /* text-transform: uppercase; */
      /* letter-spacing: 0.05em; */
      color: transparent;
      /* font-weight: 600; */
      transform-origin: 50% 0%;
      -webkit-text-stroke: 2px rgb(100, 100, 100);

      /* &::before {
        content: 'superpowers';
        position: absolute;
        text-shadow: var(--glow, 0 0 0 transparent);
        z-index: -1;
        top: 0;
        left: 0;
        color: var(--bg_0);
        opacity: 0.75;

        .uAppear & {
          --glow: 0 0 0.3em var(--colorTabSelected);
        }
      } */
    }
  }

  /* -- Tools -- */
  .main {
    max-width: 70rem;
    margin: 0 auto;
  }

  .tabs {
    text-align: center;
    margin: var(--spacer-L) 0;
    margin-top: var(--spacer-XL);

    &Item {
      display: inline-block;
      margin: 0 var(--spacer-M);
      font-size: var(--font-L);
      background-color: transparent;
      color: var(--text_invert);
      border: none;
      cursor: pointer;
      text-decoration: underline;

      &:hover,
      &:focus {
        /* TODO - better UI/animation */
        color: var(--colorType);
      }

      &[aria-selected='true'] {
        background-color: var(--colorType);
        color: var(--text_invert);
        opacity: 1;
        text-decoration: none;
      }
    }
  }

  .tools {
    position: relative;
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
      animation: blink 15s infinite ease;

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
          transform: translate(18rem, 6rem);
        }
        &:nth-child(2) {
          transform: translate(3rem, 2rem);
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
          transform: translate(12rem, 1rem);
        }
        &:nth-child(7) {
          transform: translate(-2rem, 3rem);
        }
        &:nth-child(8) {
          transform: translate(8rem, 2rem);
        }
        &:nth-child(9) {
          transform: translate(1rem, 8rem);
        }
        &:nth-child(10) {
          transform: translate(-10rem, -2rem);
        }
        &:nth-child(11) {
          transform: translate(-1rem, 11rem);
        }
        &:nth-child(12) {
          transform: translate(36rem, 11rem);
        }
        &:nth-child(13) {
          transform: translate(13rem, -1rem);
        }
        &:nth-child(14) {
          transform: translate(12rem, 7rem);
        }
        &:nth-child(15) {
          transform: translate(16rem, -1rem);
        }
        &:nth-child(16) {
          transform: translate(1rem, 2rem);
        }
        &:nth-child(17) {
          transform: translate(2rem, 1rem);
        }
        &:nth-child(18) {
          transform: translate(20rem, 8rem);
        }
        &:nth-child(19) {
          transform: translate(-7rem, -1rem);
        }
        &:nth-child(20) {
          transform: translate(5rem, 0rem);
        }
        &:nth-child(21) {
          transform: translate(-18rem, -14rem);
        }
        &:nth-child(22) {
          transform: translate(7rem, 0rem);
        }
        &:nth-child(23) {
          transform: translate(2rem, 6rem);
        }
        &:nth-child(24) {
          transform: translate(16rem, -18rem);
        }
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

  @keyframes orbite {
    0% { transform: rotate(-45deg); }
    100% { transform: rotate(45deg); }
  }

  @keyframes rotate {
    0% { transform: rotate(0deg) scale(0.7); }
    50% { transform: rotate(180deg) scale(1); }
    100% { transform: rotate(360deg) scale(0.7); }
  }

  @keyframes blink {
    0% { opacity: 0.5; }
    2% { opacity: 0.2; }
    4% { opacity: 1; }
    6%, 100% { opacity: 0.5; }
  }

  @keyframes blinkStrong {
    0% { opacity: 1; }
    1% { opacity: 0.5; }
    2% { opacity: 1; }
    3% { opacity: 0.2; }
    4%, 100% { opacity: 1; }
  }
</style>

<section class="wrapper" class:uAppear={isVisible} class:uAppearSoon={!isVisible}>
  <h2 class="heading f-mono">
    <span class="headingKicker"
      bind:this={elHeading}
      style="--colorTabSelected: {colorTypes[tabSelected]}; {headingStyle}"
      >Get to know her</span>
    <span
      class="headingMain uAppear-0">
      superpowers
    </span>
  </h2>
  <div class="main">
    <ul class="tools uAppear-1" class:noGravity role="tabpanel">
      {#each tools.tools as { name, list }}
        <li
          class="toolsItem"
          class:isActive={list.includes(tabSelected)}
          aria-hidden={!list.includes(tabSelected)}
          on:click={() => !list.includes(tabSelected) ? updateList(list[0]) : true}
          style="--colorType: {list.includes(tabSelected) ? colorTypes[tabSelected] : colorTypes[list[0]]}">
          <span class="pointOrbite">
            <span class="pointRotate">
              <span class="pointStar" />
            </span>
          </span>
          <span class="toolsItemText">{name}</span>
        </li>
      {/each}
    </ul>
    <div class="tabs uAppear-2" role="tablist" aria-label="Type of tools">
      {#each Object.keys(tools.lists) as id}
        <button
          class="f-mono tabsItem"
          style="--colorType: {colorTypes[id]}"
          role="tab"
          aria-selected={tabSelected === id}
          on:click={() => updateList(id)}>
          {tools.lists[id]}
        </button>
      {/each}
    </div>
  </div>
</section>
