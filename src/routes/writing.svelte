<script>
  import { onMount } from 'svelte';

  import HeadMeta from '../components/HeadMeta.svelte';
  import ToggleTheme from '../components/navigation/ToggleTheme.svelte';
  import WordsList from '../components/words/WordsList.svelte'
  import SnippetsList from '../components/words/SnippetsList.svelte'

  import Footer from '../components/Footer.svelte';

  import { initResponsive } from '../stores/responsive.js';
  import { focusOnlyWhenNeeded } from '../utils';
  import { TWITTER_URL, SITE_URL, SMASHING_URL, CSSTRICKS_URL } from '../data/misc.js';
  import words from '../data/words.js';
  import snippets from '../data/snippets.js';

  import { sendTrack } from '../utils/analytics';

  onMount(async () => {
    initResponsive();
    focusOnlyWhenNeeded();
  });

  function trackClick(action) {
    sendTrack('click_writing', action)
  }
</script>

<style lang="postcss">
  $ziHeader: 3;
  $ziIntro: 4;
  $ziLine: 2;
  $ziContent: 1; /* need to be above footer */
  $width: 780px;

  .header {
    position: fixed;
    top: 0;
    width: $width;
    max-width: 100%;
    left: 50%;
    transform: translateX(-50%);
    z-index: $ziHeader;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacer-M;
  }

  .wrapper {
    margin: 0 auto;
    max-width: $width;
    padding: $spacer-L $spacer-M;

    @media (--md) {
      font-size: $font-L;
    }
  }

  .title {
    font-size: $font-heading_3;
    margin: $spacer-XL 0 $spacer-S;
    color: var(--text_0);

    @media (--max-md) {
      font-size: calc($font-heading_3 * 0.7);
    }
  }

  .h2 {
    font-size: $font-XL;
    font-weight: 500;
    margin-bottom: 0;

    @media (--max-md) {
      font-size: calc($font-L * 0.7);
    }
  }

  .kicker {
    color: var(--primary_1);
    margin-top: $spacer-M;
    margin-bottom: $spacer-L;
  }

  .intro {
    position: relative;
    max-width: 520px;
    margin: 0 auto;
    z-index: $ziIntro;
  }

  .separator {
    display: block;
    width: 100vw;
    height: 170px;
    
    /* To match header pixel perfect */
    position: sticky;
    top: -90px;
    z-index: $ziLine;

    background: linear-gradient(to top, rgba(var(--bg_1_rgb),1) 0%, rgba(var(--bg_1_rgb),0) 100%);
    margin-top: calc($spacer-LM * -2.5);
    margin-left: calc((100vw - 100%) / -2);
  }

  .content {
    position: relative;
    z-index: $ziContent;
    padding-top: $spacer-M;

    @media (--md) {
      padding-top: calc($spacer-LM * 1.5);
    }
  }

  .p {
    margin: $spacer-M 0;
  }

  .pupas {
    margin-top: $spacer-XL;
    margin-bottom: $spacer-L;
  }

  .footerArea {
    /* IMPROVE Hardcoded from footer */
    margin-top: -5rem;
    
    @media (--md) {
      margin-top: -40vh;
    }
  }
</style>

<HeadMeta
  site={`${SITE_URL}/workshop-a11y`}
  title="Writing | Sandrina Pereira"
  description="Code explained through human words"
  coverUrl={`${SITE_URL}/cover_light-2.png`} />

<header class="header">
  <a href={SITE_URL} class="u-logo">
    Sandrina
  </a>
  <ToggleTheme klass="toggleTheme" />
</header>

<main class="wrapper">
  <div class="intro">
    <h1 class="f-title title">Casual writings</h1>
    
    <p class="p">
      From time to time, I explain code with words or doodles.
    
      All of these articles were published elsewhere. Some of them I wrote for
      <a class="u-link" rel="noreferrer" target="_blank" href={CSSTRICKS_URL} on:click={() => trackClick('csstricks_journey')}>CSS-Tricks</a> 
      and
      <a class="u-link" rel="noreferrer" href={SMASHING_URL} target="_blank" on:click={() => trackClick('smashing_journey')}>Smashing Magazine</a>.
    </p>
    <p class="kicker">Solving problems is cool, but explaining the path to the solution is when the insights happen.</p>
  </div>

  <div class="separator"></div>

  <div class="content">
    <h2 class="sr-only">Articles</h2>
    <WordsList list={words} variant="plain" isOnStage />
    
    <div class="pupas">
      <h2 class="h2">Code Pupas</h2>
      <p>These are tiny demos where I explored something, but without many words explaining it.</p>
      <p>If the articles above were butterflies, these ones would be pupas.</p>
    </div>
    <SnippetsList list={snippets} />
</div>

</main>

<div class="footerArea">
  <!-- TODO/A11Y support reduced motion -->
  <Footer isSolo />
</div>
