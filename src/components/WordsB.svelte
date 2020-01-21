<script>
  import { onMount, afterUpdate } from 'svelte';
  import words from '../data/words.js';
  import { _window } from '../stores/responsive.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  import { getInLimit, getIOstatusVertical } from '../utils';
  import baffle from 'baffle';

  const colorTypes = {
    article: 'var(--primary_1)',
    talk: 'var(--primary_2)',
    zine: 'var(--primary_3_darker)',
    default: 'var(--primary_4)',
  };
  const options = ['sharing', 'writing', 'talking'];
  const colors = ['var(--primary_4)', 'var(--primary_1)', 'var(--primary_2)'];
  let isOnStage = null;
  let isFirstTimeOnStage = true;
  let elLed = null;
  let elCards = [];
  let cardsProgress = [];

  let baffleLed;
  let ledText = options[0];
  let ledInterval;
  let ledColor = colorTypes.default;
  let elCardList;
  let init = null;

  afterGeneralUpdate((prevState, state) => {
    // REVIEW - Should move this index logic to general store?
    const thisSectionIndex = state.pageSections.indexOf('words');
    const currentSectionIndex = state.pageSections.indexOf(state.pageCurrentSection);
    
    if (!isOnStage && currentSectionIndex >= thisSectionIndex) {
      // OPTIMIZE - better placement of section on viewport
      isOnStage = true;
    }

    if (isOnStage && currentSectionIndex < thisSectionIndex) {
      isOnStage = false;
    }
  });

  // function baffleIt() {
  //   console.log('baffling words...'); // TODO REVIEW THIS
  //   const index = options.indexOf(ledText);
  //   const nextIndex = options[index + 1] ? index + 1 : 0;
  //   const nextLedText = options[nextIndex];

  //   baffleLed
  //     .start()
  //     .text(currentText => nextLedText)
  //     .reveal(500);
  //   ledColor = 'var(--bg_0)';
  //   setTimeout(() => {
  //     ledText = nextLedText;
  //     ledColor = colors[nextIndex];
  //   }, 250);
  // }

  // function initAnimation() {
  //   const cardArgs = []; // A list of args to be passed to handles, based on the card

  //   baffleLed = baffle(elLed).set({ characters: '+-•~!=*' });

  //   function updateCardArgs(cardId, entry) {
  //     if (entry.isIntersecting) {
  //       if (!cardArgs[cardId]) {
  //         cardArgs[cardId] = {
  //           index: cardId,
  //           entry,
  //           scrollPivot: window.scrollY - (entry.rootBounds.height - entry.boundingClientRect.top),
  //         };
  //       } else {
  //         cardArgs[cardId].ignore = false;
  //       }
  //     } else {
  //       if (cardArgs[cardId]) {
  //         cardArgs[cardId].ignore = true;
  //       }
  //     }
  //   }

  //   function verifyCardPostion() {
  //     console.log('Scrolling through words cards...');
  //     const scrollY = window.scrollY;
  //     const middle = $_window.innerHeight / 2;
  //     cardArgs.forEach(args => {
  //       if (!args.ignore) {
  //         const percentage = getInLimit((scrollY - args.scrollPivot) / middle, 0, 1);
  //         cardsProgress[args.index] = percentage;
  //       }
  //     });
  //   }

  //   function watchList([entry]) {
  //     const status = getIOstatusVertical(entry);

  //     clearInterval(ledInterval);
  //     window.removeEventListener('scroll', verifyCardPostion);

  //     if (entry.isIntersecting) {
  //       // ledInterval = window.setInterval(baffleIt, 2500);
  //       window.addEventListener('scroll', verifyCardPostion);
  //     }
  //   }

  //   function watchCard(entries) {
  //     entries.forEach(entry => {
  //       const cardId = entry.target.getAttribute('data-io');
  //       updateCardArgs(cardId, entry);
  //     });
  //   }

  //   const observerList = new IntersectionObserver(watchList);
  //   const observerCards = new IntersectionObserver(watchCard);

  //   observerList.observe(elCardList);
  //   // OPTMIZE/REVIEW - check all observers, DRY them and disconnect when.

  //   elCards.forEach(elCard => {
  //     observerCards.observe(elCard);
  //   });

  //   verifyCardPostion();

  //   return {
  //     verifyCardPostion,
  //   };
  // }

  // function getRandom(min, max) {
  //   min = Math.ceil(min);
  //   max = Math.floor(max);
  //   return (Math.random() * (max - min) + min).toFixed(2);
  // }

  // function getRandomSkew(axios) {
  //   const abs = getRandom(0, 1) > 0.5 ? 1 : -1;
  //   if (axios === 'x') {
  //     return getRandom(3, 8) * abs;
  //   } else if (axios === 'y') {
  //     return getRandom(2, 3) * abs;
  //   }
  // }
</script>

