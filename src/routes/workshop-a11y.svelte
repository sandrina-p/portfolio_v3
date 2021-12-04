<script>
  import { onMount } from 'svelte';

  import HeadMeta from '../components/HeadMeta.svelte';
  import ToggleThemePage from '../components/navigation/ToggleThemePage.svelte';
  import SvgSprite from '../components/SvgSprite.svelte';
  import Contacts from '../components/Contacts.svelte';
  import { focusOnlyWhenNeeded } from '../utils';
  import Accordion from '../components/workshop/Accordion.svelte'
  import WorkshopForm from '../components/workshop/WorkshopForm.svelte';
  import SectionSkew from '../components/SectionSkew.svelte'
  import { MENTOR_URL, TWITTER_URL, SITE_URL, EMAIL_URL_WORKSHOP } from '../data/misc.js';
  import { initResponsive } from '../stores/responsive.js';

  const ticketUrl = 'https://ti.to/sandrina-p/a11y-workshop-2022-02'
  const endpointA11Y = 'https://app.convertkit.com/forms/1318242/subscriptions';
  const urlHash = 'workshop-a11y/#wsForm' // svelte isn't cool with hashes...

  const modules = [
    {
      title: 'Accessibility overview',
      topics: [
        'Demystify accessibility myths',
        'Ableism and the disability types spectrum',
        'WCAG principles, layers of guidance, and the law'
      ],
    },
    {
      title: 'Accessible by default',
      topics: [
        'Appearance: color, proportions, and motion',
        'Semantics: Headings, images, order of content',
        'Accessibility audit tools',
      ],
    },
    {
      title: 'Keyboard navigation',
      topics: [
        'Interactive elements',
        'Hiding techniques',
        'Navigation shortcuts',
      ],
    },
    {
      title: 'Screen readers',
      topics: [
        'ARIA: How and when to use',
        'Landmarks and language',
        'Meaningful forms',
        'Interactive UI patterns',
      ],
    },
  ]

  const price = "199€" 
  const eventDate = '8-11 February 2022'
  const eventHour = `<time>15:30</time> to <time>18:00</time>`
  const eventTZ = 'UTC'

  onMount(async () => {
    initResponsive();
    focusOnlyWhenNeeded();
  });
  
  function trackClick(action) {
    sendTrack('click_workshop', action)
  }

  function handleJoinListClick() {
    trackClick('cta_sticky')
  }
</script>

