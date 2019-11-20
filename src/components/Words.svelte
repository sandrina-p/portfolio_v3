<script>
  import { onMount } from 'svelte';
  import words from '../data/words.js';
  import { _window } from '../stores/responsive.js';
  import baffle from 'baffle';

  // OPTIMIZE - 🍝 CODE AHEAD... You have been warned

  const initialCards = 4;
  const colorTypes = {
    article: 'var(--primary_1)',
    talk: 'var(--primary_2)',
    zine: 'var(--primary_3_darker)',
    default: 'var(--primary_4)',
  };
  let elHeading = null;
  let elLed = null;
  let isVisibleList = {
    heading: false,
    card0: false,
    card1: false,
    card2: false,
    card3: false,
    cta: false,
  }; // OPTIMIZE THIS PLEASEEE

  let baffleLed;
  let isExpanded = false;
  let ledText = 'sharing';
  let ledInterval;
  let ledColor = colorTypes.default;

  onMount(() => {
    baffleLed = baffle(elLed).set({ characters: '+-•~!=*' });

    setTimeout(() => {
      // window.scroll(0, 7000); // easier debug
      initAnimation();
    }, 250);
  });

  function initAnimation() {
    const ioThreshold = 5; // sometimes top isn't exactly 0 when triggered.
    let fromTop;

    function watchCardsWhenScrollingToTheTop() {
      // Keep them visible until completely out of the viewport
      // IO can't do this for us because of rootMargin, so lets do it manually
      console.log('scrolling - cards close to go away');
      const { innerHeight } = $_window;

      const awayFromVieport = innerHeight - (fromTop - window.scrollY) < innerHeight / -2;

      if (awayFromVieport) {
        Object.keys(isVisibleList).forEach((item, index) => (isVisibleList[item] = false));
        isExpanded = false;
        window.removeEventListener('scroll', watchCardsWhenScrollingToTheTop);
      }
    }

    function setBaffleLed(isActive) {
      const options = ['sharing', 'writing', 'talking'];
      const colors = [colorTypes.default, colorTypes.article, colorTypes.talk];
      
      if (isActive) {
        clearInterval(ledInterval);
        ledInterval = window.setInterval(baffleIt, 2500);
      } else {
        clearInterval(ledInterval);
      }

      function baffleIt() {
        console.log('baffeling text...');

        const index = options.indexOf(ledText);
        const nextLedText = options[index + 1] || options[0];
        const nextIndex = options[index + 1] ? index + 1 : 0;
        baffleLed
          .start()
          .text(currentText => nextLedText)
          .reveal(500);
        ledColor = 'var(--bg)';
        setTimeout(() => {
          ledText = nextLedText;
          ledColor = colors[nextIndex];
        }, 250);
      }
    }

    function watchHeading([entry]) {
      // entries.forEach(entry => {
      const gotToTheTop = entry.boundingClientRect.top <= ioThreshold;
      const gotToTheBottom = !gotToTheTop && !entry.isIntersecting;
      const comeFromTheBottom = !gotToTheTop && entry.isIntersecting;

      let isVisible = gotToTheTop || gotToTheBottom || entry.isIntersecting;

      if (gotToTheTop) {
        return false;
      }

      if (gotToTheBottom) {
        fromTop = entry.boundingClientRect.top + window.scrollY;
        window.addEventListener('scroll', watchCardsWhenScrollingToTheTop);
      } else if (comeFromTheBottom) {
        window.removeEventListener('scroll', watchCardsWhenScrollingToTheTop);
      }

      setBaffleLed(entry.isIntersecting);

      // OPTIMIZE - if @DavidKPiano saw this, he would have a heart attack 💔
      // I wasted hours thinking about a way of not using JS but it's need...
      // Well. Make it work, then make it better! /* more about on css [1] */
      const visibilityStatus = isVisible ? 'appearing' : false;

      if (isVisibleList.heading === visibilityStatus) {
        return false;
      }

      Object.keys(isVisibleList).forEach((item, index) => {
        isVisibleList[item] = isVisible ? 'appearing' : false;
        if (!gotToTheBottom && isVisible) {
          setTimeout(() => {
            isVisibleList[item] = 'finished';
          }, 150 * index + 400);
        }
      });
    }

    const observer = new IntersectionObserver(watchHeading, {
      rootMargin: '0px 0px -40% 0px',
    });

    observer.observe(elHeading);
  }

  function toggleCards() {
    for (let i = initialCards - 1, l = words.length; i < l; i++) {
      isVisibleList[`card${i}`] = 'appearing';

      // Optimize - [1] - same reason as a in observer.
      setTimeout(() => {
        isVisibleList[`card${i}`] = 'finished';
      }, 100 * (i - initialCards));
    }
    isExpanded = true;
  }

  function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.random() * (max - min) + min).toFixed(2);
  }

  function getRandomSkew(axios) {
    const abs = getRandom(0, 1) > 0.5 ? 1 : -1;
    if (axios === 'x') {
      return getRandom(3, 8) * abs;
    } else if (axios === 'y') {
      return getRandom(2, 3) * abs;
    }
  }

  function getDelay(index) {
    return (index >= initialCards && !isExpanded ? index - initialCards + 1 : index + 1) * 100;
  }
