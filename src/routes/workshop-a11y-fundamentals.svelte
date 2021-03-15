<script>
  import { onMount } from 'svelte';

  import HeadMeta from '../components/HeadMeta.svelte';
  import ToggleThemePage from '../components/navigation/ToggleThemePage.svelte';
  import SvgSprite from '../components/SvgSprite.svelte';
  import Contacts from '../components/Contacts.svelte';
  import { focusOnlyWhenNeeded } from '../utils';
  import Accordion from '../components/workshop/Accordion.svelte'
  import { TWITTER_URL, SITE_URL } from '../data/misc.js';
  
  const modules = [
    {
      title: 'Accessibility overview',
      topics: [
        'Demystify accessibility myths.',
        'Disability types spectrum.',
        'WCAG: principles, layers of guidance, and the law.'
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
        'Exploring and solving',
        'Landmarks and forms',
        'Interactive UI Design Patterns',
      ],
    }
  ]

  const price = "000 EUR" // TODO DEFINE PRICE

  const eventHour = '16:00 - 19:00'
  const eventTZ = 'UTC'

  onMount(async () => {
    focusOnlyWhenNeeded();

    // TODO convert local tizone.
    // const friendlyTZ = {
    //   '-8': {
    //     code: 'PST' // CAL
    //   },
    //   '-5': {
    //     code: 'EST' // NY / CANADA
    //   },
    //   '+1': {
    //     code: 'WEST' // LONDON / LX
    //   },
    //   '+2': {
    //     code: 'CET' // CENTRAL EUROPE
    //   }
    // }
  });
  
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
    max-width: 65rem;
    padding: $spacer-L $spacer-M;
    
    @media (--md) {
      font-size: $font-L;
    }

    b {
      font-weight: 500;
    }
  }

  .t-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    &Title {
    }

    &Mantra {
      color: var(--primary_1);
      text-align: center;
      font-size: $font-L2;
      max-width: 35rem;
      line-height: 1.2;
    }

    &Kicker {
      display: block;
      order: -1;
      margin: $spacer-L 0;
      text-transform: uppercase;
      color: var(--text_1);
      letter-spacing: 0.2em;
      font-size: $font-S;
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
      margin: $spacer-L 0 $spacer-M;
    }

    &.asH3 {
      font-size: $font-L2;
      margin: $spacer-L 0 $spacer-S;
    }
  }

  .t-separator {
    display: block;
    height: 170px;
    background: linear-gradient(to bottom, rgba(var(--bg_1_rgb),1) 0%, rgba(var(--bg_1_rgb),0) 100%);
    width: 100vw;
    margin-left: calc((100vw - 100%) / -2);
    margin-top: $spacer-XL;
    margin-bottom: calc($spacer-XL * -1);

  }

  .t-hook {
    font-size: $font-XL;
    font-weight: 500;
    margin: 48px 0 48px;
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
    }

    &Points {
      display: flex;
      align-items: center;
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
      
      &FlowIx:last-child {
        display: none;
      }
    }
  }

  .faq {
    &Area {
      width: 100vw;
      margin-left: calc((100vw - 100%) / -2);
    }
    &List {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: $spacer-M;
      max-width: 950px;
      margin: auto;
    }
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
  <ToggleThemePage />
</header>

<main class="wrapper blogpost">
  <header class="t-hero">
    <h1 class="t-heroTitle t-title">Web Accessibility Fundamentals</h1>
    <p class="t-heroMantra">The web is awesome and everyone should be able to enjoy it.</p>
    <span class="t-heroKicker">Online Workshop</span>
    <div class="t-heroAbout">
      <p>April 11-13 · {eventHour} {eventTZ}</p>
      <p class="t-heroCreator">with <img src="/sandrinap.jpg" alt=""  class="t-heroCreatorPic" /> <span class="t-heroCreatorName">Sandrina Pereira</span></p>
    </div>
  </header>

  <span class="t-separator"></span>

  <p class="t-p">
    Let’s be honest, as web creators, we are still leaving accessibility as an afterthought. Learning how to create web apps using modern UI libraries sounds way more exciting, <i>I understand you...</i>
  </p>

  <h2 class="t-hook">
      A11Y doesn't need to be boring.
  </h2>
  
    
  <p class="t-p">
    Perhaphs you already know that accessibility matters  and you are aware that color contrast is a thing.
  </p>

  <p class="t-p">
    But... <i>what else?</i>
  </p>

  <p class="t-p">
    In your solo journey into learning accessibility, you’ve might have visited the official 
    <a href="https://www.w3.org/WAI/" class="u-link">W3C WAI</a>
    website and took a look at the
    <a href="https://www.w3.org/TR/WCAG21" class="u-link">
    WCAG 2.1 guidelines.
    </a>
  </p>

  <p class="t-p">
    But then you felt overwhelmed, lost,... and ended up giving up.
  </p>


  <h2 class="t-hook">
      Let me simplify it for you.
  </h2>

  <p class="t-p">
    Let me show you why accessibility is worthy of being part of your skillset foundations, and how it benefits way more people that you judge, including you and me.
  </p>


  <p class="t-p">
    Let me teach you how accessibility does not limit your solutions,
    on contrary, it makes them more inclusive.
  </p>

  <h2 class="t-title asH2">
      The workshop
  </h2>
  <p class="t-p">
    This workshop will be packed with little big discoveries! We will explore every common accessibility no-nos and how to make them inclusive for as many people as possible using a mouse or a keyboard.
  </p>
  <p class="t-p">
    We'll cover multiple design patterns and development techniques that you can apply in your own projects right away.
  </p>
  <p class="t-p">
    You’ll also learn how screen readers are used, and I'll show you that there's no reason to be afraid of using it!
  </p>


  <h3 class="t-title asH3">
    By the end, you will:
  </h3>
  <ul class="t-list asCheck">
    <li>Realize how web accessibility benefits everyone</li>
    <li>Be able to identify accessibility issues;</li>
    <li>Know how to audit and use accessibility audit tools</li>
    <li>Understand how WCAG is organized</li>
    <li>Understand how the law is related to WCAG</li>
    <li>
      Find out that building inclusive websites isn’t as hard as it sounds
      <span aria-hidden="true">;)</span>
    </li>
  </ul>


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
    Workshop dynamics
  </h3>
  <p class="t-p">
    In each challenge, I’ll introduce you to a new topic with detailed resources. 
  </p>
  <p class="t-p">
    Then, you'll have a hands-on exercise to apply the concepts learned. You can solve it by yourself or in collaboration with a group of 2-3 people.
  </p>
  <p class="t-p">
    Afterwards, we go through the solution together, and I’ll clarify any question that you might have.
  </p>

  <div class="t-card t-process">
    <ul class="t-processFlow">
      <li class="t-processFlowIx">theory</li> 
      <li class="t-processFlowIx">practice</li> 
      <li class="t-processFlowIx">review</li> 
      <li class="t-processFlowIx">clarify</li> 
      <li class="t-processFlowIx">repeat</li> 
    </ul>
    <p>An interactive and effective way of learning together.</p>
  </div>


  <h3 class="t-title asH3">
    Who is this workshop for?
  </h3>
  <p class="t-p">
    It’s aimed for those who want to ensure that their websites are accessible.
  </p>
  <p class="t-p">
    Web developers are the main audience, although this is also valuable for designers, QA experts, or anyone interested in web accessibility. 
  </p>
  <p class="t-p">
    The content will be explained with beginners in mind and it gets more advanced as we go through it.
  </p>
  <p class="t-p">
    Even if you already have some experience into A11Y, you can look at this workshop as a way to solidify your knowledge and fill any existing gap.
  </p>

  <h3 class="t-title asH3">
    Pre-requisites
  </h3>
  <ul class="t-list">
    <li>Basic understanding of HTML and CSS. Javascript is a bonus;</li>
    <li>A <b>modern browser</b> installed: Chrome or Firefox are recommended;</li>
    <li>
      A <b>good internet connection</b> with
      <a class="u-link" href="http://zoom.com/" rel="noreferrer">Zoom</a>
      installed for the video call;
    </li>
    <li>
      A webcam is optional. Although I highly appreacite seeing you while I’m speaking, I want to be respectful of your own space.
    </li>
    <li>Be willing to learn something different!</li>
  </ul>


  <article class="t-card t-cta">
    <h2 class="t-ctaTitle">Join the online workshop!</h2>
    <p class="t-ctaPitch">Get 9 hours, over 3 days, to refine your A11Y knowledge.</p>

    <dl class="t-ctaPoints">
      <dt>
        <svg aria-hidden="true" class="u-svg" style="display: none;">
          <use xlink:href="#calendar" />
        </svg>
        <span class="sr-only">When:</span>
      </dt>
      <dd>April 13, 14 and 15</dd>

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
  </article>


  <h2 class="t-hook">
    I'm Sandrina, your instructor
  </h2>

  <p class="t-p">
    I’m a Frontend Engineer who helps to turn ideas into accessible experiences.
  </p>

  <p class="t-p">
    Some Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem ullam quam assumenda, culpa repudiandae quibusdam laborum nobis eius voluptate adipisci, facilis nihil maiores ut corrupti ab inventore sint, cupiditate accusamus.
  </p>


  <h2 class="t-hook">
    F.A.Q.
  </h2>

  <div class="faqArea">
    <ul class="faqList">
    <li>
        <Accordion summary="What does A11Y mean?">
          A11Y stands for 'accessibility'.
          The irony about the word "accessibility" itself is that it's not very easy to pronounce.
          So, it was created this abbreviation: A + 11 characters + Y, which has a more friendly homophone of "ally".
        </Accordion>
      </li>

      <li>
        <Accordion summary="Will the workshop be recorded?">
          No, it won't be recorded, but you’ll have access to all the materials shared.
        </Accordion>
      </li>


      <li>
        <Accordion summary="What materials are provided?">
                <!-- TODO list -->
          - The materials slides (+ 50 slides);
          - Codebase with all the mentioned resources;
          - Exercises, including the solutions explained;
        </Accordion>
      </li>

      <li>
        <Accordion summary="I know A11Y. Will I learn something new?">
          Oh, yeah. Even me, every time I give this workshop I always learn something new. Unless you are an A11Y expert, I’m confident that you’ll have an eureka moment somewhere.
        </Accordion>
      </li>

      <li>
        <Accordion summary="Is the workshop accessible?">
          The video meeting can be captioned and the exercises briefings are fully accessible. If you have any accessibility concern, please reach out to me, and we can arrange it together.
        </Accordion>
      </li>

      <li>
        <Accordion summary="What screen reader will I use?">
                        <!-- TODO list -->

          You can use the one that suits you the best. I own a Mac, which means I’ll be using Voice Over.
          During an online workshop it's not practical to help everyone using a SR (screen reader). For that reason, please take some minutes to practice in advance.
              * Mac: You'll be using VoiceOver. Watch this VO introduction.
              * Windows: Install NVDA and watch this NVDA introduction.
              * Linux: Install Orca and watch this Orca introduction.
              * SR keyboard shortcuts: VO and NVDA and Orca.
          A few days before the workshop, I will send you these guides for you to practice.
        </Accordion>
      </li>

      <li>
        <Accordion summary="Is there any discounts available?">
          The workshop is in Early Bird price for a couple of weeks. After that, there won’t be discounts available. I understand that the cost of this workshop can be too high for some people. If you are a student you can reach out to me.
        </Accordion>
      </li>

      <li>
        <Accordion summary="Can I buy a ticket to my team?">
          You can but keep it mind that 1 ticket is for o 
            <!-- TODO CLARIFY THIS -->
          per person/seat. Besides these public events, I also provide customised trainings. You can contact me to discuss private sessions options.
        </Accordion>
      </li>

      <li>
        <Accordion summary="Can I ask you questions after the workshop?">
          Of course! I will happly clarify your questions during the following week prior to the workshop.
        </Accordion>
      </li>

      <li>
        <Accordion summary="Is there a Code of Conduct?">
          Yes, mine is pretty simple: Be kind and treat each other with respect and understanding. There’s zero tolerance for unkind behavior.
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
  <Contacts />
</footer>

<SvgSprite />