<style lang="postcss">
  $ziHeader: 4;
  $ziIntro: 3;
  $ziLine: 2;
  $width: 650px;
  $widthRead: 530px;
  $widthFAQ: 95rem;

  .header {
    position: fixed;
    top: 0;
    z-index: $ziHeader;
    width: $widthRead;
    max-width: calc(100% - $spacer-M * 2);
    left: 50%;
    transform: translateX(-50%);
    z-index: $ziHeader;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacer-M 0;
  }

  .wrapper {
    position: relative;
    margin: 0 auto;
    max-width: $width;
    padding: $spacer-L $spacer-M;
    
    @media (--md) {
      font-size: $font-L;
    }

    strong {
      font-weight: 500;
      color: var(--text_s);
    }
  }

  .t-hero {
    position: relative;
    z-index: $ziIntro;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: $spacer-S;

    &Title {
    }

    &Kicker {
      display: block;
      order: -1;
      margin: $spacer-XL 0 $spacer-M;
      text-transform: uppercase;
      color: var(--text_1);
      letter-spacing: 0.2em;
      font-size: $font-S;
    }

    &Mantra {
      max-width: 35rem;
      font-size: $font-L2;
      text-align: center;
      line-height: 1.3;
      margin-top: $spacer-S;
    }

    &About {
      margin-top: $spacer-LM;
      text-align: center;
    }

    &Creator {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: $spacer-XS;
      color: var(--text_1);

      &Pic {
        width: 2.4rem;
        height: 2.4rem;
        margin: 0 $spacer-XS;
        border-radius: 50%;
        overflow: hidden;
      }

      &Name {
        color: var(--primary_1);
        text-decoration: none;

        &::before {
          height: 1.4em;
          transform: scale(1, 0);
          transform-origin: 0 80%;
        }

        &:hover::before {
          transform: scale(1, 1); 
        }
      }
    }
  }

  .t-title {
    --titleSize: 3.8rem;
    font-size: var(--titleSize);
    line-height: 1.2;
    font-weight: 500;

    @media (--max-xs) {
      font-size: calc(var(--titleSize) * 0.7);
    }

    :global(.dark) & {
      color: white;
    }

    &.asH2 {
      --titleSize: 3.6rem;
      margin: $spacer-XL 0 $spacer-M;
    }

    &.asH3 {
      --titleSize: $font-XL;
      margin: $spacer-LM 0 $spacer-S;
    }

    &.asHook {
      --titleSize: $font-XL;
      margin: $spacer-LM 0 $spacer-L;
    }

    &.asCenter {
      text-align: center;
    }
  }

  .t-p {
    font-size: $font-M;
    margin-bottom: $spacer-M;

    @media (--md) {
      font-size: 1.8rem;
    }
  }

  .t-t1 {
    color: var(--text_1);
  }

  .t-sm {
    color: var(--text_1);
    font-size: 0.8em;
  }

  .t-b {
    font-weight: 500;
  }

  .t-i {
    font-style: italic;
  }

  .cta-sticky {
    display: block;
    position: relative;
    width: min-content;
    margin: $spacer-L auto 0;
    text-align: center;
    z-index: $ziIntro;

    @media (min-width: 31em) {
      position: sticky;
      top: 1.8rem;
      z-index: $ziHeader;
    }
  }

  .t-separator {
    display: block;
    width: 100vw;
    margin-left: calc((100vw - 100%) / -2);
    height: 17rem;
    
    /* To match header pixel perfect */
    position: sticky;
    top: -9rem;
    z-index: $ziLine;

    background: linear-gradient(to top, rgba(var(--bg_1_rgb),1) 0%, rgba(var(--bg_1_rgb),0) 100%);
    margin-top: calc($spacer-LM * -2);
    margin-bottom: $spacer-XL;
  }

  .t-blockread {
    width: $widthRead;
    max-width: 100%;
    margin: auto;
  }

  .t-blockwide {
    position: relative;
    width: 100vw;
    margin-left: calc((100vw - 100%) / -2);
  }

  .t-me960 {
    position: relative;
    width: 20rem;
    margin-right: -2.4rem;
    margin-top: -15rem;
    float: right;
    box-shadow: 2px 2px 0 var(--primary_1);
  }

  :global(.k-about.k-about.k-about) {
    --section-contentWidth: $width;
    
    :global(.text) {
      width: calc($widthRead + $spacer-M * 2);
      padding: 0 $spacer-M;
    }
  }
  
  .t-feedback {
    @media (min-width: 820px) {
      width: calc(100% + 260px);
      transform: translateX(-130px);
    }
  }

  .t-tweets {
    @media (--lg) {
      display: flex;
      flex-wrap: wrap;
      min-height: 440px; /* desktop */
      margin: 100px 0 50px;

      > * {
        flex-basis: 33%;
        flex-grow: 1;
        min-width: 200px;
      }

      &Area {
        margin: $spacer-S $spacer-XS;
      }
    }

    
    @media (--max-lg) {
      &Area {
        margin: $spacer-S 0;
      }
    }

    :global(.twitter-tweet:not(.twitter-tweet-rendered)) {
      border: 1px solid;
      background-color: var(--bg_invert);
      border-radius: 4px;
      border: 1px dashed;
      padding: 8px;
      font-size: $font-M;
      color: inherit;
    }

    :global(.twitter-tweet-rendered) {
      display: block;
      margin: 0 !important;
    }
  }

  .t-quotes {
    margin: 40px 0;
    
    &-item {
      display: block;
      padding: 0 24px 0 16px;
      font-size: $font-M;
      font-style: italic;
      border-left: 2px solid var(--primary_1);
    }

    @media (--lg) {
      margin: 50px 0 100px;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;

      &-item {
        flex-basis: 50%;
        flex-grow: 1;
        min-width: 200px;

        margin: 16px 0;
      }
    }
  }

  @media (--max-lg) {
    .u-carousel {
      margin-left: calc($spacer-M * -1);

      .u-carousel-item {
        width: 85%;
        max-width: 300px;
        padding: 0 $spacer-S;
        align-self: flex-start;

        &:first-child {
          margin-left: $spacer-M;
        }
      }
    }
  }

  .t-list {
    margin-left: $spacer-MS;
    list-style-type: circle;
    font-size: $font-L;
    line-height: 1.5;

    li + li {
      margin-top: $spacer-S;
    }

    &.asCompact {
      margin-top: $spacer-XS;
    }

    &.asCheck {
      margin-left: 0;
      list-style: none;

      li:before {
        content: '✓';
        margin-right: $spacer-S;
        color: var(--primary_1);
      }
    }
  }

  .t-card {
    padding: $spacer-M;
    background-color: var(--bg_1);
    border-radius: 3px;
    box-shadow: 0.2rem 0.2rem var(--primary_1_smooth);

    & + .t-card {
      margin-top: $spacer-M;
    }

    .t-list {
      font-size: $font-M;
    }
  }

  .t-cta {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: $spacer-XL 0 $spacer-S;

    &Title {
      font-size: $font-XL;
      font-weight: 500;
      line-height: 1.2;
      margin: $spacer-M 0 $spacer-XS;
      color: var(--text_s);
    }

    &Pitch {
      color: var(--text_1);
      font-size: $font-M;
      text-align: center;
    }

    &Points {
      margin: $spacer-M 0 $spacer-L; 
      text-align: left;

      .u-svg {
        width: 1.6rem;
        height: 1.6rem;
        fill: var(--primary_1);
        margin-right: $spacer-S;
      }

        dt {
          float: left;
          margin-top: 0.2em;
        }
  
        dd {
          font-weight: 500;
          color: var(--text_0);
          white-space: nowrap;
        }

      @media (min-width: 31em) {
        display: flex;
        align-items: center;
        justify-content: center;

        dt:nth-of-type(2) {
          margin-left: $spacer-L;
        }
      }
    }

    &Note {
      color: var(--text_1);
      font-size: $font-S;
      margin: $spacer-S 0 $spacer-M;
    }

    &.asTiny {
      .t-ctaTitle {
        margin-top: 0;
        font-size: $font-L;
      }

      @media (max-width: 31em) {
        .u-btnMain {
          margin-top: $spacer-M;
        }
      }

      @media (min-width: 31em) {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
    }
  }

  .t-hashtitle {
    font-size: $font-L2;
    font-weight: 500;
    margin-bottom: $spacer-S;
    
    :global(.dark) & {
      color: white;
    }
    
    &Prefix {
      color: var(--primary_1);
      margin-right: $spacer-S;
    }
  }

  .t-process {
    text-align: center;

    &Flow {
      display: flex;
      justify-content: center;
      color: var(--primary_1);

      &Ix {
        &:not(:first-child) {
          &::before {
            content: '→'; /*'›';*/
            margin: 0 $spacer-S;
            color: var(--text_1);
          }
        }
      }
    }


    @media (max-width: 28em) {
      &FlowIx:nth-child(4) {
        display: none;
      }
    }
  }

  .faq {
    &Area {
      width: 100vw;
      margin-left: calc((100vw - 100%) / -2);
      padding: 0 $spacer-M;
    }

    &List {
      display: grid;
      gap: $spacer-M;
      width: $widthFAQ;
      max-width: 100%;
      margin: auto;
      
      @media (--md) {
        grid-template-columns: repeat(auto-fit, minmax(40rem, 1fr));
      }

      .t-list {
        font-size: inherit;

        li + li {
          margin-top: 0;
        }
      }
    }

  }

  .footer {
    position: relative;
    background: var(--bg_1);
    margin-top: $spacer-XL;
    padding: $spacer-L $spacer-M;
    line-height: 1.2;

    &Area {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: $widthRead;
      max-width: 100%;
      margin: auto;

      > *:first-child {
        margin-right: $spacer-M;
      }
    }
  }

  .t-credits {
    font-size: $font-S;
    color: var(--text_1);
    margin-top: $spacer-XS;
  } 

  .sr-area {
    position: relative;

    .sr-only {
      width: 100%; height: 100%;
      top: 0; left: 0;
    }
  }

  .t-echos {
    position: absolute;
    bottom: 100%;
    left: calc(50vw + $widthFAQ / 2 + 25px);
    width: 80px;
    height: 100px;
    background: linear-gradient(180deg, rgba(255, 63, 51, 0.21) 0%, rgba(255, 255, 255, 0) 100%);
    z-index: -1;

    :global(.dark) & {
      background: linear-gradient(180deg, rgba(221, 141, 141, 0.33), rgba(255, 255, 255, 0) 100%); 
    }

    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 110px;
      left: -50px;
      top: -45px;
      background: linear-gradient(180deg, rgba(113, 168, 255, 0.28) 0%, rgba(255, 255, 255, 0) 100%);
      
      :global(.dark) & {
        background: linear-gradient(180deg, rgba(113, 168, 255, 0.28), rgba(255, 255, 255, 0) 100%);
      }
    }

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 150px;
      left: -20px;
      top: -100px;
      background: linear-gradient(180deg, rgba(0, 16, 255, 0.07) 0%, rgba(255, 255, 255, 0) 100%);
    
      :global(.dark) & {
        background: linear-gradient(180deg, rgb(189 102 255 / 17%) -15%, rgba(255, 255, 255, 0) 100%);
      }
    }

    @media (--max-md) {
      display: none;
    }
  }
