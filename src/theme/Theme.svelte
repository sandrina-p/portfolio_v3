<style global>
  :root {
    --w-height: 100vw; /* JS will change this */

    --text_0: #343434;
    --text_1: #757575;
    --text_invert: #d6d6d6; /* similar to bg but lighter */
    --bg_0: #f8f3ef;
    --bg_1: #fff;
    --bg_invert: #2e2a2f; /* #same as .dark bg_1; */
    --bg_invert_transparent: #2e2a2f00; /* for safari... */

    --primary_1: #9b78de;
    --primary_1_smooth: #e9e1f8;
    --primary_1_sat: #bd99ff;
    --primary_1_stronger: #8c00ff;
    --morph_color: rgba(109, 7, 255, 0.1);
    --morph_total: #bfa1f8; /* visual effect when all circles are overlapping */
    --primary_2: #52e9d0;
    --primary_3: #dfb948;
    --primary_4: #ff9d9d;
  }

  body {
    transition: color 0.2s ease-out, background-color 0.2s ease-out;
  }

  body.dark {
    --text_0: #e2e2e2;
    --text_1: #8a8a8a;
    --text_invert: #343434; /* same as defautl text_0*/
    --bg_0: #424043;
    --bg_1: #2e2a2f;
    --primary_1: #9f76ff; /* slightly brigter */
    --primary_1_smooth: #2e262f; /* REVIEW better name */
    --morph_color: rgba(202, 152, 255, 0.15);
    --morph_total: #9176af;
  }

  /* ************************************ */

  html {
    font-size: 62.5%; /* 1rem = 10px */
  }

  body {
    background-color: var(--bg_0);
    color: var(--text_0);
    
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: $font-M;
    line-height: 1.5;
    font-weight: 300;
    letter-spacing: 0.02em; /* visually better */

    /* avoid horizonal scroll when scrollbar is visible */
    width: 100vw;
    max-width: 100%;
    overflow-x: hidden;

    box-sizing: border-box;
    * { box-sizing: inherit; }
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

  /** Font related **/

  .f-mono {
    /* font-family: 'Libre Baskerville', serif; */
    line-height: 1.2;
    font-weight: 500;
  }

  .f-bold {
    font-weight: 500;
  }

  /* The outline offseted effect */
  .f-led {
    position: relative;
    display: inline-block;

    &::before {
      content: attr(data-text);
      position: absolute;
      -webkit-text-stroke: 2px var(--led-color);
      z-index: -1;
      top: 0.03em;
      left: -0.03em;
      color: var(--bg_0);
    }
  }

  /* Animation to show up... */
  .uAppear {
    &-0,
    &-1,
    &-2,
    &-3,
    &-4,
    &-5 {
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

    /* OPTIMIZE - Use variables instead! */
    &-0 {
      .uAppear & {
        transition-delay: 100ms;
      }
    }

    &-3 {
      .uAppear & {
        transition-delay: 200ms;
      }
    }
  }

  .u-link,
  .u-linkInteract {
    position: relative;
    white-space: nowrap;
    color: inherit;
    z-index: 0; /* so before gets behind but visible */

    &::before {
      content: '';
      position: absolute;
      bottom: 0.05em;
      left: -0.1em;
      width: calc(100% + 0.2em);
      height: 1.2em;
      background-color: var(--primary_1);
      opacity: 0.2;
      transform: scale(1, 0);
      transition: transform 75ms ease-out;
      transform-origin: 0 100%;
      z-index: -1;
    }

    &:hover,
    &:focus {
      outline: none;

      &::before {
        transition-duration: 250ms ease-in-out;
        transform: scale(1, 1);
      }
    }

    &:focus::before {
      opacity: 0.4;
    }

    /* &.invert {
      color: var(--text_invert);
    } */
  }

  .u-linkInteract {
    text-decoration: none;

    &[aria-current='true']::before {
      transform: scale(1, 0.3);
    }
  }

  .u-link {
    text-decoration: underline;
    text-decoration-color: var(--primary_1);

    &::before {
      transform: scale(1, 0.3);
    }
  }

  
  .u-carousel { /* only mobile REVIEW - should delete this? */
    @media (--max-md) {
      width: 100vw;
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      scroll-snap-type: x mandatory;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
    }
  }

  .u-carousel-item {
    position: relative;
    flex-shrink: 0;
    scroll-snap-align: center;
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
</style>