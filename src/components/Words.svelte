<script>
  import words from '../data/words.js';
  import { sendGA } from '../utils';
  import { afterGeneralUpdate } from '../stores/general.js';
  import WordsList from './words/WordsList.svelte'
  import { SITE_URL } from '../data/misc.js';
  
  let isOnStage = false; // in viewport or passed the viewport

  const wordsPromoted = words.filter(item => item.isPromoted)

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

  function trackClick(action) {
    sendGA('send', 'event', 'click', 'words', action)
  }
</script>

<style lang="postcss">
  @define-mixin motionDefault { :global(.jsMotionDefault) & { @mixin-content; } }
  @define-mixin motionReduced { :global(.jsMotionReduced) & { @mixin-content; } }

  $headingWidth: 24rem; /* static content luxuries */
  $delayIn0: 200ms;

  .wrapperW {
    --words-spce-bottom: 25vh;
  }

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

  .cta {
    margin: calc($spacer-S * -1) 0 $spacer-L 8vw;

    @mixin motionReduced {
      margin-top: calc(var(--words-spce-bottom) * -1 + $spacer-MS);
      margin-bottom: calc(var(--words-spce-bottom) * 0.5); /* REFACTOR this calc */
    }

    @mixin motionDefault {
      opacity: 0;
      transition: opacity 350ms 0ms ease-in-out;
    }

    .isOnStage & {
      @mixin motionDefault {
        opacity: 1;
        transition: opacity 500ms calc($delayIn0*3) cubic-bezier(0.0, 0.0, 0.2, 1);
      }
    }
  }

  .cta .u-link {
    display: inline-block;
    padding: $spacer-S $spacer-M;
    background: var(--bg_1);
    border-radius: 3px;
    box-shadow: 0.2rem 0.2rem var(--primary_1_smooth);
    font-weight: 500;
    text-decoration: none;
    color: var(--text_0);

    &::before {
      transform: scale(0, 1);
      bottom: 0em;
      left: 0em;
      width: 100%;
      height: 100%;
      transform-origin: 0 0;
    }

    &:hover {
      &::before {
        transform: scale(1, 1);
      }
    }
  }

  @media (--max-lg) {
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
  }  

  @media (--lg) {
    $cardW: 90rem;
    $cardOffset: 9rem;

    .wrapperW {
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

    .cta {
      margin: $spacer-M 0;

      @mixin motionReduced {
        margin: $spacer-M 0;
      }

      .isOnStage & {
        @mixin motionDefault {
          transition: opacity 500ms calc($delayIn0*8) cubic-bezier(0.0, 0.0, 0.2, 1);
        }
      }
    }
  }
</style>

<section class="wrapperW"
  class:isOnStage
  id="words" tabindex="-1"
  data-section-offset-v="40"
  data-section-offset-h="50"
  data-cy="words">
  <div class="content">
    <header class="header">
      <h2 class="f-title headerTitle" data-io="heading">
        <span class="headerTitle-part">A casual</span>
        <span class="headerTitle-part">writer</span>
      </h2>
      <p class="headerDescription">
        <!-- As a self-taught developer, giving back to the community is a joy. -->
        Solving problems is cool, but explaining the path to the solution is when the insights happen.
      </p>
    </header>
    <WordsList list={wordsPromoted} isOnStage={isOnStage} variant="promoted" />

    <div class="cta">
      <a href="{SITE_URL}/writing" class="u-link" on:click={() => trackClick('articles_all')}>Check all articles</a>
    </div>
  </div>
</section>
