<script>
  import { onMount, afterUpdate } from 'svelte';
  import words from '../data/words.js';
  import { sendGA } from '../utils';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';
  const options = ['sharing', 'writing', 'talking'];
  const ledText = options[0];
  let isOnStage = false; // on viewport or passed the viewport

  afterGeneralUpdate((prevState, state) => {
    const thisSectionIndex = state.pageSections.indexOf('words');
    const currentSectionIndex = state.pageSections.indexOf(state.pageCurrentSection);

    if (!isOnStage && currentSectionIndex >= thisSectionIndex) {
      isOnStage = true;
    }

    if (isOnStage && currentSectionIndex < thisSectionIndex) {
      isOnStage = false;
    }
  });
</script>

<style>
  @define-mixin motionDefault { :global(.jsMotionDefault) & { @mixin-content; } }
  @define-mixin motionReduced { :global(.jsMotionReduced) & { @mixin-content; } }

  $headingWidth: 24rem; /* static content luxuries */
  $delayIn0: 200ms;
  $delayIn1: 400ms;
  $delayIn2: 600ms;
  $delayIn3: 750ms;

  .header {
    padding: 0 $layout-margin;

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
        @mixin motionReduced {
          padding-bottom: 25vh;
        }

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
      border-radius: 0.3rem;

      @media (--max-xs) {
        padding: $spacer-LM $spacer-M $spacer-L;
        max-width: 72vw; /* so next card is visible */
      }

      @media (--max-md) {
        box-shadow: 0.2rem 0.2rem var(--primary_1_smooth);
      }

      &:not(:last-child) {
        margin: 0 $spacer-L 0 0;
      }
    }
  }

  @media (--max-md) {
    .header {
      @mixin motionDefault {
        opacity: 0;
        transform: translateY(3rem);
        transition: opacity 300ms ease-out, transform 300ms ease-out;
      }

      .isOnStage & {
        @mixin motionDefault {
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 1500ms cubic-bezier(0.0, 0.0, 0.2, 1),
            transform 1000ms cubic-bezier(0.19, 1, 0.22, 1);
        }
      }
    }

    .cardItem:nth-child(1),
    .cardItem:nth-child(2) {
      @mixin motionDefault {
        opacity: 0;
        transform: translateX(50%);
        transition: opacity 150ms ease-out, transform 150ms ease-out;
      }

      .isOnStage & {
        @mixin motionDefault {
          opacity: 1;
          transform: translateX(0);
          transition:
            opacity 2000ms cubic-bezier(0.0, 0.0, 0.2, 1),
            transform 2000ms cubic-bezier(0.19, 1, 0.22, 1);
        }
      }
    }
  }

  .title {
    position: relative; /* appear above ::before */
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

    @media (--max-xs) {
      top: $spacer-MS;
      max-width: 72vw; /* so next card is visible */
    }
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
      position: relative; /* appear above ::before */
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
      background-color: var(--bg_0);
      overflow: hidden; /* avoid scroll on safari */

      @mixin motionDefault {
        opacity: 0;
        transition: opacity 150ms ease-out;
      }

      &.isOnStage {
        @mixin motionDefault {
          transition: opacity 500ms;
          opacity: 1;
        }
      }
    }

    .content {
      position: relative;
      padding: 0 0 $spacer-XL;

      @mixin motionDefault {
        padding-top: 75vh;
        background-color: var(--bg_0);
      }

      @mixin motionReduced {
        padding-top: 25vh;
        padding-bottom: 25vh;
      }
    }

    .header {
      padding: 0 $spacer-M;
      margin-bottom: calc($spacer-M * 3);

      @mixin motionDefault {
        opacity: 0;
        transition: opacity 150ms 0ms ease-out;
      }

      .isOnStage & {
        @mixin motionDefault {
          opacity: 1;
          transition: opacity 500ms $delayIn0 cubic-bezier(0.0, 0.0, 0.2, 1);
        }
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

        @mixin motionDefault {
          opacity: 0;
          transition:
            opacity 150ms 0ms ease-out,
            transform 150ms ease-out;
          transform: translateX(20rem);
        }

        .isOnStage & {
          @mixin motionDefault {
            opacity: 1;
            transform: translateX(0);
            transition: opacity 600ms var(--delay, 0) cubic-bezier(0.0, 0.0, 0.2, 1),
              transform 600ms var(--delay, 0) cubic-bezier(0.0, 0.0, 0.2, 1);
          }
        }

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
          transform: translateX(calc($off * ($cards * -1) + $off * var(--i)));
          box-shadow: 0.2rem 0.2rem var(--primary_1_smooth);
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
      margin-left: calc($spacer-M * -5);
      margin-top: -2rem;
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
  id="words" tabindex="-1"
  data-section-offset-v="40"
  data-section-offset-h="50">
  <div class="content">
    <header class="header">
      <h2 class="f-title headerTitle" data-io="heading">
        <span class="headerTitle-part">I've been</span>
        <span
          class="headerTitle-part">
          {ledText}
        </span>
      </h2>
      <p class="headerDescription">As a self-taught developer, giving back to the community is a joy!</p>
    </header>
    <ul class="cardList u-carousel">
      {#each words as { title, date, places }, index}
        <li
          class="cardItem">
          <h3 class="f-title title">{title}</h3>
          <span class="date">
            <span class="sr-only">Date:</span> {date}
          </span>
          <ul class="placeList">
            {#each places as { type, where, link, svg, id }}
              <li class="placeItem">
                <span class="placeType">{type}</span>
                <div class="placeLink">
                  <svg aria-hidden="true" class="placeIcon {svg} u-svg" style="display: none;">
                    <use xlink:href="#{svg}" />
                  </svg>
                  <a href={link} target="_blank"
                    class="u-link"
                    on:click={() => sendGA('send', 'event', 'click_words', id)}>
                    {where}
                  </a>
                </div>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  </div>
</section>