<style>
  $headingWidth: 24rem; /* static content, so it's a luxury to do this. */
  $delayIn0: 200ms;
  $delayIn1: 400ms;
  $delayIn2: 600ms;
  $delayIn3: 750ms;

  .wrapper {
    position: relative;
    padding-left: calc((100vw - 90rem + 9rem) / 2);
    opacity: 0;
    transition: opacity 150ms ease-out;
    background-color: var(--bg_0); 

    &.isOnStage {
      transition: opacity 500ms;
      opacity: 1;
    }

    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 25vw;
      height: 100%;
      background: linear-gradient(90deg, var(--bg_0), var(--primary_1));
      opacity: 0.2;
      transform: translateX(100%);
      transition: transform 150ms ease-out;
      display: none; /* REVIEW THIS */ 
      
      .isOnStage& {
        transition: transform 500ms $delayIn1 cubic-bezier(0.0, 0.0, 0.2, 1);
        transform: translateX(0%);
      }
    }
  }

  .content {
    position: relative;
    padding-top: 55vh;
    padding-bottom: 0;
    background-color: var(--bg_0);
  }

  .header {
    padding-left: 1.5rem;
    opacity: 0;
    /* transform: translateY(3rem);
    transform-origin: 50% 50%; */
    transition: opacity 150ms 0ms ease-out;
    /* , transform 150ms ease-out; */
    margin-bottom: 3rem;

    .isOnStage & {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 500ms $delayIn0 cubic-bezier(0.0, 0.0, 0.2, 1);
        /* transform 1000ms $delayIn1 cubic-bezier(0.19, 1, 0.22, 1); */
    }

    &Title {
      font-size: var(--font-heading_2);
      margin-bottom: 1rem;

      &-part:last-child {
        color: var(--primary_1);
      }
    }

    &Description {
      color: var(--text_1);
    }
  }

  .card {
    &List {
      margin-left: -9rem;
    }

    &Item {
      position: relative;
      padding: var(--spacer-M);
      background-color: var(--bg_1);
      display: flex;
      align-items: baseline;
      width: 90rem;

      &:not(:last-child) {
        margin-bottom: 1.5rem;
      }

      opacity: 0;
      transition: opacity 150ms 0ms ease-out, transform 150ms ease-out;
      transform: translateX(20rem);

      .isOnStage & {
        opacity: 1;
        transform: translateX(0);
        transition: opacity 600ms var(--delay, 0) cubic-bezier(0.0, 0.0, 0.2, 1),
          transform 600ms var(--delay, 0) cubic-bezier(0.0, 0.0, 0.2, 1);
      }

      $off: calc(((100vw - 90rem + 9rem) / 2) / 4); /* TODO - holy moly */
      &::before {
        content: '';
        width: calc(100% + $off * 4); /* 4 = nr childs */
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background: var(--bg_1);
        z-index: -2;
        transform: translateX(calc($off * -4 + $off * var(--i)));
        box-shadow: 0.2rem 0.2rem var(--primary_1_lighter);
       }
      

      &:nth-child(1) { --i: 1; --delay: $delayIn2; }
      &:nth-child(2) { --i: 2; --delay: calc($delayIn2 + 200ms); }
      &:nth-child(3) { --i: 3; --delay: calc($delayIn2 + 400ms); }
      &:nth-child(4) { --i: 4; --delay: calc($delayIn2 + 600ms); }

    }
  }

  .date {
    flex-shrink: 0;
    margin: 0 var(--spacer-L) 0 var(--spacer-M);
    font-size: var(--font-S);
    color: var(--text_1);
  }

  .title {
    font-size: var(--font-L2);
    line-height: 1.2;
    /* text-transform: capitalize; */
    margin-bottom: var(--spacer-M);
  }

  .place {
    &List {
      display: flex;
    }

    &Item {
      font-size: var(--font-L);
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.4;

      &:not(:last-child) {
        margin-right: var(--spacer-L);
      }
    }

    &Link {
      position: relative;
      color: inherit;
      text-decoration: none;
      display: flex;
      align-items: center;

      &:hover,
      &:focus {
        outline: none;

        .placeWhere::before {
          transition-duration: 250ms;
          transform: scale(1);
        }
      }
    }

    &Type {
      text-transform: capitalize;
      color: var(--text_1);
      font-size: var(--font-S);
    }

    &Icon {
      width: 1.8rem;
      height: 1.8rem;
      margin-right: var(--spacer-S);
      opacity: 0.8;
    }
  }

  .footer {
    text-align: center;
    transform: translateY(-100%);
  }
</style>

<section class="wrapper"
  class:isOnStage
  id="words"
  data-section="words"
  data-section-offset="25">
  <div class="content">
    <header class="header">
      <h2 class="f-mono headerTitle" data-io="heading" aria-label="She has been sharing">
        <span class="headerTitle-part">She has been</span>
        <span
          bind:this={elLed}
          class="headerTitle-part"
          data-text={ledText}
          style="--led-color: {ledColor}">
          {ledText}
        </span>
      </h2>
      <p class="headerDescription">Something sweet and short about this.</p>
    </header>
    <ul class="cardList" bind:this={elCardList} aria-label="articles, talks and more">
      {#each words as { title, date, places }, index}
        <li
          class="cardItem">
          <span class="date">{date}</span>
          <div>
            <h3 class="f-mono title">{title}</h3>
            <ul class="placeList">
              {#each places as { type, where, link, svg }}
                <li class="placeItem" style="--place-color: {colorTypes[type] || colorTypes.default}">
                  <span class="placeType">{type}</span>
                  <div class="placeLink">
                    <svg aria-hidden="true" class="placeIcon {svg}">
                      <use xlink:href="#{svg}" />
                    </svg>
                    <a href={link} class="u-link" aria-label="">{where}</a>
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</section>