</style>

<HeadMeta
  site={`${SITE_URL}/workshop-a11y`}
  title="Web Accessibility Fundamentals Workshop | Sandrina Pereira"
  description="In this workshop we'll explore how accessibility doesn't have to limit our solutions or skills. On the contrary, it will make them more inclusive!"
  coverUrl={`${SITE_URL}/cover_a11y_fev2022.png`} />

<svelte:head>
  <script type="application/ld+json">
    [
      {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        url: 'https://sandrina-p.net/workshop-a11y',
        name: 'Web Accessibility Fundamentals Workshop | Sandrina Pereira',
        alternateName: 'A11Y Fundamentals',
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': 'https://sandrina-p.net/workshop-a11y',
              name: 'Web Accessibility Fundamentals Workshop | Sandrina Pereira',
              image: 'https://sandrina-p.net/cover_a11y_fev2022.png',
            },
          },
        ],
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': 'https://sandrina-p.net/workshop-a11y',
        },
        headline: 'Web Accessibility Fundamentals Workshop | Sandrina Pereira',
        image: {
          '@type': 'ImageObject',
          url: 'https://sandrina-p.net/cover_a11y_fev2022.png',
          height: 1280,
          width: 640,
        },
        datePublished: '2020-03-23',
        dateModified: '2020-03-23',
        author: {
          '@type': 'Person',
          name: 'Sandrina Pereira',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Sandrina Pereira',
          logo: {
            '@type': 'ImageObject',
            url: 'https://sandrina-p.net/favicon192.png',
            width: 192,
            height: 192,
          },
        },
        description:
          "In this workshop we'll explore how accessibility doesn't have to limit our solutions or skills. On the contrary, it will make them more inclusive!",
      },
    ];
  </script>
