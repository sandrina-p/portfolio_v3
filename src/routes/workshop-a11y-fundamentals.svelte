<script>
  import { onMount } from 'svelte';

  import HeadMeta from '../components/HeadMeta.svelte';
  import ToggleThemePage from '../components/navigation/ToggleThemePage.svelte';
  import SvgSprite from '../components/SvgSprite.svelte';
  import Contacts from '../components/Contacts.svelte';
  import { focusOnlyWhenNeeded } from '../utils';
  import Accordion from '../components/workshop/Accordion.svelte'
  import WorkshopForm from '../components/workshop/WorkshopForm.svelte';
  import { MENTOR_URL, TWITTER_URL, SITE_URL } from '../data/misc.js';

  const endpointA11Y = 'https://app.convertkit.com/forms/1318242/subscriptions';

  const modules = [
    {
      title: 'Accessibility overview',
      topics: [
        'Demystify accessibility myths.',
        'Disability types spectrum.',
        'WCAG principles, layers of guidance, and the law.'
      ],
    },
    {
      title: 'Accessible by default',
      topics: [
        'Appearance: color, proportions and motion',
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
        'Using ARIA attributes',
        'Landmarks and forms',
        'Interactive UI patterns',
      ],
    }
  ]

  const price = "000 EUR" // TODO DEFINE PRICE

  const eventHour = '16:00 - 18:15'
  const eventTZ = 'UTC'

  onMount(async () => {
    focusOnlyWhenNeeded();
  });
  
  function trackClick(action) {
    sendGA('send', 'event', 'click', 'workshop', action)
  }
</script>

