<script>
  import HeadMeta from '../components/HeadMeta.svelte';
  import ToggleTheme from '../components/navigation/ToggleTheme.svelte';
  import Nav from '../components/navigation/Nav.svelte';
  import Contacts from '../components/Contacts.svelte';
  import { TWITTER_URL, SITE_URL } from '../data/misc.js';
  import WorkshopForm from '../components/WorkshopForm.svelte';

  const endpointTesting = 'https://app.convertkit.com/forms/2045201/subscriptions'
  const endpointA11Y = 'https://app.convertkit.com/forms/1318242/subscriptions'
</script>

<style>
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
  site={ `${SITE_URL}/workshop-a11y-fundamentals` }
  title="Web Accessibility Fundamentals - Workshop"
  description="In this workshop we'll explore every common accessibility no-nos and learn how to make them work properly for everyone using a mouse or a keyboard."
  coverUrl={ `${SITE_URL}/cover_a11y_tba.png` }
/>

<svelte:head>
<script type="application/ld+json">[
{
  "@context": "http://schema.org",
  "@type": "WebSite",
  "url": "https://sandrina-p.net/workshop-a11y-fundamentals",
  "name": "Web Accessibility Fundamentals - Workshop",
  "alternateName": "A11Y Fundamentals"
}, {
  "@context": "http://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "item": {
      "@id": "https://sandrina-p.net/workshop-a11y-fundamentals",
      "name": "Web Accessibility Fundamentals - Workshop",
      "image": "https://sandrina-p.net/cover_a11y_tba.png"
    }
  }]
},
{
  "@context": "http://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://sandrina-p.net/workshop-a11y-fundamentals"
  },
  "headline": "Web Accessibility Fundamentals - Workshop",
  "image": {
    "@type": "ImageObject",
    "url": "https://sandrina-p.net/cover_a11y_tba.png",
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
  "description": "In this workshop we'll explore every common web accessibility no-nos and learn how to make them work properly for everyone using a mouse or a keyboard."
}
 ]</script>
</svelte:head>

<header class="header">
  <ToggleTheme klass="toggleTheme" />
  <!-- <Nav on:calculated={() => true} horizonSpace="10000" /> -->
</header>

<main class="wrapper">
<h1 class="f-title title">Web Accessibility Fundamentals</h1>
<p class="rw">Remote Workshop <span class="rw-d">•</span> <span class="rw-t">6-8 Hours</span></p>

<p class="f-title subtitle hithere">The web is awesome and everyone should be able to enjoy it.</p>

<p class="p">
  Hi there, I'm <a href={ SITE_URL } rel="noreferrer" class="u-link">Sandrina Pereira</a> and I believe that making the web accessible is our duty as web developers.
</p>

<p class="p">
  This workshop will be packed with little big discoveries!
  We will explore every common accessibility no-nos and how to make them inclusive for as many people as possible using a mouse or a keyboard.
</p>
<p class="p">
  We'll cover multiple design patterns and development techniques that you can apply in your own projects right away.
</p>
<p class="p">
  Additional, you'll learn how to use a screen reader, and I'll show you that there's no reason to be afraid of using it!
</p>
<br/>
<!-- If you want to build inclusive applications, as a developer or designer, then this workshop is for you! -->
<p class="p">
  By the end of the workshop, you will: 
</p>
<ul class="list as-check">
  <li>Understand why web accessibility matters;</li>
  <li>Be able to identify accessibility issues;</li>
  <li>Know how to build accessible web pages;</li>
  <li>Know how to use accessibility tools;</li>
  <li>Find out that building inclusive websites isn’t as hard as it sounds <span aria-hidden="true">;)</span></li>
</ul>


<h2 class="f-title subtitle">Topics</h2>
<ul class="list">
  <li>Accessibility Overview: guidelines and myths;</li>
  <li>Common accessibility no-nos;</li>
  <li>Semantic markup;</li>
  <li>Keyboard navigation;</li>
  <li>Screen readers;</li>
  <li>ARIA attributes;</li>
  <li>Accessibility debugging tools;</li>
  <li>Whatever question you have!</li>
</ul>

<h2 class="f-title subtitle">Pre-requisites</h2>

<ul class="list">
  <li>Understanding of HTML and CSS (Javascript is a bonus);</li>
  <li>A modern browser installed: Chrome or Firefox are recommended;</li>
  <li>Have good internet connection for the video call;</li>
  <li>Be willing to learn something different!</li>
</ul>

<h2 class="f-title subtitle">Experience level</h2>

<p class="p">
  The content will be explained with beginners in mind. Even if you already have some experience, you can look at this workshop as a way to solidify your knowledge and fill any existing gap.
</p>


<WorkshopForm formEndpoint={endpointA11Y} />

</main>

<footer class="footer">
  <p>Made without coffee by <a class="u-link" href={ SITE_URL } rel="noreferrer">Sandrina Pereira</a>.</p>
  <Contacts />
</footer>



