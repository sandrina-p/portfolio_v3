<script>

</script>

<style global>
  :root {
    --text_0: #343434; /*#efefef */
    --text_1: #898989; /* #b7c2cf; /* text over bg with 0.6 opacity and some light... */
    --text_invert: #d6d6d6; /* similar to bg but lighter */
    --bg_0: #f4f4f4; /* #0d1722;*/
    --bg_1: #fff; /* #000000; */
    --bg_invert: #1b1b1b;

    /* put this color at meta theme-color */
    --primary_1: #9072ff; /*#52e9d0; /* #59b9a3; /* #fb6177; */
    --primary_1_darker: #8c00ff;
    --morph_color: rgba(109, 7, 255, 0.1); /*rgba(101, 189, 144, 0.09);*/
    --morph_total: #bfa1f8; /* #bbdccd; /* visual effect when all circles are overlapping */
    --primary_2: #52e9d0; /* #b69dff; */
    --primary_3: #0a0a09;
    --primary_3_darker: #dfb948;
    --primary_4: #f08e8e;

    --font-M: 1.4rem;
    --font-M: 1.6rem;
    --font-L: 1.8rem;
    --font-L2: 2.1rem;
    --font-XL: 2.6rem;
    --font-heading_0: 12rem;
    --font-heading_1: 8rem;
    --font-heading_2: 6rem;
    --font-heading_3: 5rem;

    --spacer-XS: 0.4rem;
    --spacer-S: 0.8rem;
    --spacer-M: 1.6rem;
    --spacer-L: 3.2rem;
    --spacer-XL: 6.4rem;

    --bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);

     /* --speed_0: 250ms; */ /* REVIEW - speed scale ? */
  }

  /* ************************************ */

  html {
    font-size: 62.5%; /* 1rem = 10px */
    box-sizing: border-box;
    font-family: 'Work Sans', sans-serif;
    font-weight: 300;

    * {
      box-sizing: inherit;
    }
  }

  body {
    background: var(--bg_0);
    color: var(--text_0);
    font-size: var(--font-M);
  }

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

  /** CSS UTILITIES - Font related **/

  .f-mono {
    font-family: 'Libre Baskerville', serif;
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
    text-decoration: none;

    &::before {
      content: '';
      position: absolute;
      top: 20%;
      left: -0.1em;
      width: calc(100% + 0.2em);
      height: 60%;
      background: var(--primary_1);
      opacity: 0.2;
      transform: scale(0, 1);
      transition: transform 75ms ease-out;
      transform-origin: 0 0;
      z-index: -1;
    }

    &:hover,
    &:focus {
      outline: none;

      &::before {
        transition-duration: 250ms;
        transform: scale(1);
      }
    }
  }

  .u-link {
    border-bottom: 1px dashed var(--primary_1);
    color: var(--text_0);
    /* font-weight: 500; */
  }

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

<span />