<style lang="postcss">
  $ziHeader: 4;
  $ziIntro: 3;
  $ziLine: 2;
  $width: 65rem;

  .header {
    position: fixed;
    top: 0;
    z-index: $ziHeader;
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

  .logo {
    font-size: 2.1rem;
    text-decoration: none;
    font-weight: 500;
    color: var(--text_0);

    &::before {
      opacity: 0.5;
      transform-origin: 0 90%;
    }

    &:hover, &:focus {
      &::before {
        opacity: 0.2;
      }
    }
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
      /* color: var(--primary_1); */
      margin-top: $spacer-S;
    }

    &About {
      margin-top: $spacer-L;
      text-align: center;
    }

    &Creator {
      display: flex;
      align-items: center;
      justify-content: center;
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
    font-size: 3.8rem;
    font-weight: 500;

    @media (--max-xs) {
      font-size: calc(4rem * 0.7);
    }


    :global(.dark) & {
      color: white;
    }

    &.asH2 {
      font-size: 3.6rem;
      margin: $spacer-XL 0 $spacer-M;
    }

    &.asH3 {
      font-size: $font-XL;
      margin: $spacer-LM 0 $spacer-S;
    }
  }

  /* .cta-sticky {
    position: sticky;
    top: 1.8rem;
    z-index: $ziIntro;
    display: block;
    width: min-content;
    margin: 0 auto;
    text-align: center;

    .u-link {
      display: inline-block;
      padding: $spacer-S $spacer-M;
      background-color: var(--bg_1);
      border-radius: 3px;
      box-shadow: 0.2rem 0.2rem var(--primary_1_smooth);
      font-weight: 500;
      text-decoration: none;
      color: var(--text_0);
      
      &::before {
        transform: scale(1, 0);
        bottom: 0em;
        left: 0em;
        width: 100%;
        height: 100%;
        transform-origin: 0 100%;
      }
  
      &:hover {
        &::before {
          transform: scale(1, 1);
        }
      }
    }

  } */

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

  @keyframes gelly {
    0%, 100% { border-radius: 65% 68% 77% 50% / 59% 76% 58% 75%; } 
    20% { border-radius: 40% 58% 46% 54% / 50% 60% 41% 50%; } 
    40% { border-radius: 40% 60% 46% 54% / 50% 60% 41% 50%; } 
    60% { border-radius: 56% 44% 76% 30% / 56% 44% 60% 49%; } 
    80% { border-radius: 51% 52% 68% 36% / 56% 43% 60% 47%; } 
  }

  .t-about {
    position: relative;
    width: 100vw;
    margin-left: calc((100vw - 100%) / -2);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      background-color: var(--bg_1);
      width: 100vw;
      height: 100%;
      z-index: -1;
      transform: skew(0deg, -2deg);
    }

    &Avatar {
      /* top: 0;
      right: 0;
      position: absolute; */
      float: right;
      shape-outside: circle(50%);
      margin-top: -100px;
      margin-left: 50px;
      width: 200px;
      height: 200px;
      background: var(--bg_1);
      border-radius: 50%;
      will-change: border-radius;
      /* animation:
        gelly 30s alternate-reverse infinite,
        live 20s alternate-reverse infinite; */
      /* animation-play-state: paused; */
      /* animation-delay: -5s; */
      box-shadow: 5px 5px 30px var(--primary_1_pair);
    }
  }

  .t-feedback {
    
    @media (--lg) {
      width: calc(100% + 200px);
      transform: translateX(-100px);
    }
  }

  .t-tweets {
    display: flex;
    flex-wrap: wrap;
    min-height: 440px; /* desktop */
    margin: 50px 0;

    > * {
      flex-basis: 33%;
      flex-grow: 1;
      min-width: 200px;

      @media (--max-md) {
        .t-hide {
          display: none;
        }
      }
    }

    &Area {
      margin: 8px 4px;
    }

    :global(.twitter-tweet:not(.twitter-tweet-rendered)) {
      border: 1px solid;
      background-color: var(--bg_0);
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
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-bottom: 80px;

    quote {
      flex-basis: 50%;
      flex-grow: 1;
      min-width: 200px;

      margin: 16px 0;
      display: block;
      padding: 0 16px;
      border-left: 1px solid var(--primary_1);
      font-size: $font-M;
      font-style: italic;
    }
  }

  .t-hook {
    font-size: $font-XL;
    font-weight: 500;
    margin: $spacer-LM 0 $spacer-L;
  }

  .t-p {
    font-size: 1.8rem;
    margin-bottom: $spacer-M;
  }

  .t-b {
    font-weight: 500;
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
    margin: $spacer-XL 0;

    &Title {
      font-size: $font-XL;
      font-weight: 500;
      margin: $spacer-M 0 $spacer-S;

      :global(.dark) & {
        color: white;
      }
    }

    &Pitch {
      color: var(--text_1);
      font-size: $font-M;
      text-align: center;
    }

    &Points {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: $spacer-M 0 $spacer-L; 

      .u-svg {
        width: 1.6rem;
        height: 1.6rem;
        fill: var(--primary_1);
      }

      dt {
        display: flex;

        &:nth-of-type(2) {
          margin-left: $spacer-L;
        }
      }

      dd {
        font-weight: 500;
        margin-left: $spacer-S;
        color: var(--text_0);

        .tz {
          color: var(--text_1);
          font-size: 0.8em;
        }
      }
    }

    @media (--max-md) {
      /* .time-todo {
        display: none;
      } */
    }

    &Btn {
      position: relative;
      font-size: innert;
      font-weight: 500;
      padding: $spacer-S $spacer-L;
      border: none;
      text-decoration: none;
      cursor: pointer;
      background: var(--primary_1);
      color: var(--bg_1);
      border-radius: 0.3rem;

      margin: 0 0 $spacer-XS;

      &:hover,
      &:focus {
        outline: none;
        filter: saturate(2);
      }

      :global(.dark) & {
        color: white;
      }
    }

    &Note {
      color: var(--text_1);
      font-size: $font-S;
      margin-bottom: $spacer-M;
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
      font-size: $font-S;

      &FlowIx:nth-child(4),
      &FlowIx:nth-child(5) {
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
      width: 95rem;
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
    text-align: center;
    padding: $spacer-L 0;
    background: var(--bg_1);
    margin-top: $spacer-XL;

    p {
      margin-bottom: $spacer-S;
    }
  }

  em {
    font-style: italic;
  }
</style>

<HeadMeta
  site={`${SITE_URL}/workshop-a11y-fundamentals`}
  title="Web Accessibility Fundamentals - Workshop"
  description="In this workshop we'll explore every common accessibility no-nos and learn how to
  make them work properly for everyone using a mouse or a keyboard."
  coverUrl={`${SITE_URL}/cover_a11y_tba.png`} />

<svelte:head>
  <script type="application/ld+json">
    [
      {
        '@context': 'http://schema.org',
        '@type': 'WebSite',
        url: 'https://sandrina-p.net/workshop-a11y-fundamentals',
        name: 'Web Accessibility Fundamentals - Workshop',
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
              '@id': 'https://sandrina-p.net/workshop-a11y-fundamentals',
              name: 'Web Accessibility Fundamentals - Workshop',
              image: 'https://sandrina-p.net/cover_a11y_tba.png',
            },
          },
        ],
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': 'https://sandrina-p.net/workshop-a11y-fundamentals',
        },
        headline: 'Web Accessibility Fundamentals - Workshop',
        image: {
          '@type': 'ImageObject',
          url: 'https://sandrina-p.net/cover_a11y_tba.png',
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
          "In this workshop we'll explore every common web accessibility no-nos and learn how to make them work properly for everyone using a mouse or a keyboard.",
      },
    ];
  </script>
