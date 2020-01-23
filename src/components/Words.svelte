<script>
  import { onMount, afterUpdate } from 'svelte';
  import words from '../data/words.js';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  // import { _window } from '../stores/responsive.js';
  // import { getInLimit, getIOstatusVertical } from '../utils';
  // import baffle from 'baffle';

  const colorTypes = {
    article: 'var(--primary_1)',
    talk: 'var(--primary_2)',
    zine: 'var(--primary_3_darker)',
    default: 'var(--primary_4)',
  };
  const options = ['sharing', 'writing', 'talking'];
  const colors = ['var(--primary_4)', 'var(--primary_1)', 'var(--primary_2)'];
  let isOnStage = false; // on viewport or passed the viewport
  let isOnView = false; // on viewport
  // // let isFirstTimeOnStage = true;
  // // let elLed = null;
  // // let elCards = [];
  // // let cardsProgress = [];

  // // let baffleLed;
  // // let ledInterval;
  let ledText = options[0];
  let ledColor = colorTypes.default;
  // // let elCardList;
  // // let init = null;

  afterGeneralUpdate((prevState, state) => {
    // REVIEW - Should move this index logic to general store?
    const thisSectionIndex = state.pageSections.indexOf('words');
    const currentSectionIndex = state.pageSections.indexOf(state.pageCurrentSection);
    
    // if (!prevState.isReady && state.isReady) {
    //   window.scroll(0, 2000); // FOR DEBUG
    // }

    if (!isOnStage && currentSectionIndex >= thisSectionIndex) {
      // OPTIMIZE - better placement of section on viewport
      isOnStage = true;
    }

    if (isOnStage && currentSectionIndex < thisSectionIndex) {
      isOnStage = false;
    }

    isOnView = currentSectionIndex === thisSectionIndex;
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


  .content {
    padding-top: $spacer-XL;
    padding-bottom: $spacer-XL;
  }

  .header {
    padding-left: $layout-margin;

    &Title {
      font-size: calc($font-heading_2 * 0.8);
      margin-bottom: 1rem;

      @media(--max-xs) {
        font-size: calc($font-heading_2 * 0.7); /* to fit two lines */
      }

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
      padding: $spacer-L $layout-margin;
      align-items: stretch;

      @media (--max-md) {
        /* scroll margin on the end */
        &::after {
          display: block;
          width: $layout-margin;
          height: 10rem;
          background: var(--bg_0);
          content: '';
          scroll-snap-align: end;
          flex-shrink: 0;
        }
      }
    }
    
    &Item {
      position: relative;
      padding: $spacer-XL $spacer-L $spacer-LM;
      background-color: var(--bg_1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 26rem;
      flex-shrink: 0;
      scroll-snap-align: center;

      @media (--max-xs) {
        padding-left: $spacer-M;
        padding-right: $spacer-M;
        max-width: 72vw; /* to see next card */
      }

      @media (--max-md) {
        /* REVIEW DESIGN - HUM... Yes or no?? */
        box-shadow:
          inset 0 0 15px rgba(55, 84, 170, 0),
          inset 0 0 20px rgba(255, 255, 255, 0),
          10px 10px 18px #d8d8d8,
          -10px -10px 22px #f7f2f0,
          inset 0px 0px 4px rgba(255, 255, 255, 0.2);
      }

      &:not(:last-child) {
        margin: 0 $spacer-L 0 0;
      }
    }
  }

  .title {
    font-size: $font-L2;
    margin-bottom: $spacer-L;
  }

  .date {
    font-size: $font-S;
    color: var(--text_1);
    order: -1; /* to appear visually before title, but keep A11Y order */
    position: absolute;
    top: calc($spacer-L + $spacer-S);
    left: auto;
  }

  .place {
    &List {
      display: flex;
      flex-direction: column;
    }

    &Item {
      font-size: $font-L;
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.4;

      &:not(:last-child) {
        margin: 0 0 $spacer-M;
      }
    }

    &Link {
      position: relative;
      color: inherit;
      text-decoration: none;
      display: flex;
      align-items: center;
    }

    &Type {
      text-transform: capitalize;
      color: var(--text_1);
      font-size: $font-S;
    }

    &Icon {
      width: 1.8rem;
      height: 1.8rem;
      margin-right: $spacer-S;
      opacity: 0.8;
    }
  }
  

  @media (--md) {
    $cardW: 90rem;
    $cardOffset: 9rem;

    .wrapper {
      position: relative;
      padding-left: calc((100vw - $cardW + $cardOffset) / 2);
      opacity: 0;
      transition: opacity 150ms ease-out;
      background-color: var(--bg_0);

      &.isOnStage {
        transition: opacity 500ms;
        opacity: 1;
      }
    }

    .content {
      position: relative;
      padding-top: 75vh;
      background-color: var(--bg_0);
    }

    .header {
      padding-left: $spacer-M;
      margin-bottom: calc($spacer-M * 3);
      opacity: 0;
      transition: opacity 150ms 0ms ease-out;

      .isOnStage & {
        opacity: 1;
        transition: opacity 500ms $delayIn0 cubic-bezier(0.0, 0.0, 0.2, 1);
      }

      &Title {
        font-size: $font-heading_2;
      }
    }

    .card {
      &List {
        margin-left: calc($cardOffset * -1);
        padding: 0;
      }

      &Item {
        padding: $spacer-M;
        padding-left: calc($cardOffset + $spacer-M);
        justify-content: flex-start;
        width: $cardW;

        &:not(:last-child) {
          margin: 0 0 $spacer-M;
        }

        opacity: 0;
        transition:
          opacity 150ms 0ms ease-out,
          transform 150ms ease-out;
        transform: translateX(20rem);

        .isOnStage & {
          opacity: 1;
          transform: translateX(0);
          transition: opacity 600ms var(--delay, 0) cubic-bezier(0.0, 0.0, 0.2, 1),
            transform 600ms var(--delay, 0) cubic-bezier(0.0, 0.0, 0.2, 1);
        }

        /* TODO/OPTIMIZE - Why each item consumes 1Mb GPU memory? */
        /* .isOnView & {} */

        $cards: 4;
        $off: calc(((100vw - $cardW + $cardOffset) / 2) / $cards); /* holy moly */

        &::before {
          content: '';
          width: calc(100% + $off * $cards);
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background-color: var(--bg_1);
          z-index: -2;
          transform: translateX(calc($off * ($cards * -1) + $off * var(--i)));
          box-shadow: 0.2rem 0.2rem var(--primary_1_lighter);
        }
        

        &:nth-child(1) { --i: 1; --delay: $delayIn2; }
        &:nth-child(2) { --i: 2; --delay: calc($delayIn2 + 200ms); }
        &:nth-child(3) { --i: 3; --delay: calc($delayIn2 + 400ms); }
        &:nth-child(4) { --i: 4; --delay: calc($delayIn2 + 600ms); }
      }
    }

    .title {
      font-size: $font-L2;
      margin-bottom: $spacer-M;
    }

    .date {
      flex-shrink: 0;
      left: auto;
      margin-left: calc($spacer-L * -3);
      margin-top: -2rem; /* REVIEW - by eye */
    }

    .place {
      &List {
        flex-direction: row;
      }

      &Item {
        &:not(:last-child) {
          margin: 0 $spacer-L 0 0;
        }
      }
    }
  }
</style>

<section class="wrapper"
  class:isOnStage
  class:isOnView
  id="words"
  data-section-offset="50">
  <div class="content">
    <header class="header">
      <h2 class="f-mono headerTitle" data-io="heading" aria-label="She has been sharing">
        <span class="headerTitle-part">She has been</span>
        <span
          class="headerTitle-part"
          data-text={ledText}
          style="--led-color: {ledColor}">
          {ledText}
        </span>
      </h2>
      <p class="headerDescription">Something sweet and short about this.</p>
    </header>
    <ul class="cardList u-carousel" aria-label="articles, talks and more">
      {#each words as { title, date, places }, index}
        <li
          class="cardItem">
          <h3 class="f-mono title">{title}</h3>
          <span class="date">
            <span class="sr-only">Date:</span> {date}
          </span>
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
        </li>
      {/each}
    </ul>
  </div>
</section>
