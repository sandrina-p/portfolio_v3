<script>
  import HeadMeta from '../components/HeadMeta.svelte';
  import ToggleTheme from '../components/navigation/ToggleTheme.svelte';
  import WordsList from '../components/words/WordsList.svelte'

  import { TWITTER_URL, SITE_URL } from '../data/misc.js';
  import words from '../data/words.js';

  import { sendGA } from '../utils';
</script>

<style lang="postcss">
  .header {
    position: fixed;
    top: 0;
    right: 0;
    padding: $spacer-M $spacer-M 0 0;
  }

  .wrapper {
    margin: 0 auto;
    max-width: 800px;
    padding: $spacer-L $spacer-M;

    @media (--md) {
      font-size: $font-L;
    }
  }

  .intro {
    max-width: 600px;
    margin: 0 auto;
    padding-bottom: $spacer-L;
  }

  .title {
    font-size: 4rem;
    margin: $spacer-L 0 $spacer-M;

    @media (--max-xs) {
      font-size: calc(4rem * 0.7);
    }
  }

  .content {
    padding-bottom: $spacer-XL;
  }
</style>

<HeadMeta
  site={`${SITE_URL}/workshop-a11y-fundamentals`}
  title="Writing | Sandrina Pereira"
  description="Code explained through human words"
  coverUrl={`${SITE_URL}/cover_light-2.png`} />

<header class="header">
  <ToggleTheme klass="toggleTheme" />
</header>

<main class="wrapper">
  <div class="intro">
    <h1 class="f-title title">Casual writtings</h1>
    <p>Solving problems is cool, but explaining the path to the solution is even cooler.</p>
    
    <p class="p">
      These are some of my code discoveries explained through words.
    </p>

    <p>
      All of the content is originally published elsewhere.
    </p>
  </div>

  <!-- TODO some sparks effect / gradients? -->

  <div class="content">
    <WordsList list={words} variant="plain" />
  </div>

  <hr /> 

  [ promote workshop ?]

  <hr /> 

  [contact area ?]

  <!-- TODO: RSS? -->
</main>