</svelte:head>

<header class="header">
  <a href={SITE_URL} class="logo u-link">
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
      <!-- <p>April 11-13 · {eventHour} {eventTZ}</p> -->
      <p class="t-heroCreator">with <img src="/sandrinap.jpg" alt=""  class="t-heroCreatorPic" />
        <a class="u-link t-heroCreatorName" rel="noreferrer" href={TWITTER_URL} on:click={() => trackClick('creator')}>
          Sandrina Pereira
        </a>
      </p>
    </div>
  </header>

  <div class="cta-sticky">
    <!-- <button class="u-link">Coming soon!</button> -->
  </div>

  <span class="t-separator"></span>

  <p class="t-p">
    As web creators, unfortunately, many of us are still leaving accessibility as an afterthought.
    Learning modern UI Libraries sounds way more exciting.
  </p>  
  <p class="t-p">
    <em>I understand you, but...</em>
  </p>

  <h2 class="t-hook">
      Accessibility is our duty as web creators
  </h2>
  <p class="t-p">
    It's our moral duty (and legal requirement in many countries) to ensure
    that anyone who visits a website, can enjoy it as much as possible. 
  </p>
    
  <p class="t-p">
    Perhaps you already know that accessibility matters, and you are aware that color contrast is a thing. But... <i>what else?</i>
  </p>
  <p class="t-p">
    In your solo journey into learning accessibility, you’ve might have visited the 
    <a href="https://www.w3.org/WAI/" class="u-link">W3C WAI</a>
    website and took a look at the
    <a href="https://www.w3.org/TR/WCAG21" class="u-link">
    WCAG 2.1
    </a> technical requirements.
  </p>
  <p class="t-p">
    Yet, the content seemed way too complex, you may have felt overwhelmed, lost... 
    and ended up leaving it aside.
  </p>
  <h2 class="t-hook">
      Let me simplify it for you
  </h2>
  <p class="t-p">
    Rather than focusing on theoretical rules, I will first show you real-world examples
    that can be all but a joyful experience for many people.
  </p>
  <p class="t-p">
    These scenarios will bring you awareness of the existing barriers out there, and you'll realize
    why (the lack of) accessibility can really make the difference in someone's life... including you and me!
  </p>
  <!-- <p class="t-p">
    It's your moral duty (and legal requirement) to ensure that anyone who visits your website, can enjoy it as much as possible. 
  </p> -->
  <p class="t-p">
    Let me show you why accessibility is worthy of being part of your skillset foundations
  <!-- </p>
  <p class="t-p"> -->
    and how it doesn't limit your solutions or design skills.
  <!-- </p>
  <p class="t-p"> -->
    On the contrary, it will make them more inclusive!
  </p>

  <p>Ready to make the web a more inclusive place?</p>

  <h2 class="t-title asH2">
      The workshop
  </h2>
  <p class="t-p">
    This workshop will be packed with little big discoveries!
    We will explore every common accessibility no-nos and how to make them more inclusive for 
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
    The workshop is divided into modules that complement each other:
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


  <h3 class="t-title asH3">
    By the end, you will:
  </h3>
  <ul class="t-list asCheck">
    <li>Realize how web accessibility benefits everyone</li>
    <li>Understand WCAG principles and how they're organized</li>
    <li>Know how to use accessibility audit tools</li>
    <li>Quickly identify common accessibility issues</li>
    <li>Integrate accessibility into your team workflow right away</li>
    <li>
      Find out that building inclusive websites isn’t as hard as it sounds
      <span aria-hidden="true">;)</span>
    </li>
  </ul>


  <h3 class="t-title asH3">
    Workshop dynamics
  </h3>
  <p class="t-p">
    The workshop is divided into multiple exercises. In each one, I’ll introduce you to a new topic in a simplified way, along with <strong>practical resources</strong>. 
  </p>
  <p class="t-p">
    Then, there will be a <strong>hands-on exercise</strong> for you to apply the concepts learned. You can solve it by yourself or by collaborating with a group of 2-3 people.
  </p>
  <p class="t-p">
    Afterwards, we go through the <strong>solution</strong> together, and I’ll <strong>clarify the questions</strong> that you might have.
  </p>

  <div class="t-card t-process">
    <ul class="t-processFlow">
      <li class="t-processFlowIx">problem</li> 
      <li class="t-processFlowIx">practice</li> 
      <li class="t-processFlowIx">review</li> 
      <li class="t-processFlowIx">clarify</li> 
      <li class="t-processFlowIx">repeat</li> 
    </ul>
    <p>An interactive way of learning together.</p>
  </div>


  <h3 class="t-title asH3">
    Who is this workshop for?
  </h3>
  <p class="t-p">
    Web developers are the main audience, but if you are a designer,
    or a QA expert, then this workshop will be valuable for you as well. 
  </p>
  <p class="t-p">
    The topics will be explained with beginners in mind, and they will get more advanced as we go through them.
  </p>
  <p class="t-p">
    Even if you already have some experience in A11Y, you can look at this
    workshop as a way to solidify your knowledge and fill any existing gaps.
  </p>

  <h3 class="t-title asH3">
    Pre-requisites
  </h3>
  <ul class="t-list">
    <li>Comfortable with HTML and CSS. Basics of JavaScript is a bonus</li>
    <li>A <strong>modern browser</strong> installed: Chrome or Firefox are recommended</li>
    <li>
      A <strong>good internet connection</strong> with
      <a class="u-link" href="http://zoom.com/" rel="noreferrer">Zoom</a>
      installed for the video call;
    </li>
    <li>
      A webcam is optional. Although I highly appreacite seeing you while I’m speaking,
      I want to be respectful of your boundaries.
    </li>
    <li>Be willing to learn something different!</li>
  </ul>


  <!-- <article class="t-card t-cta">
    <h2 class="t-ctaTitle">Join the online workshop!</h2>
    <p class="t-ctaPitch">Get 9 hours, over 4 days, to refine your A11Y knowledge.</p>

    <dl class="t-ctaPoints">
      <dt>
        <svg aria-hidden="true" class="u-svg" style="display: none;">
          <use xlink:href="#calendar" />
        </svg>
        <span class="sr-only">When:</span>
      </dt>
      <dd>To be defined (April?)</dd>

      <dt>
        <svg aria-hidden="true" class="u-svg" style="display: none;">
          <use xlink:href="#clock" />
        </svg>
        <span class="sr-only">Hour:</span>
      </dt>
      <dd>{eventHour} <span class="tz">{eventTZ}</span></dd>
    </dl>

    <a href="" class="t-ctaBtn">Buy ticket for {price}</a>
    <span class="t-ctaNote">Price is Early Bird</span>

  </article> -->
  <WorkshopForm formEndpoint={endpointA11Y}>
    <p class="t-ctaPitch">Get 9 hours, over 4 days, to refine your A11Y knowledge.</p>

    <dl class="t-ctaPoints">
      <dt class="time-todo">
        <svg aria-hidden="true" class="u-svg" style="display: none;">
          <use xlink:href="#calendar" />
        </svg>
        <span class="sr-only">When:</span>
      </dt>
      <dd>Soon</dd>

      <dt>
        <svg aria-hidden="true" class="u-svg" style="display: none;">
          <use xlink:href="#clock" />
        </svg>
        <span class="sr-only">Hour:</span>
      </dt>
      <dd>{eventHour} <span class="tz">{eventTZ}</span></dd>
    </dl>
  </WorkshopForm>

  <!-- <h2 class="t-title asH2">I'm Sandrina, your instructor</h2> -->

  <div class="t-about">
    <div class="wrapper">
      <article>
        <h2 class="t-hook">
          Let me introduce myself,
          I'm Sandrina!
        </h2>
        <!-- <div class="t-aboutAvatar"></div> -->
        <p class="t-p">
          I’m a UX Frontend Engineer who helps turn ideas into accessible experiences.
        </p>
        
        <p class="t-p">
          As a self-taught developer, I recognize the struggle of learning something by ourselves.
          Through the years, I've been sharing my knowledge by
          <a class="u-link" rel="noreferrer" target="_blank" href='/writing' on:click={() => trackClick('articles')}>writing articles</a> 
          and
          <a class="u-link" rel="noreferrer" target="_blank" href={MENTOR_URL} on:click={() => trackClick('mentor')}>mentoring online</a>, 
          <!-- .
        </p>
        <p class="t-p"> -->
          which allowed me to refine my approach to teaching
          new topics in ways that are simple yet effective.
        </p>
        <p class="t-p">
          My expertise area is within the React ecosystem around Design Systems and Accessibility.
        <!-- </p>
        <p class="t-p"> -->
          Currently, besides my full-time job at Remote as Lead Frontend Enginer, I'm focused in creating awareness of why Web Accessibility
          is part of our duties as web creators.
        </p>
        <p class="t-p">
          Join me and let me show you that A11Y doesn't have to limit your solutions or skills.
          On the contrary, it will make them more inclusive!
        </p>
        

        <!-- <p class="t-p">
        But don’t take my word for granted,
        Here’s what people have said about me:
        </p> -->
      </article>
      
      <article class="t-feedback">    
        <h3 class="sr-only">Public feedback</h3>
        <div class="t-tweets">
        
          <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
          <div>
            <!-- Nuno -->
            <div class="t-tweetsArea">
              <blockquote class="twitter-tweet" data-dnt="true" data-theme="dark"><p dir="ltr">Mind blowing accessibility workshop with <a class="u-link" rel="noreferrer" href="https://twitter.com/a_sandrina_p?ref_src=twsrc%5Etfw">@a_sandrina_p</a>!</p>— Nuno Pereira (@nunocpnpereira) <a class="u-link" rel="noreferrer" href="https://twitter.com/nunocpnpereira/status/1364178604935049216?ref_src=twsrc%5Etfw">February 23, 2021</a></blockquote>
            </div>
            <!-- Pearl -->
            <div class="t-tweetsArea t-hide">
              <blockquote class="twitter-tweet" data-dnt="true" data-theme="dark"><p dir="ltr">I'm learning a ton in <a class="u-link" rel="noreferrer" href="https://twitter.com/a_sandrina_p?ref_src=twsrc%5Etfw">@a_sandrina_p</a>'s accessibility workshop! <a class="u-link" rel="noreferrer" href="https://twitter.com/hashtag/a11y?src=hash&amp;ref_src=twsrc%5Etfw">#a11y</a></p>&mdash; Pearl Latteier (@pblatteier) <a class="u-link" rel="noreferrer" href="https://twitter.com/pblatteier/status/1252974017499275264?ref_src=twsrc%5Etfw">April 22, 2020</a></blockquote>
            </div>
          </div>
          <div>
            <!-- Sid -->
            <div class="t-tweetsArea">
              <blockquote class="twitter-tweet" data-dnt="true" data-theme="dark"><p dir="ltr">Something I learned from <a class="u-link" rel="noreferrer" href="https://twitter.com/a_sandrina_p?ref_src=twsrc%5Etfw">@a_sandrina_p</a>'s workshop last week<br><br>Never skip alt text for images. If the image is purely decorative, pass an empty string instead of skipping the tag altogether</p> &mdash; sid 🖤 (@siddharthkp) <a class="u-link" rel="noreferrer" href="https://twitter.com/siddharthkp/status/1256910965465141248?ref_src=twsrc%5Etfw">May 3, 2020</a></blockquote>
            </div>
          </div>
          <div>
            <!-- Andrew -->
            <div class="t-tweetsArea">
              <blockquote class="twitter-tweet" data-dnt="true" data-theme="dark"><p dir="ltr">Just finished up <a class="u-link" rel="noreferrer" href="https://twitter.com/a_sandrina_p?ref_src=twsrc%5Etfw">@a_sandrina_p</a>'s Web A11y Fundamentals workshop. Really pleasant and structured well! Helped to learn new tools and concepts considering a11y is a big gap in my knowledge as a web dev. <br><br>Definitely reach out to her for conferences, talks, workshops, etc!</p>&mdash; Andrew Chou (@_andrewchou) <a class="u-link" rel="noreferrer" href="https://twitter.com/_andrewchou/status/1253009155968962567?ref_src=twsrc%5Etfw">April 22, 2020</a></blockquote>
            </div>
          </div>
        </div>

        <h3 class="sr-only">Anonymous feedback</h3>
        <h4 class="sr-only">Best feedback</h4>
        <div class="t-quotes">
          <quote>
            Really liked the format of the training, with briefings and exercises for each, making it not boring at all.
            [...]
            The quiz, in the end, was a nice and fun way to wrap up! Overall, really enjoying it, thanks!</quote>
          <quote>
            Congrats, the workshop was great<!-- on this first day-->, the introduction was one of the most brilliant
            introductions to A11Y from a FE perspective, and the pace was balanced.
          </quote>
          <quote>
            The content and the pace were good, also your knowledge on this topic is really remarkable, it was really an enjoyable moment.
          </quote>
          <quote>
            Thanks so much for the training I really enjoy it, had a great time and learned a lot. I'm really excited to practice all the things had learned.
          </quote>
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
      </article>
    </div>
  </div>


  <h2 class="t-title asH2">
    F.A.Q.
  </h2>

  <div class="faqArea">
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
          Oh, yeah. Even me, every time I give this workshop I always learn something new. Unless you are an A11Y expert, I’m confident that you'll fill some gap.
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
          with one of the following screen readers.
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
            <li>
              SR keyboard shortcuts:
              <a class="u-link" href="VO and NVDA" rel="noreferrer">VO and NVDA</a>,
              and <a class="u-link" href="VO and NVDA" rel="noreferrer">Orca</a>.
            </li>
          </ul>
        </Accordion>
      </li>

      <li>
        <Accordion summary="Is there any discounts available?">
          The workshop will have an Early Bird price for a week.
          After that, there won’t be more discounts available.
          Regardless, I understand that the cost of this workshop can be too high for some people,
          and if you are a student you can reach out to me.
        </Accordion>
      </li>

      <li>
        <Accordion summary="Can I buy a ticket for my team?">
          You can but keep in mind that 1 ticket is for 1 person/seat.
          Besides these public events, I also provide customised workshops. You can contact me to discuss private sessions options.
        </Accordion>
      </li>

      <li>
        <Accordion summary="Can I ask you questions after the workshop?">
          Of course! During the workshop, I'll invite to join a Discord community with other attendees to clarify any question.
        </Accordion>
      </li>

      <li>
        <Accordion summary="Is there a Code of Conduct?">
          We follow
          <a class="u-link" rel="noreferrer" href="https://www.contributor-covenant.org/version/2/0/code_of_conduct/" on:click={() => trackClick('csstricks_journey')}>contributor-covenant</a>
          code of conduct. A short summary: be kind and treat each other with respect and understanding. There’s zero tolerance for unkind behavior.
        </Accordion>
      </li>
    </ul>
  </div>
  
  <!-- TODO FAQ LIST -->
</main>

<footer class="footer">
  <p>
    Made without coffee by
    <a class="u-link" href={SITE_URL} rel="noreferrer">Sandrina Pereira</a>.
  </p>
  <Contacts essentialOnly />
</footer>

<SvgSprite />
