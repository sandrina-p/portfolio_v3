<script>
  import { sendTrack } from '../../utils/analytics';

  export let list;
  export let isOnStage;
  export let variant; // plain | promoted
</script>

<style lang="postcss">
  /* REFACTOR. Location of modifiers as-plain as-promoted
   is not the best... */
  @define-mixin motionDefault { :global(.jsMotionDefault) & { @mixin-content; } }
  @define-mixin motionReduced { :global(.jsMotionReduced) & { @mixin-content; } }

  $delayIn1: 400ms; /* +200ms than title on Words.svelte */
  $delayIn2: 600ms;
  $delayIn3: 750ms;

  .card {
    &List {
      padding: $spacer-L $layout-margin;
      align-items: stretch;

      @media (--max-lg) {
        @mixin motionReduced {
          padding-bottom: var(--words-spce-bottom, 25vh);
        }

        .as-promoted&{
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
    }
    
    &Item {
      position: relative;
      padding: $spacer-XL $spacer-L $spacer-LM;
      background-color: var(--bg_1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-shrink: 0;
      scroll-snap-align: center;
      border-radius: 0.3rem;
      box-shadow: 0.2rem 0.2rem var(--primary_1_smooth);

      &:not(:last-child) {
        margin: 0 0 $spacer-M;
      }

      .as-promoted & {
        width: 26rem;

        @media (--max-xs) {
          padding: $spacer-LM $spacer-M $spacer-L;
          max-width: 72vw; /* so next card is visible */
        }

        &:not(:last-child) {
          margin: 0 $spacer-L 0 0;
        }
      }
    }
  }

  @media (--max-lg) {
    .cardItem:nth-child(1),
    .cardItem:nth-child(2),
    .cardItem:nth-child(3) {
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

    .as-plain {
      &.cardList {
        padding: 0;
      }

      .cardItem {
        padding: $spacer-M;
        margin: $spacer-M 0;
      }

      .date {
        position: relative;
        top: auto;
      }

      .title {
        font-size: $font-L;
        margin-bottom: $spacer-S;
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

      :global(&.bulb) {
        fill: var(--text_0);
        height: 1.8rem;
        transform: translateY(3px);
      }
    }
  }
  

  @media (--lg) {
    .card {
      &List {
        padding: 0;
      }

      &Item {
        padding: $spacer-MS $spacer-M $spacer-M;
        justify-content: flex-start;

        .as-promoted & {
          &:not(:last-child) {
            margin: 0 0 $spacer-M;
          }
        }
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
      margin-top: calc($spacer-M * -1 + 0.2em);
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

    .as-promoted {
      $cardW: 90rem;
      $cardOffset: 9rem;

      &.cardList {
        margin-left: calc($cardOffset * -1);
      }

      .cardItem {
        padding-left: calc($cardOffset + $spacer-M);
        width: $cardW;

        @mixin motionDefault {
          opacity: 0;
          transition:
            opacity 150ms 0ms ease-out,
            transform 150ms ease-out;
          transform: translateX(20rem);
        }

        .isOnStage& {
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
          border-radius: 0.3rem;
          transform: translateX(calc($off * ($cards * -1) + $off * var(--i)));
          box-shadow: 0.2rem 0.2rem var(--primary_1_smooth);
        }
        
        &:nth-child(1) { --i: 1; --delay: $delayIn2; }
        &:nth-child(2) { --i: 2; --delay: calc($delayIn2 + 200ms); }
        &:nth-child(3) { --i: 3; --delay: calc($delayIn2 + 400ms); }
        &:nth-child(4) { --i: 4; --delay: calc($delayIn2 + 600ms); }
      }
    }
  }
</style>

<ul class="cardList as-{variant} {variant === 'promoted' ? 'u-carousel' : ''}"
  class:isOnStage
  data-cy="cards"
>
  {#each list as { title, date, places }, index}
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
              <a href={link} rel="noreferrer" target="_blank"
                class="u-link"
                on:click={() => sendTrack('click_words', id)}>
                <span class="placeLinkWhere">{where}</span>
              </a>
            </div>
          </li>
        {/each}
      </ul>
    </li>
  {/each}
</ul>