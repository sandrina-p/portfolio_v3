<script>
  import HeadMeta from '../components/HeadMeta.svelte';
  import ToggleTheme from '../components/navigation/ToggleTheme.svelte';
  import Nav from '../components/navigation/Nav.svelte';
  import Contacts from '../components/Contacts.svelte';
  import { TWITTER_URL, SITE_URL } from '../data/misc.js';
  import WorkshopForm from '../components/workshop/WorkshopForm.svelte';

  const endpointTesting = 'https://app.convertkit.com/forms/2045201/subscriptions'
</script>

<style lang="postcss">
  /* TODO/REFACTOR WET same as workshop-*.svelte */
  .header {
    position: fixed;
    top: 0;
    right: 0;
    padding: $spacer-M $spacer-M 0 0;
  }

  :global(.toggleTheme) {
    z-index: 2;

    /* BUG: Somethings wrong with Safari on this page...
    The mask doesnt work. Workaround: use ::after */
    :global(.sunMoon) { display: none }

    &::after {
      content: '';
      width: 6px;
      height: 6px;
      display: block;
      background: var(--bg_0);
      position: absolute;
      top: 16px;
      right: 14px;
      transform-origin: 50% 50%;
      transform: scale(0);
      border-radius: 50%;
      transition: transform 200ms ease-out, fill 200ms ease-out;
    }

    &[aria-pressed="true"]::after {
      transform: scale(3);
    }

  }

  .wrapper {
    margin: 0 auto;
    max-width: 65rem;
    padding: $spacer-L $spacer-M;

    @media (--md) {
      font-size: $font-L;
    }
  }

  .title {
    font-size: 4rem;
    margin: $spacer-L 0 $spacer-M;

    @media(--max-xs) {
      font-size: calc(4rem * 0.7);
    }
  }

  .subtitle {
    font-size: $font-XL;
    margin: $spacer-XL 0 $spacer-M;

    &.hithere {
      margin: $spacer-L 0;
    }
  }

  .rw {
    font-size: $font-L2;
    font-weight: 500;
    color: var(--primary_1_sat);

    &-d {
      font-weight: 300;
      color: var(--text_0);
    }

    &-t {
      white-space: nowrap;
    }
  }

  .list {
    margin-left: $spacer-MS;
    list-style-type: circle;
    font-size: $font-L;
    line-height: 2;

    &.as-check {
      margin-left: 0;
      list-style: none;

      li:before {
        content: '✓';
        margin-right: $spacer-S;
      }
    }
  }

  .p {
    margin-bottom: $spacer-M;
  }

  .footer {
    text-align: center;
    padding: $spacer-L 0;
    background: var(--bg_1);

    p {
      margin-bottom: $spacer-S;
    }
  }
</style>

<HeadMeta
  site={ `${SITE_URL}/workshop-js-testing-fundamentals` }
  title="JS Testing Fundamentals - Workshop"
  description="Learn testing principles and how to apply them to React applications using Jest and Testing Library"
  coverUrl={ `${SITE_URL}/cover_jstesting_tba.png` }
/>

<svelte:head>
<script type="application/ld+json">[
{
  "@context": "http://schema.org",
  "@type": "WebSite",
  "url": "https://sandrina-p.net/workshop-js-testing-fundamentals",
  "name": "JS Testing Fundamentals - Workshop",
  "alternateName": "JS Testing Workshop"
}, {
  "@context": "http://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "item": {
      "@id": "https://sandrina-p.net/workshop-js-testing-fundamentals",
      "name": "JS Testing Fundamentals - Workshop",
      "image": "https://sandrina-p.net/cover_jstesting_tba.png"
    }
  }]
},
{
  "@context": "http://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://sandrina-p.net/workshop-js-testing-fundamentals"
  },
  "headline": "JS Testing Fundamentals - Workshop",
  "image": {
    "@type": "ImageObject",
    "url": "https://sandrina-p.net/cover_jstesting_tba.png",
    "height": 1280,
    "width": 640
  },
  "datePublished": "2020-03-23",
  "dateModified": "2020-03-23",
  "author": {
    "@type": "Person",
    "name": "Sandrina Pereira"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Sandrina Pereira",
    "logo": {
      "@type": "ImageObject",
      "url": "https://sandrina-p.net/favicon192.png",
      "width": 192,
      "height": 192
    }
  },
  "description": "In this workshop we'll learn testing principles and how to apply them to React applications using Jest and Testing Library"
}
 ]</script>
</svelte:head>

<header class="header">
  <ToggleTheme klass="toggleTheme" />
</header>

<main class="wrapper">
<h1 class="f-title title">Javascript Testing Fundamentals</h1>
<p class="rw">Remote Workshop <span class="rw-d">•</span> <span class="rw-t">8-12 Hours</span></p>

<p class="f-title subtitle hithere">Using Jest and React Testing Library</p>


<p class="p">
  Hi there, I'm <a href={ SITE_URL } rel="noreferrer" class="u-link">Sandrina Pereira</a> and I enjoy refactoring code with the confidence of not breaking my apps.
</p>

<p class="p">
  This workshop will be covering everything from testing principles to how to fully test a Javascript application built with React.
  </p>


<p class="p">
  The workshop is packed with real-world examples where we'll cover multiple testing patterns and techniques.
  You'll be ready to apply the new techniques to pretty much any testing tool or JS application project right away.
</p>

<p class="p">
  By the end of the workshop, you will be able to: 
</p>
<ul class="list as-check">
  <li>Recognise the importance of testing frameworks;</li>
  <li>Distinguish different types of tests and when to use each one;</li>
  <li>Write effective unit tests to pure modules;</li>
  <li>Write readable and consistent test descriptions;</li>
  <li>Test modules integrated with external APIs;</li>
  <li>Identify when a party dependency needs to be mocked and how to do it;</li>
  <li>Test simple React components;</li>
  <li>Test complex React components that depend on context or hooks;</li>
  <li>Know what code coverage is and how to properly use it;</li>
  <li>Level up your testings skills proficiency regardless of the tools used;</li>
  <li>Deliver code with confidence, free from critical bugs;</li>
  <li>All of this, using <a class="u-link" href="https://jestjs.io" refl="noreferrer">Jest</a> and <a class="u-link" href="https://testing-library.com/" refl="noreferrer">Testing Library</a> ecosystems</li>
</ul>


<h2 class="f-title subtitle">Topics</h2>
<ul class="list">
  <li>Testing types</li> 
  <li>TDD - Test Driven Development</li> 
  <li>BDD - Behavior Driven Development</li> 
  <li>Code coverage</li> 
  <li>Testing configurations</li> 
  <li>Assertions</li> 
  <li>Mocks</li> 
  <li>Async tests</li>
  <li>Snapshot testing</li> 
  <li>Whatever question you have!</li> 
</ul>

<h2 class="f-title subtitle">Pre-requisites</h2>

<ul class="list">
  <li>Good knowledge of Javascript, HTML and React;</li>
  <li>A computer with NodeJS and Git installed.</li>
  <li>Have good internet connection for the video call;</li>
  <li>Be willing to learn something different!</li>
</ul>

<h2 class="f-title subtitle">Experience level</h2>

<p class="p">
  The content will be explained with beginners in mind. Even if you already have some experience, you can look at this workshop as a way to solidify your knowledge and fill any existing gap.
</p>

<WorkshopForm formEndpoint={endpointTesting} />

</main>

<footer class="footer">
  <p>Made without coffee by <a class="u-link" href={ SITE_URL } rel="noreferrer">Sandrina Pereira</a>.</p>
  <Contacts />
</footer>



