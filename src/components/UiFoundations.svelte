<script>

</script>

<style global>
  :root {
    --text_0: #f7f7f7;
    --text_1: #899bb1; /* text over bg with 0.6 opacity and some light... */
    --bg: #0d1722;
    --primary_1: #fb6177;
    --primary_2: #6e2c35;
    --font-M: 1.6rem;
    --font-L: 1.8rem;
    --font-XL: 2.6rem;
    --font-heading_1: 8rem;
    --font-heading_2: 6rem;
    --spacer-S: 0.8rem;
    --spacer-M: 1.6rem;
    --spacer-L: 3.2rem;
    --spacer-XL: 6.4rem;
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

  .f-mono {
    font-family: 'PFDin', monospace;
    line-height: 1.2;
  }
</style>

<span />
