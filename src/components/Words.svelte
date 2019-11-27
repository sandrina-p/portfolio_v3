<script>
  import { onMount, afterUpdate } from 'svelte';
  import words from '../data/words.js';
  import { _window } from '../stores/responsive.js';
  import { strGeneral } from '../stores/general.js';
  import { getInLimit, getIOstatus } from '../utils';
  
  const colorTypes = {
    article: 'var(--primary_1)',
    talk: 'var(--primary_2)',
    zine: 'var(--primary_3_darker)',
    default: 'var(--primary_4)',
  };
  let isOnStage = null;
  let isFirstTimeOnStage = true;
  let elLed = null;
  let elCards = [];
  let cardsProgress = [];

  let ledText = 'sharing';
  let ledInterval;
  let ledColor = colorTypes.default;

  onMount(() => {
    setTimeout(() => {
      // window.scroll(0, 7000); // easier debug
    }, 3000);
  });

  afterUpdate(() => {
    isOnStage = $strGeneral.valuesIsDone;

    if(!isOnStage && $strGeneral.valuesIsDone) {
      ledInterval = window.setInterval(baffleIt, 2500);
    }

    if(isOnStage && !$strGeneral.valuesIsDone) {
      clearInterval(ledInterval);
    }

    if(isFirstTimeOnStage && $strGeneral.valuesIsDone) {
      isFirstTimeOnStage = false;
      initAnimation();

      ledInterval = window.setInterval(baffleIt, 2500);
    }
  })

  function baffleIt() {
    const options = ['sharing', 'writing', 'talking'];
    const colors = ['var(--primary_4)', 'var(--primary_1)', 'var(--primary_2)'];
    const index = options.indexOf(ledText);
    const nextIndex = options[index + 1] ? index + 1 : 0;
    
    ledColor = colors[nextIndex];
    ledText = options[nextIndex];
  }

  function initAnimation() {
    const cardArgs = []; // A list of args to be passed to handles, based on the card

    function handleScroll() {
      const scrollY = window.scrollY;
      const middle = $_window.innerHeight/2;
      cardArgs.forEach(args => {
        if(!args.ignore) {
          const percentage = getInLimit((scrollY - args.scrollPivot) / middle, 0, 1);
          cardsProgress[args.index] = percentage;
        }
      })
    }

    function verifyCardStatus (cardIndex, status, entry) {
      if (status === 'enterRight') {
        // Uff... this only works if the first time intesecting is from the bottom.
        // TODO - verifyCardStatus needs to support enter|leave top/bottom
        if(!cardArgs[cardIndex]) {
          cardArgs[cardIndex] = {
            index: cardIndex,
            entry,
            scrollPivot: window.scrollY
          }
        } else {
          cardArgs[cardIndex].ignore = false;
        }
      } else {
        if(cardArgs[cardIndex]) {
          cardArgs[cardIndex].ignore = true;
        }
      }
    }

    function watchCard(entries) {
      entries.forEach(entry => {
        const status = getIOstatus(entry);
        const cardIndex = entry.target.getAttribute('data-io');

        verifyCardStatus(cardIndex, status, entry);  
      })
    }

    window.addEventListener('scroll', handleScroll);

    const observer = new IntersectionObserver(watchCard, {
      rootMargin: '0px',
    });

    elCards.forEach(elCard => {
      observer.observe(elCard);
    })

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
</script>

<style>
  $headingWidth: 24rem; /* static content, so it's a luxury to do this. */

  .wrapper {
    position: relative;
    max-width: 100rem;
    margin: 0 auto;
    padding: 0 var(--spacer-M);
  }

  .heading {
    position: sticky;
    top: 50%;
    left: 50%;
    font-size: var(--font-XL);
    line-height: 1.2;
    width: $headingWidth;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;

    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
    transform-origin: 50% 80%;
    transition: opacity 150ms 0ms ease-out, transform 150ms ease-out;

    .isOnStage & {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
      transition: opacity 800ms 150ms cubic-bezier(.19,1,.22,1), transform 800ms 150ms cubic-bezier(.19,1,.22,1);
    }

    &-part {
      font-size: var(--font-heading_2);
    }
  }

  .card {
    &List {
      display: flex;
      flex-wrap: wrap;
      padding-top: 150vh;
    }

    &Item {
      --gutter: var(--spacer-M);
      --transition: transform 75ms ease-out;
      position: relative;
      color: var(--text_0);
      width: calc(50% - ($headingWidth/2) - var(--spacer-M));
      margin-bottom: var(--spacer-L);
      padding: var(--spacer-L);
      transition: var(--transition);

      &:nth-child(2n + 1) {
        margin-right: calc($headingWidth/2 + var(--spacer-M));
        transform: translateX(calc($headingWidth/2 - $headingWidth/2 * var(--progress)))
      }

      &:nth-child(2n) {
        margin-left: calc($headingWidth/2 + var(--spacer-M));
        transform: translateX(calc(-$headingWidth/2 + $headingWidth/2 * var(--progress)))
      }

      &:nth-last-child(2),
      &:nth-last-child(1) {
        margin-bottom: 0;
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
        content: '';
        z-index: -2;
        box-sizing: border-box;
        border: 2px dashed var(--place-color);
        opacity: 0.6;
        transform: skew(var(--skew));
        transition: transform 75ms ease-out;
        animation: skew 300ms ease-out;
      }

      &::after {
        background-color: var(--bg_1);
      }

      &Inner {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }
    }
  }

  .title {
    font-size: var(--font-L);
    line-height: 1.4;
    text-transform: capitalize;
    margin-bottom: var(--spacer-L);
  }

  .place {
    &List {
    }

    &Item {
      font-size: var(--font-L);

      &:not(:last-child) {
        margin-bottom: var(--spacer-M);
      }
    }

    &Link {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.4;
      color: inherit;
      text-decoration: none;

      &:hover,
      &:focus {
        outline: none;

        .placeWhere::before {
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

    &Where {
      border-bottom: 1.5px dashed var(--place-color);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -0.1em;
        width: calc(100% + 0.2em);
        height: 100%;
        background: var(--place-color);
        opacity: 0.2;
        border: 0 solid var(--bg_0);
        box-sizing: border-box;
        border-width: 0.2em 0 0.2em 0;
        transform: scale(0, 1);
        transition: transform 75ms ease-out;
        transform-origin: 0 0;
        z-index: 0;
      }
    }
  }

  .footer {
    text-align: center;
    transform: translateY(-100%);
  }
</style>

<section class="wrapper" class:isOnStage>
  <h2 class="f-mono heading" data-io="heading">
    She has been
    <span bind:this={elLed} class="f-led heading-part" data-text={ledText} style="--led-color: {ledColor}">
      {ledText}
    </span>
  </h2>

  <ul class="cardList">
    {#each words as { title, places }, index}
      <li
        class="cardItem"
        bind:this={elCards[index]}
        data-io={index}
        style="
          --progress: {cardsProgress[index]};
          --place-color: {colorTypes[places[0].type] || colorTypes.default};
          --skew: {getRandomSkew('x')}deg, {getRandomSkew('y')}deg;
        ">
        <div class="cardItemInner">
          <h3 class="f-mono title">{title}</h3>
          <ul class="placeList">
            {#each places as { type, where, link }}
              <li class="placeItem" style="--place-color: {colorTypes[type] || colorTypes.default}">
                <a href={link} class="placeLink" target="blank">
                  <span class="placeLinkInner placeType">{type}</span>
                  <span class="placeLinkInner placeWhere">{where}</span>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      </li>
    {/each}
  </ul>
  <div class="footer">
    More at <a class="u-link" href="https://dev.to/a_sandrina_p">Dev</a> and <a class="u-link" href="https://medium.com/@a_sandrina_p">Medium</a>.
  </div>
</section>
