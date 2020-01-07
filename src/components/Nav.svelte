<script>
  import { afterUpdate } from 'svelte';
  import Contacts from './Contacts.svelte';
  import { strGeneral, updateGeneral, afterGeneralUpdate } from '../stores/general.js';

  $: current = $strGeneral.pageCurrentSection;
  let pageSections = $strGeneral.pageSections;
  let pageEls;
  let wasSelected = null; // when the link is clicked, trigger the fancyBubble

  afterGeneralUpdate((prevState, state) => {
    const prevPageSection = prevState.pageCurrentSection;
    const pageSection = state.pageCurrentSection;

    if (prevPageSection !== pageSection) {
      console.log('pageSection changed:', pageSection);
      // history.pushState(null, null, `#${pageSection}`); // ANALYZE - Do I want/need this?
      setTimeout(() => {
        wasSelected = null;
      }, 500); // wait for fancyBubble to end
    }
  });

  function goToSection(e, pageSection) {
    e.preventDefault();

    if (pageSection === current) {
      return false;
    }

    console.log('pageSection changing to:', pageSection);

    const pivot = pivots.find(p => p.name === pageSection).y;
    const to = pageSection !== 'intro' ? pivot : 0;

    wasSelected = pageSection;

    setTimeout(() => {
      console.log('scrolled by click', Date.now());
      // NOTE: Make sure to call scrollTo before updateGeneral,
      // so all sections read currectly the current scrollY
      window.scrollTo(0, to);
      updateGeneral({ pageCurrentSection: pageSection });
      // TODO - handle a11y focus
    }, 500); // eye picked value, ~ middle of "fancyBubble"
  }

  export let pivots;
</script>

<style>
  $gutter: 2rem;

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    z-index: 5; /* above everything */
  }

  .links {
    &List {
      position: absolute;
      top: $gutter;
      left: calc($gutter * 2);
      display: flex;
      margin: 0;
      padding: 0;
      font-size: var(--font-M);

      @media (height > 42em) {
        /* TODO review @media */
        flex-direction: column;
      }
    }

    &Item {
      margin: 0;
      padding: 0;
      margin: 0 2rem 0 0;
      padding: 0.5rem 0;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: -50vw;
        left: -50vw;
        width: 200vw;
        height: 200vw;
        display: block;
        border-radius: 50%;
        transform: scale(0);
        transform-origin: 25% 25%;
        box-sizing: border-box;
        z-index: -1;
      }

      &::before {
        background: var(--morph_total);
      }

      &::after {
        background: var(--bg_0);
      }

      &.isCurrent {
        @for $i from 1 to 4 {
          &:nth-child($i) {
            ~ .decorative {
              transform: translateY(calc($i * 1.62em));
            }
          }
        }
      }

      &.wasSelected {
        &::before,
        &::after {
          animation: fancyBubble 850ms ease-out;
        }

        &::after {
          animation-duration: 1100ms;
        }
      }
    }

    &Anchor {
      display: inline-block;
      text-decoration: none;
      color: var(--text_1);

      &:hover,
      &:focus,
      &[aria-current='true'] {
        color: var(--primary_1);
      }
    }
  }

  .decorative {
    position: absolute;
    left: calc($gutter * -1);
    top: -0.75em;
    width: 1.5rem;
    border-bottom: 1px solid var(--text_0);
    transition: transform 250ms ease;
  }

  :global(.g-contacts) {
    position: absolute;
    bottom: $gutter;
    left: $gutter;
    width: 100%;
    white-space: nowrap;
    opacity: 0;
    animation: laserOn 750ms calc(600ms + 50ms * 14) steps(8) forwards;
  }

  @keyframes fancyBubble {
    0% {
      transform: scale(0);
    }
    75% {
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
</style>

<!-- TODO: Animate this -->
<nav class="nav">
  <ul class="linksList">
    {#each pageSections as name}
      <li
        class="linksItem"
        class:isCurrent={current === name}
        class:wasSelected={wasSelected === name}>
        <a
          href="#{name}"
          class="linksAnchor u-linkInteract"
          aria-current={current === name}
          on:click={e => goToSection(e, name)}>
          {name}
        </a>
      </li>
    {/each}
    <li class="decorative" aria-hidden="true" />
  </ul>

  <Contacts class="g-contacts" />
</nav>
