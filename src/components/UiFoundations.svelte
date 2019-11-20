<script>

</script>

<style global>
  :root {
    --text_0: #efefef;
    --text_1: #b7c2cf; /* text over bg with 0.6 opacity and some light... */
    --text_invert: #1a2e45; /* similar to bg but lighter */
    --bg: #0d1722;
    --bg-invert: var(--text_0);
    --primary_1: #65bd90; /* #fb6177; */
    --primary_1b: #2b6145;
    --primary_1alpha: #65bd9017;
    --primary_2: var(--primary_1); /* #835bfa; */
    --primary_3: var(--primary_1); /* #fff5a2; */
    --primary_3_darker: var(--primary_1); /* #dfb948; */
    --primary_4: var(--primary_1); /* #1abba6; */
    --font-M: 1.6rem;
    --font-L: 1.8rem;
    --font-XL: 2.6rem;
    --font-heading_1: 8rem;
    --font-heading_2: 6rem;
    --spacer-S: 0.8rem;
    --spacer-M: 1.6rem;
    --spacer-L: 3.2rem;
    --spacer-XL: 6.4rem;
    --bounce: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @font-face {
    font-family: 'PFDin', 'monospace';
    src: url('fonts/PFDin_Mono_Bold.ttf') format('truetype');
  }

  html {
    font-size: 62.5%; /* 1rem = 10px */
    box-sizing: border-box;
    font-family: 'PT Sans', sans-serif;

    * {
      box-sizing: inherit;
    }
  }

  body {
    background: var(--bg);
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
    font-family: 'PFDin', monospace;
    line-height: 1.2;
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
      top: 0.05em;
      left: -0.05em;
      color: var(--bg);
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
    &-1 {
      .uAppear & {
        transition-delay: 150ms;
      }
    }

    &-2 {
      .uAppear & {
        transition-delay: 300ms;
      }
    }

    &-3 {
      .uAppear & {
        transition-delay: 450ms;
      }
    }

    &-4 {
      .uAppear & {
        transition-delay: 600ms;
      }
    }

    &-5 {
      .uAppear & {
        transition-delay: 750ms;
      }
    }

    &-6 {
      .uAppear & {
        transition-delay: 800ms;
      }
    }
  }

  @keyframes laserOn {
    0%, 85% {opacity: 0;}
    87% {opacity: 1;}
    88% {opacity: 0;}
    89% {opacity: 1;}
    92% {opacity: 0;}
    91% {opacity: 1;}
    90%, 100% {opacity: 1;}
  }
</style>

<span />