</script>

<style>
  .wrapper {
    position: relative;
    max-width: 100rem;
    margin: 0 auto;
    padding: 0 var(--spacer-M);
    min-height: 100vh;
    padding-bottom: 50vh; /* make space for SUPERPOWERS */
  }

  .heading {
    position: relative;
    font-size: var(--font-heading_1);
    line-height: 1.4;

    &Shadow {
      position: absolute;
      color: var(--primary_1);
      top: 0;
      left: 0;
      transform: translate(-1.5em, -0.5em);
      opacity: 0.3;
      z-index: -1;
    }
    opacity: 1;
    /* transform: translate3d(0, 0, 0); */
    transition: opacity 600ms ease-in; /* transform 400ms ease-in; */

    &.isHidden {
      opacity: 0;
      /* transform: translate3d(0, 2rem, 0); */
      transition: opacity 600ms ease-out;
    }
  }

  .card {
    &List {
      display: flex;
      flex-wrap: wrap;
      margin-top: var(--spacer-XL);
    }

    &Item {
      --gutter: var(--spacer-M);
      --transition: transform 75ms ease-out;
      position: relative;
      color: var(--text_invert);
      width: calc(50% - var(--gutter));
      margin-bottom: var(--spacer-L);
      padding: var(--spacer-L);
      transition: var(--transition);

      &.isHidden {
        position: absolute;
        pointer-events: none;
      }

      &.isActive {
        position: relative;
        pointer-events: default;
      }

      &:nth-child(2n + 1) {
        margin-right: var(--gutter);
      }

      &:nth-child(2n) {
        margin-left: var(--gutter);
      }

      &Inner {
        opacity: 1;
        transition: opacity 400ms ease-in var(--appear-delay);
        .cardItem.isHidden & {
          opacity: 0;
        }
        .cardItem.isActive & {
        }
      }

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }

      &::before {
        z-index: -2;
        box-sizing: border-box;
        border: 2px dashed var(--place-color);
        opacity: 0.6;
        transform: skew(var(--skew));
        transition: opacity 1ms linear, transform 75ms ease-out;
        animation: skew 300ms ease-out;

        .cardItem.isHidden& {
          opacity: 0;
          transform: skew(0, 0);
        }

        .cardItem.isActive& {
          transition-duration: 400ms;
          transition-delay: calc(var(--appear-delay) + 450ms);
        }
      }

      &::after {
        background-color: var(--bg-invert);
        opacity: 1;
        transition: opacity 400ms ease-in var(--appear-delay);

        .cardItem.isHidden& {
          opacity: 0;
        }

        .cardItem.isActive& {
        }
      }

      &:hover,
      &:focus-within {
        transform: translate(1rem, -1rem);
        &,
        &::before {
          transition-timing-function: ease-in-out;
          transition-duration: 250ms; /* TODO create duration scale */
        }

        &::before {
          /* [1] so these transitions work properly without delay */
          transform: translate(-1rem, 1rem);
          opacity: 1;
          .isActive& {
          }
        }
      }
    }
  }

  .title {
    font-size: var(--font-XL);
    line-height: 1.4;
    text-transform: capitalize;
  }

  .place {
    &List {
    }

    &Item {
      margin-top: var(--spacer-M);
      font-size: var(--font-L);
    }

    &Link {
      position: relative;
      display: inline-flex;
      align-items: center;
      color: inherit;
      border-bottom: 1.5px dashed var(--place-color);
      text-decoration: none;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -0.1em;
        width: calc(100% + 0.2em);
        height: 100%;
        background: var(--place-color);
        opacity: 0.2;
        border: 0 solid var(--bg-invert);
        box-sizing: border-box;
        border-width: 0.2em 0 0.2em 0;
        transform: scale(0, 1);
        transition: transform 75ms ease-out;
        transform-origin: 0 0;
        z-index: 0;
      }

      &:hover,
      &:focus {
        outline: none;

        &::before {
          transition-duration: 250ms; /* TODO speed scale */
          transform: scale(1);
        }
      }

      &Inner {
        position: relative;
        z-index: 1;
      }
    }

    &Type {
      font-weight: 600;
      text-transform: capitalize;
      color: var(--place-color);
    }
  }

  .cta {
    background: var(--bg_0);
    color: var(--text_0);
    padding: var(--spacer-S) calc(var(--spacer-S) * 3);
    border: 1px solid var(--text_0);
    font-size: var(--font-L);
    cursor: pointer;

    &.isHidden {
      opacity: 0;
      transition: opacity 100ms ease-out;
    }
    &.isActive {
      opacity: 1;
      transition: opacity 400ms ease-in var(--appear-delay);
    }
  }