</svelte:head>

<header class="header">
  <a href={SITE_URL} class="u-logo">
    Sandrina
  </a>
  <ToggleThemePage />
</header>


<main class="wrapper blogpost">
  <header class="t-hero">
    <h1 class="t-heroTitle t-title">Web Accessibility Fundamentals</h1>
    <p class="t-heroMantra">The web is awesome and everyone should be able to enjoy it.</p>
    <span class="t-heroKicker">Online Workshop</span>
    <div class="t-heroAbout">
      <p class="t-heroCreator">with <img src="/sandrinap.jpg" alt="" class="t-heroCreatorPic" />
        <a class="u-link t-heroCreatorName" rel="noreferrer" href={TWITTER_URL} on:click={() => trackClick('creator')}>
          Sandrina Pereira
        </a>
      </p>
      <p>
        {@html eventDate} <span class="t-t1">|</span> 
        <span class="sr-area">
          <span aria-hidden="true">10 hours <span class="t-sm">(2:30h × 4 days)</span></span>
          <span class="sr-only">10 hours total - 2 hours and 30 minutes across 4 days</span>
        </span>
      </p>
    </div>
  </header>

  <div class="cta-sticky">
    <a href={ticketUrl} class="u-btnMain" on:click={handleJoinListClick}>Get Ticket</a>
  </div>

  <span class="t-separator"></span>

  <div class="t-blockread">
    <p class="t-p">
      As web creators, unfortunately, many of us are still leaving accessibility as an afterthought.
      Learning how to use modern <span class="u-nowrap">UI Libraries</span> sounds way more exciting.
    </p>  
    <p class="t-p">
      <em class="t-i">I understand you, but...</em>
    </p>

    <h2 class="t-title asHook">
        Accessibility is our duty <span class="nowrap">as web creators</span>
    </h2>
    <p class="t-p">
      It's our moral duty (and legal requirement in many countries) to ensure
      that anyone who visits a website, can enjoy it as much <span class="u-nowrap">as possible.</span> 
    </p>
      
    <p class="t-p">
      Perhaps you already know that accessibility matters, and you are aware that color contrast is a thing. But... <i>what else?</i>
    </p>
    <p class="t-p">
      In your solo journey into learning accessibility, you’ve might have visited the 
      <a href="https://www.w3.org/WAI/" on:click={() => trackClick('w3c')} class="u-link">W3C WAI</a>
      website and took a look at the
      <a href="https://www.w3.org/TR/WCAG21" on:click={() => trackClick('wcag')} class="u-link">
      WCAG 2.1
      </a> technical requirements.
    </p>
    <p class="t-p">
      Yet, the content seemed way too complex, you may have felt overwhelmed... 
      and ended up leaving it aside.
    </p>
    <h2 class="t-title asHook">
        Let me simplify it for you
    </h2>
    <p class="t-p">
      Rather than focusing on theoretical rules, I will first show you real-world examples
      that can be everything but a joyful experience for many. <em class="t-i">(ouch!)</em>
    </p>
    <p class="t-p">
      These scenarios will bring you awareness of the existing barriers out there, and you'll realize
      why accessibility (the lack of it) can really make the difference in someone's life... including you and me!
    </p>
    <p class="t-p">
      Let me show you why accessibility is worthy of being part of your skillset foundations
    <!-- </p>
    <p class="t-p"> -->
      and how it doesn't limit your solutions or design skills.
    <!-- </p>
    <p class="t-p"> -->
      On the contrary, it will make them <span class="u-nowrap">more inclusive!</span>
    </p>

    <p>Ready to make the web a better place?</p>

    <h2 class="t-title asH2">
        The workshop
    </h2>
    <p class="t-p">
      This workshop will be packed with little big discoveries!
      We will explore every common accessibility no-nos, and how to make them more inclusive for 
      as many people as possible using a mouse or a keyboard.
    </p>
    <p class="t-p">
      We'll cover multiple design patterns and development techniques that you can apply in your own projects right away.
    </p>
    <p class="t-p">
      You’ll also learn how screen readers are used, and I'll show you that there's no reason to be afraid of using one!
    </p>

    <h3 class="t-title asH3">
      Topics
    </h3>
    <p class="t-p">
      These are the modules that we'll go through together:
    </p>
    <ul class="t-topics">
      {#each modules as { title, topics }, index}
        <li class="t-card">
          <h4 class="t-hashtitle">
            <span class="t-hashtitlePrefix" aria-hidden="true">#{index}</span>
            {title}
          </h4>

          <ul class="t-list asCompact">
            {#each topics as topic}
              <li>{topic}</li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>


    <h4 class="t-title asH3">
      By the end, you will:
    </h4>
    <ul class="t-list asCheck">
      <li>Realize how web accessibility benefits everyone</li>
      <li>Understand WCAG principles and how they're organized</li>
      <li>Know when to use accessibility audit tools</li>
      <li>Quickly identify common accessibility issues</li>
      <li>Integrate accessibility into your team workflow right away</li>
      <li>
        Realize that creating accessible websites isn’t as hard <span class="u-nowrap">as it sounds
        <span aria-hidden="true">;)</span></span>
      </li>
    </ul>


    <h3 class="t-title asH3">
      Workshop dynamics
    </h3>
    <p class="t-p">
      The workshop is divided into multiple exercises. In each one, I’ll introduce you to a new topic in a realistic way, along with <strong>practical resources</strong>. 
    </p>
    <p class="t-p">
      Then, there will be a <strong>hands-on exercise</strong> for you to apply the concepts learned. You can solve it by yourself or by collaborating with a group of 3-4 people.
    </p>
    <p class="t-p">
      Afterwards, we go through the <strong>solution</strong> together, and I’ll <strong>clarify the questions</strong> that you might have.
    </p>

    <div class="t-card t-process">
    <div class="circle"></div>
      <ul class="t-processFlow">
        <li class="t-processFlowIx">explore</li> 
        <li class="t-processFlowIx">struggle</li> 
        <li class="t-processFlowIx">emerge</li> 
        <li class="t-processFlowIx">repeat</li> 
      </ul>
      <p>An interactive way of learning together.</p>
    </div>


    <h3 class="t-title asH3">
      Who is this workshop for?
    </h3>
    <p class="t-p">
      Frontend developers are the main audience but if you are a designer
      or a QA expert, then this workshop will be valuable for you as well. 
    </p>
    <p class="t-p">
      The topics will be explained with beginners in mind, and get more advanced as we go through it.
    </p>
    <p class="t-p">
      Even if you already have some experience in accessibility, you can look at this
      workshop as a way to solidify your knowledge and fill any existing gaps.
    </p>

    <h3 class="t-title asH3">
      Pre-requisites
    </h3>
    <ul class="t-list">
      <li>Comfortable with HTML and CSS. JavaScript is a bonus.</li>
      <li>The browser Chrome or Firefox installed.</li>
      <li>
        A good internet with
        <a class="u-link" href="http://zoom.com/" rel="noreferrer" on:click={() => trackClick('zoom')}>Zoom</a>
        installed for the video call;
      </li>
      <li>
        A webcam is optional. Although I highly appreciate seeing you while I’m speaking,
        I want to be respectful of <span class="u-nowrap">your boundaries.</span>
      </li>
      <li>Be willing to learn something different!</li>
    </ul>
  
    <article class="t-card t-cta" role="region" aria-label="Buy ticket">
      <h2 class="t-ctaTitle">Join the workshop!</h2>
      <p class="t-ctaPitch">Get 10 hours over 4 days <span class="u-nowrap">of hands-on exploration.</span></p>

      <dl class="t-ctaPoints">
        <dt>
          <svg aria-hidden="true" class="u-svg" style="display: none;">
            <use xlink:href="#calendar" />
          </svg>
          <span class="sr-only">When:</span>
        </dt>
        <dd>{@html eventDate}</dd>
        <dt>
          <svg aria-hidden="true" class="u-svg" style="display: none;">
            <use xlink:href="#clock" />
          </svg>
          <span class="sr-only">Hour:</span>
        </dt>
        <dd>{@html eventHour} <span class="t-sm">{eventTZ}</span></dd>
      </dl>

      <a href={ticketUrl} class="u-btnMain" on:click={() => trackClick('cta_card')}>Buy ticket for {price}</a>
      <span class="t-ctaNote">Price is Early Bird. Original is 349€</span>
    </article>

    <!-- <WorkshopForm formEndpoint={endpointA11Y}>
      <p class="t-ctaPitch">Get 10 hours, over 4 days, to refine your A11Y knowledge.</p>

      <dl class="t-ctaPoints">
        <dt class="time-todo">
          <svg aria-hidden="true" class="u-svg" style="display: none;">
            <use xlink:href="#calendar" />
          </svg>
          <span class="sr-only">When:</span>
        </dt>
        <dd>Earlier 2022</dd>

        <dt>
          <svg aria-hidden="true" class="u-svg" style="display: none;">
            <use xlink:href="#clock" />
          </svg>
          <span class="sr-only">Hour:</span>
        </dt>
        <dd>{@html eventHour} <span class="tz">{eventTZ}</span></dd>
      </dl>
    </WorkshopForm> -->

    <div class="t-blockwide">
      <SectionSkew isOnStage sectionName="a11yAbout" klass="k-about" motionReduced={true}>
        <span slot="title_top">
          By the way,
        </span>
        <span slot="title_bottom">
          I'm Sandrina
        </span>

        <img src="/sandrinap960.jpg" alt="" class="t-me960" />

        <p class="t-p">
          I’m a UX Frontend Engineer who helps turn ideas into <span class="u-nowrap">accessible experiences.</span>
        </p>
        
        <p class="t-p">
          My focus areas are around Design Systems and Accessibility within the React ecosystem.
          As a self-taught developer, I recognize the struggle of learning something by ourselves.
        </p>
        <p class="t-p">
          Through the years, I've been sharing my knowledge by
          <a class="u-link" rel="noreferrer" target="_blank" href='/writing' on:click={() => trackClick('articles')}>writing articles</a> 
          and
          <a class="u-link" rel="noreferrer" href={MENTOR_URL} on:click={() => trackClick('mentor')}>online mentoring</a>. 
          <!--
        </p>
        <p class="t-p"> -->
          These allowed me to refine my approach to teaching
          new topics in ways that are simple yet effective.
        </p>
        <p class="t-p">
        <!-- </p>
        <p class="t-p"> -->
          Besides my full-time job at
          <a class="u-link" rel="noreferrer" href='https://remote.com' on:click={() => trackClick('remote.com')}>Remote</a> 
          as Lead Frontend Engineer, I'm focused on raising awareness of why Web Accessibility
          is part of our duties as web creators.
        </p>
        <p class="t-p">
          Join me and let me show you how accessibility doesn't limit your solutions or skills.
          On the contrary, it will make <span class="u-nowrap">them more inclusive!</span>
        </p>

        <section role="region" class="t-feedback" aria-labelledby="testimonials">    
          <h2 class="sr-only" id="testimonials">Testemonials</h2>
          <h3 class="sr-only">Public feedback</h3>
          <div class="t-tweets u-carousel">
            <div class="u-carousel-item">
              <!-- Andrew -->
              <div class="t-tweetsArea">
                <blockquote class="twitter-tweet" data-dnt="true" data-theme="dark"><p dir="ltr">Just finished up <a class="u-link" rel="noreferrer" href="https://twitter.com/a_sandrina_p?ref_src=twsrc%5Etfw">@a_sandrina_p</a>'s Web A11y Fundamentals workshop. Really pleasant and structured well! Helped to learn new tools and concepts considering a11y is a big gap in my knowledge as a web dev. <br><br>Definitely reach out to her for conferences, talks, workshops, etc!</p>&mdash; Andrew Chou (@_andrewchou) <a class="u-link" rel="noreferrer" href="https://twitter.com/_andrewchou/status/1253009155968962567?ref_src=twsrc%5Etfw">April 22, 2020</a></blockquote>
              </div>
            </div>
            <div class="u-carousel-item">
              <!-- Sid -->
              <div class="t-tweetsArea">
                <blockquote class="twitter-tweet" data-dnt="true" data-theme="dark"><p dir="ltr">Something I learned from <a class="u-link" rel="noreferrer" href="https://twitter.com/a_sandrina_p?ref_src=twsrc%5Etfw">@a_sandrina_p</a>'s workshop last week<br><br>Never skip alt text for images. If the image is purely decorative, pass an empty string instead of skipping the tag altogether</p> &mdash; sid 🖤 (@siddharthkp) <a class="u-link" rel="noreferrer" href="https://twitter.com/siddharthkp/status/1256910965465141248?ref_src=twsrc%5Etfw">May 3, 2020</a></blockquote>
              </div>
            </div>
            <div class="u-carousel-item">
              <!-- Nuno -->
              <div class="t-tweetsArea">
                <blockquote class="twitter-tweet" data-dnt="true" data-theme="dark"><p dir="ltr">Mind blowing accessibility workshop with <a class="u-link" rel="noreferrer" href="https://twitter.com/a_sandrina_p?ref_src=twsrc%5Etfw">@a_sandrina_p</a>!</p>— Nuno Pereira (@nunocpnpereira) <a class="u-link" rel="noreferrer" href="https://twitter.com/nunocpnpereira/status/1364178604935049216?ref_src=twsrc%5Etfw">February 23, 2021</a></blockquote>
              </div>
              <!-- Pearl -->
              <div class="t-tweetsArea t-hide">
                <blockquote class="twitter-tweet" data-dnt="true" data-theme="dark"><p dir="ltr">I'm learning a ton in <a class="u-link" rel="noreferrer" href="https://twitter.com/a_sandrina_p?ref_src=twsrc%5Etfw">@a_sandrina_p</a>'s accessibility workshop! <a class="u-link" rel="noreferrer" href="https://twitter.com/hashtag/a11y?src=hash&amp;ref_src=twsrc%5Etfw">#a11y</a></p>&mdash; Pearl Latteier (@pblatteier) <a class="u-link" rel="noreferrer" href="https://twitter.com/pblatteier/status/1252974017499275264?ref_src=twsrc%5Etfw">April 22, 2020</a></blockquote>
              </div>
            </div>
          </div>

          <h3 class="sr-only">Anonymous feedback</h3>
          <div class="t-quotes u-carousel">
            <blockquote class="t-quotes-item u-carousel-item">
              Really liked the format of the training, with briefings and exercises for each, <strong>making it not boring at all</strong>.
              [...]
              The quiz, in the end, was a nice and fun way to wrap up! Overall, really enjoying it, thanks!
            </blockquote>
            <!-- <blockquote class="t-quotes-item u-carousel-item">
              The content and the pace were good, also your knowledge on this topic is really remarkable, it was really an <strong>enjoyable moment</strong>.
            </blockquote> -->
            <blockquote class="t-quotes-item u-carousel-item">
              I admit I had some misgivings about asking my company to invest in this workshop, because of the time and money, but <strong>it was totally worth it</strong> — I feel like I've taken a clear step forward on this topic.
            </blockquote>
            <blockquote class="t-quotes-item u-carousel-item">
              The resources were top notch, having live examples and the briefings were just <strong>perfect on the amount of information</strong> passed to us.
            </blockquote>
            <blockquote class="t-quotes-item u-carousel-item">
              Your knowledge of this huge topic is clear, the way you answered all the questions <strong>greatly enriched the experience.</strong>
            </blockquote>

            <blockquote class="t-quotes-item u-carousel-item">
              Thanks so much for the training I really enjoy it, had a great time and learned a lot. The small groups per room where pretty cool too! I'm <strong>really excited to practice</strong> all the things I've learned.
            </blockquote>
            <blockquote class="t-quotes-item u-carousel-item">
              Congrats, the workshop was great<!-- on this first day-->, the introduction was one of the <strong>most brilliant
              introductions</strong> to A11Y from a FE perspective, and the pace was balanced.
            </blockquote>

            <!--component
            TODO Candid feedback:
            
            The only thing I would suggest is to have at least one break per session (2:30h). 
            > Now every session has a 10 min session for you to grab some water.
            
            One thing I felt was that in some exercises the tips were too easy to follow but I understand that since the timing is limited, what is not direct related to a11y can and should be omitted (like required JS code to add / remove attributes). 
            > Now tips are devided into 2 ways: Inline "instructions" and "toggable advanced hints" so that everyone can manage the exercises on their own pace
            without spoiling the solution too much. 

            I'd like to have explored more about the connection of accessibility with design
            > Designers play a big role in A11Y too. Now in each topic I also mention multiple take ways related with design.
            -->



          </div>

          <!-- TODO, still WIP -->
          <!-- <h4 class="sr-only">Constructive feedback</h4>
          <div>
            <p>
            Transparency and excellence is one of my core values,
            So here's some of the worst constructive feedback that allowed me to refine
            even more my workshops through the time:</p>

            <quote>
              I think the exercises could have been solved at a slower pace by having everyone participate in finding the solution instead of just presenting the solution.
            </quote>
            <quote>
              Overall I loved the format and delivery, only thing I can think of were a few bugs here and there which is totally normal considering the scope.
            </quote>
            <quote>
              Maybe add a little more energy and create a feeling of community amongst the people in the workshop? As it's remote and people are scattered all over, it's easy to feel disconnected to others learning 🤔
            </quote>  
          </div> -->
        </section>  
      </SectionSkew>
    </div>

    <section role="region" aria-labelledby="faq" class="faqArea">
      <h2 class="t-title asH2 asCenter" id="faq">
        F.A.Q.
      </h2>
      <ul class="faqList">
        <li>
          <Accordion summary="What does A11Y mean?">
            A11Y stands for 'accessibility'.
            The irony about the word "accessibility" itself is that it's not very easy to pronounce.
            The abbreviation stands for A + 11 characters + Y, which is a more user-friendly homophone of "ally".
          </Accordion>
        </li>

        <li>
          <Accordion summary="Will the workshop be recorded?">
            No, it won't be recorded, but you’ll have access to all the materials shared.
          </Accordion>
        </li>


        <li>
          <Accordion summary="What materials are provided?">
          <ul class="t-list">
            <li>
              The materials' slides (+ 50 slides);
            </li>
            <li>
              Codebase with all the mentioned resources;
            </li>
            <li>
              Exercises, including explained solutions;
            </li>
          </ul>
          </Accordion>
        </li>

        <li>
          <Accordion summary="I know A11Y. Will I learn something new?">
            Oh, yeah. Even me, every time I give this workshop I always learn something new. Unless you are an A11Y expert, I’m confident that you'll fill some A11Y gap.
          </Accordion>
        </li>

        <li>
          <Accordion summary="Is the workshop accessible?">
            The video meeting can be captioned and the exercises briefings are fully accessible. If you have any accessibility concern, please reach out to me, and we can arrange it together.
          </Accordion>
        </li>

        <li>
          <Accordion summary="What screen reader will I use?">
            You can use the one that suits you best. I own a Mac, which means I’ll be using Voice Over.
            During an online workshop it's not practical to help everyone using a SR (screen reader).
            Because of that, a few days before the workshop, I will send you guides for you to practice
            with one of the following screen readers:
            <ul class="t-list">
              <li>
                Mac: You'll be using VoiceOver.
              </li>
              <li>
                Windows: You'll need to install
                <a class="u-link" href="https://www.nvaccess.org/" rel="noreferrer">NVDA</a>
                </li>
              <li>
                Linux: You'll need to install
                <a class="u-link" href="https://wiki.gnome.org/Projects/Orca" rel="noreferrer">Orca</a>
              </li>
            </ul>
          </Accordion>
        </li>

        <li>
          <Accordion summary="Is there any discounts available?">
            The workshop will have an Early Bird price until 3 January 2022.
            After that, I don't plan to do more discounts.
            Regardless, I understand that the cost of this workshop can be too high for some people.
            If you are a student you can reach out to me.
          </Accordion>
        </li>

        <li>
          <Accordion summary="Can I buy a ticket for my team?">
            You can, but keep in mind that 1 ticket is for 1 person/seat.
            Besides these public events, I also provide customised workshops. You can
            <a class="u-link" href={ EMAIL_URL_WORKSHOP } rel="noreferrer" on:click={() => trackClick('email_private')}>contact me</a>
            to discuss private sessions options.
          </Accordion>
        </li>

        <li>
          <Accordion summary="How many attendes will be there?">
            There are 14 seats available. I aim to keep the group small, 
            so that people don't feel shy/intimidated in participating.
            This also allows me to have the time to give you the attention
            and care you deserve to clarify your questions.
            Optionally, during the exercises, smaller groups of 3-4 people are created
            for you to solve the exercises in collaboration, if you want to.
          </Accordion>
        </li>

        <li>
          <Accordion summary="How many times have you gave this workshop?">
            I've given this workshop more than 10 times now.
            I started giving full-day workshops in 2018, back to office times.
            The first one about accessibility was in 2019. In earlier 2020 I rethought the contents entirely and adapt it to a remote version.
            In this practical workshop my priority is that you learn by doing and to make everyone feel "present", even during a virtual event.
          </Accordion>
        </li>

        <li>
          <Accordion summary="Can I ask you questions after the workshop?">
            Of course! During the workshop, I'll invite you to join a Discord community with other attendees to talk about accessibility.
          </Accordion>
        </li>

        <li>
          <Accordion summary="Is there a Code of Conduct?">
            We follow
            <a class="u-link" rel="noreferrer" href="https://www.contributor-covenant.org/version/2/0/code_of_conduct/" on:click={() => trackClick('coc')}>contributor-covenant</a>
            code of conduct. A short summary: be kind and treat each other with respect and understanding. There’s zero tolerance for unkind behavior.
          </Accordion>
        </li>
      </ul>
    </section>

    <!-- <article class="t-card t-cta asTiny" role="region" aria-label="Buy ticket">
      <div>
        <p class="t-ctaTitle">Ready to join us <span class="u-nowrap">on {@html eventDate}?</span></p>
        <p>
          {@html eventHour}
          <span class="sr-area">
            <span aria-hidden="true"><span class="t-sm">(2:15h × 4 days)</span></span>
            <span class="sr-only">2 hours and 15 minutes across 4 days</span>
          </span>
        </p>
      </div>
      <a href={ticketUrl} class="u-btnMain" on:click={() => trackClick('cta_card_mini')}>Get ticket</a>
    </article> -->
  </div>
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</main>

<footer class="footer">
  <span class="t-echos"></span>
  <div class="footerArea">
    <div>
      <p>Made without coffee by <span class="u-nowrap"><a class="u-link" href={ SITE_URL } rel="noreferrer" on:click={() => trackClick('footer_me')}>Sandrina Pereira</a>.</span></p>
      <p class="t-credits">© 2020. All Rights Reserved.</p>
    </div>
    <Contacts isWorkshop essentialOnly />
  </div>
</footer>


<SvgSprite />
