<style global>

  /* OPTIMIZE: convert all colors to hsl */
  :root {
    --text_0: #343434;
    --text_1: #6f6f6f;
    --text_s: #343434; /* for bold text in dark mode only */
    --text_invert: #e2e2e2; /* similar to bg but lighter */
    --bg_0: #f8f3ef;
    --bg_1: #fff;
    --bg_1_rgb: 255,255,255;
    --bg_invert: #2e2a2f; /* #same as .dark bg_1; */
    --bg_invert_transparent: #2e2a2f00; /* for safari... */


    --primary_1: #8E38FF;
    --primary_1_smooth: #e9e1f8;
    --primary_1_highlight: #caa2ff59;
    --primary_1_inverted: hsl(266deg 100% 75%);
    --morph_color: rgba(172, 105, 255, 0.24);
    --morph_total: #c28ffc; /* visual effect when all circles are overlapping */
    --primary_1_pair: #ff7d1e;
    --primary_2: #52e9d0;
    --primary_3: #dfb948;
    --primary_4: #ff9d9d;
    --error: #d52424;
  }

  body.dark {
    --text_0: #e2e2e2; /* same as --text_invert */
    --text_1: #adadad;
    --text_s: #fff; /* for bold text */
    --text_invert: #343434; /* same as defautl text_0 */
    --bg_0: #3a383b;
    --bg_1: #2e2a2f;
    --bg_1_rgb: 46,42,47;
    --primary_1: hsl(180deg 100% 45%);
    --primary_1_smooth: hsl(180deg 100% 19%);
    --primary_1_highlight: hsl(180deg 100% 40% / 40%);
    --primary_1_pair: hsl(35deg 77% 60%);
    --morph_color: hsl(180deg 100% 40% / 20%);
    --morph_total: #139c9d; /* visual effect when all circles are overlapping */
    --error: #ff9d9d;
  }

  /* ************************************ */

  html {
    font-size: 62.5%; /* 1rem = 10px */
  }

  body {
    background-color: var(--bg_0);
    color: var(--text_0);

    &.jsMotionDefault {
      /* smooth transition between themes */
      transition: color 100ms ease-out, background-color 100ms ease-out;
    }
    
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: $font-M;
    line-height: 1.5;
    font-weight: 300;
    letter-spacing: 0.02em; /* visually better */

    /* avoid horizontal scroll when scrollbar is visible (windows) */
    width: 100vw;
    max-width: 100%;
    overflow-x: hidden;


    box-sizing: border-box;
    * { box-sizing: inherit; }
  }

  body.js-tabbing {
    a:focus,
    button:focus {
      outline: none;
      border-radius: 3px;
      box-shadow: var(--bg_0) 0 0 0 2px, var(--primary_1_pair) 0 0 0 4px;
    }
  }

  [tabindex="-1"]:focus {
    outline: none; /* it doesn't affect negatively Screen Readers */
  }

  /* ------ Text highlight ------ */
  ::selection {
    background: var(--primary_1_highlight);
  }
  ::-moz-selection {
    background: var(--primary_1_highlight);
  }

  /* ************************************ */

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  /* ****** Font related ****** */
  .f-title {
    line-height: 1.2;
    font-weight: 500;
  }

  .f-bold {
    font-weight: 500;
  }

  /* Animation to show up...
  OPTIMIZE - centralize all "fadeins" around to use a unique global class */
  .uAppear {
    &-0,
    &-1 {
      opacity: 1;
      transition: opacity 200ms ease-in;

      /* OPTIMIZE avoid this?... */
      .uAppearSoon & {
        opacity: 0;
      }

      .uAppear & {
        transition: opacity 400ms ease-in;
      }
    }

    &-0 {
      .uAppear & {
        transition-delay: 50ms;
      }
    }

    &-1 {
      .uAppear & {
        transition-delay: 200ms;
      }
    }
  }

  .u-svg {
    /* this svg have an inline display: none; so in case the page is loaded without styles
    it doesn't ruin the layout. once styles are loaded, let's make sure we render this correctly */
    display: block !important;
  }

  .u-nowrap {
    white-space: nowrap;
  }

  .u-link {
    --linkClr: var(--primary_1);
    position: relative;

    text-decoration: underline;
    text-decoration-color: var(--linkClr);
    color: inherit;
    z-index: 0; /* so before gets behind but visible */

    &:hover {
      outline: none;
    }
  
    @media (--max-lg) {
      &:hover {
        color: var(--linkClr);
      }
  
      body.js-tabbing &:focus {
        border-radius: 3px;
      }
    }

    @media (--lg) { /* keep lg so long links work on "words" section */
      white-space: nowrap;

      .jsMotionDefault &:hover,
      body.js-tabbing &:focus {
          &::before {
            transition-duration: 350ms ease-in-out;
            transform: scale(1, 1);
          }
      }

       body.js-tabbing &:focus {
        outline: none !important;
      }

      &::before {
        content: '';
        position: absolute;
        bottom: 0.05em;
        left: -0.1em;
        width: calc(100% + 0.2em);
        height: 1.2em;
        background-color: var(--linkClr);
        border-radius: 3px;
        opacity: 0.2;
        transform: scale(1, 0.2);
        transform-origin: 0 95%;
        z-index: -1;

        .jsMotionDefault & {
          transition: transform 175ms ease-out;
        }
      }
    }
  }

  .u-logo {
    position: relative;
    font-size: 2.1rem;
    text-decoration: none;
    font-weight: 500;
    color: var(--text_0);

    z-index: 0; /* so before gets behind but visible */

    &:hover {
      outline: none;
    }
  
    .jsMotionDefault &:hover,
    body.js-tabbing &:focus {
      &::before {
        transition-duration: 350ms ease-in-out;
        transform: scale(1, 1);
        opacity: 0.3;
      }
    }

    body.js-tabbing &:focus {
      outline: none !important;
    }

    &::before {
      content: '';
      position: absolute;
      bottom: 0.05em;
      left: -0.1em;
      width: calc(100% + 0.2em);
      height: 1.2em;
      background-color: var(--primary_1);
      border-radius: 3px;
      opacity: 0.5;
      transform: scale(1, 0.2);
      transform-origin: 0 85%;
      z-index: -1;

      .jsMotionDefault & {
        transition: transform 175ms ease-out;
      }
    }
  }

  .u-btnMain {
    --linkClr: var(--primary_1);
    display: inline-block;
    position: relative;
    min-width: 140px;
    text-decoration: none;
    cursor: pointer;
    border: none;
    padding: $spacer-S $spacer-MS;
    background-color: var(--primary_1);
    border-radius: 4px;
    border-color: var(--primary_1);
    font-size: $font-L;
    font-weight: 500;
    white-space: nowrap;
    text-decoration: none;
    color: #fff;

    .dark & {
      color: var(--text_invert);
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0em;
      left: 0em;
      width: 100%;
      height: 100%;
      background-color: var(--text_invert);
      border-radius: 4px;
      opacity: 0.2;
      transform: scale(1, 0);
      transform-origin: 0 100%;

      .jsMotionDefault & {
        transition: transform 175ms ease-out;
      }
    }

    &:hover,
    &:focus {
      &::after {
        transform: scale(1, 1);
      }
    }

    .jsMotionDefault &:hover,
    &:focus-visible {
      &::after {
        outline: none !important;
        transition-duration: 350ms ease-in-out;
        transform: scale(1, 1);
      }
    }
  }
  
  .u-carousel {
    @media (--max-lg) { /* only used on mobile */
      width: 100vw;
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      scroll-snap-type: x mandatory;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;

      .u-carousel-item {
        position: relative;
        flex-shrink: 0;
        scroll-snap-align: center;
      }
    }
  }

  /* -------- Animations ------------- */

  @keyframes laserOn {
    0%,
    85% {
      opacity: 0;
    }
    87% {
      opacity: 0.8;
    }
    88% {
      opacity: 0.1;
    }
    89% {
      opacity: 0.8;
    }
    92% {
      opacity: 0.2;
    }
    94%,
    100% {
      opacity: 1;
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes fadeInWithPause {
    0% {
      opacity: 0;
    }
    40%, 100% {
      opacity: 1;
    }
  }
</style>

<noscript>
  <style>
    .toggleTheme{
      display :none!important;
    }

    a:focus-visible,
    button:focus-visible {
      outline: none;
      border-radius: 3px;
      box-shadow: var(--bg_0) 0 0 0 2px, var(--primary_1_pair) 0 0 0 4px;
    }
  </style>
</noscript>