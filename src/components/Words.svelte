<script>
  import { onMount } from 'svelte';
  import words from '../data/words.js';

  const colorTypes = {
    article: 'var(--primary_1)',
    talk: 'var(--primary_2)',
    zine: 'var(--primary_3_darker)',
    default: 'var(--primary_4)',
  };
  let elWrapper;
  let isExpanded = false;
  let isVisible = false;
  $: cards = isExpanded ? words : words.slice(0, 4);

  onMount(() => {
    setTimeout(() => {
      // window.scroll(0, 8600); // easier debug
      initAnimation();
    }, 250);
  });

  function initAnimation() {
    const watchContainer = ([entry]) => {
      isVisible = entry.isIntersecting;
    };

    const observer = new IntersectionObserver(watchContainer, {
      rootMargin: '-50%',
      threshold: 0,
    });

    observer.observe(elWrapper);
  }

  function toggleCards() {
    isExpanded = !isExpanded;
  }
</script>

<style>
  .wrapper {
    max-width: 100rem;
    margin: 0 auto;
    padding: 0 var(--spacer-M);
    min-height: 100vh;
  }

  .heading {
    position: relative;
    font-size: var(--font-heading_2);
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
  }

  .card {
    &List {
      display: flex;
      flex-wrap: wrap;
      margin-top: var(--spacer-XL);
    }

    &Item {
      --gutter: var(--spacer-M);

      position: relative;
      color: var(--text_invert);
      width: calc(50% - var(--gutter));
      margin-bottom: var(--spacer-L);
      padding: var(--spacer-L);
      transition: transform 75ms ease-out;

      &:nth-child(2n + 1) {
        margin-right: var(--gutter);
      }

      &:nth-child(2n) {
        margin-left: var(--gutter);
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
        background-color: var(--bg-invert);
      }

      &::after {
        z-index: -2;
        box-sizing: border-box;
        border: 1px solid var(--place-color);
        transition: transform 75ms ease-in-out;
      }

      &:hover,
      &:focus-within {
        transform: translate(1rem, -1rem);

        &,
        &::after {
          transition-timing-function: ease-in-out;
          transition-duration: 250ms; /* TODO speed scale */
        }

        &::after {
          transform: translate(-1rem, 1rem);
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
        z-index: -1;
        opacity: 0.2;
        border: 0 solid var(--bg-invert);
        box-sizing: border-box;
        border-width: 0.2em 0 0.2em 0;
        transform: scale(0, 1);
        transition: transform 75ms ease-out;
        transform-origin: 0 0;
      }

      &:hover,
      &:focus {
        outline: none;

        &::before {
          transition-duration: 250ms; /* TODO speed scale */
          transform: scale(1);
        }
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
  }
</style>

<section
  class="wrapper"
  class:uAppear={isVisible}
  class:uAppearSoon={!isVisible}
  bind:this={elWrapper}>
  <h2 class="f-mono heading uAppear-0">
    <!-- <span class="headingShadow">When in the vibe</span> -->
    She enjoys to
    <span class="f-led" data-text="share" style="--led-color: var(--primary_1)">share</span>
    ideas
  </h2>

  <div class="cardList">
    {#each cards as { title, places }, index}
      <article
        class="cardItem uAppear-{index + 1}"
        style="--place-color: {colorTypes[places[0].type] || colorTypes.default}">
        <h3 class="f-mono title">{title}</h3>
        <ul class="placeList">
          {#each places as { type, where, link }}
            <li class="placeItem" style="--place-color: {colorTypes[type] || colorTypes.default}">
              <a href={link} class="placeLink" target="blank">
                <span class="placeType">{type}</span>
                <span>&nbsp;— {where}</span>
              </a>
            </li>
          {/each}
        </ul>
      </article>
    {/each}
  </div>
  <button class="f-mono cta" on:click={toggleCards}>{isExpanded ? 'Hide' : 'Explore all'}</button>
</section>