</style>

<section class="wrapper">
  <h2
    bind:this={elHeading}
    class="f-mono heading uAppear-0"
    class:isActive={isVisibleList.heading === 'appearing'}
    class:isHidden={!isVisibleList.heading}
    data-io="heading">
    She has been
    <span bind:this={elLed} class="f-led" data-text={ledText} style="--led-color: {ledColor}">
      {ledText}
    </span>
  </h2>

  <div class="cardList">
    {#each words as { title, places }, index}
      <article
        class="cardItem"
        class:isActive={isVisibleList.heading === 'appearing'}
        class:isHidden={(!isExpanded && index + 1 > initialCards) || !isVisibleList.heading}
        data-io={`card${index}`}
        style="--place-color: {colorTypes[places[0].type] || colorTypes.default}; --appear-delay: {getDelay(index)}ms;
        --skew: {getRandomSkew('x')}deg, {getRandomSkew('y')}deg ">
        <div class="cardItemInner">
          <h3 class="f-mono title">{title}</h3>
          <ul class="placeList">
            {#each places as { type, where, link }}
              <li class="placeItem" style="--place-color: {colorTypes[type] || colorTypes.default}">
                <a href={link} class="placeLink" target="blank">
                  <span class="placeLinkInner placeType">{type}</span>
                  <span class="placeLinkInner">&nbsp;— {where}</span>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      </article>
    {/each}
  </div>
  {#if !isExpanded}
    <button
      class="f-mono cta"
      class:isActive={isVisibleList.cta}
      class:isHidden={!isVisibleList.cta}
      style="--appear-delay: {getDelay(3)}ms;"
      on:click={toggleCards}>
      {isExpanded ? 'Hide' : 'Explore all'}
    </button>
  {/if}
</section>
