<script>
  import HeadMeta from '../components/HeadMeta.svelte';
  import ToggleTheme from '../components/navigation/ToggleTheme.svelte';
  import Nav from '../components/navigation/Nav.svelte';
  import Contacts from '../components/Contacts.svelte';
  import { TWITTER_URL, SITE_URL } from '../data/misc.js';

  const emailRegex = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;
  const MAIL_TO = 'mailto:a.sandrina.p@gmail.com?subject=Workshop%20-%20Accessibility%20Fundamentals&body=So,%20I%20was%20checking%20your%20"Accessibility%20Fundamentals"%20workshop%20and...';

  let isSubmitting = false;
  let isSubmitted = false;
  let hasInlineError = false;
  
  let formName = '';
  let formEmail = '';
  let formReason = '';
  let formTime = [];

  let warnings = {}
  let errors = {
    name: false,
    email: false,
    reason: false,
    time: false,
  }

  // TODO - DRY these validations... on a next workshop maybe!

  function handleChange(e, field) {
    const value = e.target.value
    switch (field) {
      case 'name':
        if (errors.name && !!value) {
          errors.name = ''
        }
        break;
      case 'email':
        if (errors.email && !!value) {
          errors.email = ''
        }
        break;
      case 'reason':
        if (errors.reason && !!value) {
          errors.reason = ''
        }
        if (value.length >= 350) {
          warnings.reason = "That's enough Shakespeare 🧐"
        }
        break;
      case 'time':
        if (errors.time) {
          errors.time = ''
        }
        break;
      default:
        break;
    }
  }

  function handleBlur(e, field) {
    const value = e.target.value

    switch (field) {
      case 'name':
        if (!value) {
          errors.name = 'Your name is required.'
        }
        break;
      case 'email':
        if (!value) {
          errors.email = 'Your e-mail is required.'
        }
        break;
      case 'reason':
        if (value.length < 15) {
          errors.reason = "Don't be shy, tell me more."
        }
        break;
      default:
        break;
    }
  }

  async function handleSubmit(event) {
    if (isSubmitting) { return }
    console.log(formName, formEmail, formReason, formTime)

    if (!formName) {
      errors.name = 'Your name is required.';
      hasInlineError = true;
    }

    if (!formEmail) {
      errors.email = 'Your e-mail is required.';
      hasInlineError = true;
    } else if (!formEmail.match(emailRegex)) {
      errors.email = 'Your e-mail does not seem valid.';
      hasInlineError = true;
    }

    if (formReason.length < 15) {
      errors.reason = "Don't be shy, tell me more.";
      hasInlineError = true;
    }

    if (!formTime.length) {
      errors.time = 'Select a time slot.';
      hasInlineError = true;
    } else if (formTime.length > 1 && formTime.includes('none')) {
      errors.time = 'You seem undecided... You can either pick "None" or a time slot, but not both.';
      hasInlineError = true;
    }

    if (hasInlineError) { return }

    isSubmitting = true;

    try {
      await fetch('https://api.formik.com/submit/sandrina-p/accessibility-fundamentals', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({formName, formEmail, formReason, formTime}),
      });
    } catch (e) {
      isSubmitting = false;
      console.error('Error! :(', e);
      return 
    }
    isSubmitting = false;
    isSubmitted = true;
  }
</script>

<style>
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

    strong {
      display: block;
      font-weight: 500;
    }
  }

  .card {
    background: var(--bg_1);
    margin: $spacer-XL 0;
    padding: $spacer-L $spacer-M;
    border-radius: 3px;

    @media (--md) {
      padding: $spacer-LM $spacer-L;
    }

    &-title {
      font-size: $font-XL;
      margin-bottom: $spacer-M;

      span {
        color: var(--primary_1_sat);
      }
    }

    &-txt {
      margin-bottom: 2.4rem;

      strong { font-weight: 600; }
    }
  }

  .ascii {
    font-family: monospace;
    font-size: 2.9vw;
    margin: $spacer-MS 0;
    color: var(--text_1);

    @media(--md) {
      font-size: $font-L;
    }
  }

  .field {
    display: block;
    margin-bottom: $spacer-MS;

    &.error {
      .field-input,
      .field-textarea {
        border-color: var(--error);
      }
    }

    &-label {
      display: block;
      font-weight: 500;
    }

    &-tip {
      color: var(--text_1);
      font-size: $font-S;
    }

    &-input,
    &-textarea {
      display: block;
      margin: $spacer-S 0;
      width: 100%;
      max-width: 30rem;
      height: 3.5rem;
      font-size: inherit;
      color: inherit;
      padding: $spacer-S;
      background-color: var(--bg_1);
      border: 1px solid var(--text_1);
      border-radius: 0.3rem;

      &:hover {
        border-color: var(--text_0);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px var(--primary_1);
      }
    }

    &-textarea {
      max-width: none;
      height: auto;
      resize: vertical;
    }

    &-error,
    &-info {
      display: block;
      font-size: $font-M;
    }

    &-error {
      color: var(--error);
    }

    &-info {
      color: var(--text_0);
      font-style: italic;
    }

    &-checkbox {
      display: block;
      margin-top: $spacer-S;
    }
  }

  .btn-submit {
    background-color: var(--primary_1);
    text-align: center;
    padding: $spacer-S $spacer-MS;
    font-size: $font-L;
    color: #fff;
    border-radius: 3px;
    border: none;
    margin-top: $spacer-S;
    cursor: pointer;

    &:hover,
    &:focus {
      background-color: var(--primary_1_sat);
    }

    &[disabled] {
      cursor: not-allowed;
    }
  }

  .divider {
    display: block;
    border-bottom: 1px solid var(--primary_1);
    opacity: 0.5;
    margin: $spacer-L 0;
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
  title="Accessibility Fundamentals - Workshop"
  description="In this workshop we'll explore every common accessibility no-nos and learn how to make them work properly for everyone using a mouse or a keyboard."
  coverUrl={ `${SITE_URL}/cover_a11y.png` }
/>

<svelte:head>
<script type="application/ld+json">[
{
  "@context": "http://schema.org",
  "@type": "WebSite",
  "url": "https://sandrina-p.net/workshop-a11y-fundamentals",
  "name": "Accessibility Fundamentals - Workshop",
  "alternateName": "A11Y Fundamentals"
}, {
  "@context": "http://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "item": {
      "@id": "https://sandrina-p.net/workshop-a11y-fundamentals",
      "name": "Accessibility Fundamentals - Workshop",
      "image": "https://sandrina-p.net/cover_a11y.png"
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
  "headline": "Accessibility Fundamentals - Workshop",
  "image": {
    "@type": "ImageObject",
    "url": "https://sandrina-p.net/cover_a11y.png",
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
  "description": "In this workshop we'll explore every common accessibility no-nos and learn how to make them work properly for everyone using a mouse or a keyboard."
}
 ]</script>
</svelte:head>

<header class="header">
  <ToggleTheme klass="toggleTheme" />
  <!-- <Nav on:calculated={() => true} horizonSpace="10000" /> -->
</header>

<main class="wrapper">
<h1 class="f-title title">Accessibility Fundamentals</h1>
<p class="rw">Remote Workshop <span class="rw-d">•</span> April 22th <span class="rw-d">•</span> <span class="rw-t">4 Hours</span></p>

<p class="f-title subtitle hithere">The web is awesome and everyone should be able to enjoy it.</p>

<p class="p">
  Hi there, I'm <a href={ SITE_URL } rel="noreferrer" class="u-link">Sandrina Pereira</a> and I believe that making the web accessible is our duty as web developers.
</p>
<p class="p">
  Because of the current events <span class="(#stayHome)">🦠</span> I decided to make a remote version of my workshop for the first time ever! 
</p>
  
<p class="p">
  This workshop will be full of little big exercises.
  We will explore every common accessibility no-nos and how to make them work
  properly for everyone using a mouse or a keyboard.
  Additionally, I will show you how to use a screen reader, and show you that there's no reason to be afraid of using it!
</p>
<p class="p">
  By the end of the workshop, you will: 
</p>
<ul class="list as-check">
  <li>Understand why web accessibility matters;</li>
  <li>Know how to build accessible web pages;</li>
  <li>Be able to identify accessibility issues;</li>
  <li>Know how to use accessibility tools;</li>
  <li>Find out that building accessible websites isn’t as hard as it sounds <span aria-hidden="true">;)</span></li>
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
  <li>Basic understanding of HTML and CSS (Javascript is a bonus);</li>
  <li>A modern browser installed: Chrome or Firefox are recommended;</li>
  <li>Have <a class="u-link" href="https://zoom.us" rel="noreferrer">Zoom</a> installed for the video call;</li>
  <li>Be willing to learn something different!</li>
</ul>

{#if !isSubmitted}
<form class="card" on:submit|preventDefault={handleSubmit}>
  <h3 class="f-title card-title">Want to join? Mark your spot!</h3>

  <p class="card-txt field-tip">
    This <strong>workshop is totally free</strong>! There are 30 available spots, subject to approval.
    <br/>
    If you have any questions, feel free to send me an e-mail at <a class="u-link" href={ MAIL_TO }>a.sandrina.p@gmail.com</a>.  
  </p>

  <label class="field" class:error={errors.name}>
    <span class="field-label">Your name</span>
    <input type="text" class="field-input" aria-required
      on:keyup={(e) => handleChange(e, 'name')}
      on:blur={(e) => handleBlur(e, 'name')}
      bind:value={ formName }
    >
    {#if errors.name} <span class="field-error">{errors.name}</span> {/if}
  </label>

  <label class="field" class:error={errors.email}>
    <span class="field-label">Your e-mail</span>
    <input type="text" inputmode="email" class="field-input" aria-required
      on:keyup={(e) => handleChange(e, 'email')}
      on:blur={(e) => handleBlur(e, 'email')}
      bind:value={ formEmail }>
    {#if errors.email} <span class="field-error">{errors.email}</span> {/if}
  </label>

  <!-- <span class="divider"></span> -->

  <label class="field" class:error={errors.reason}>
    <span class="field-label">Why do you want to join the workshop?</span>
    <span class="field-tip">Your answer will be used to help me approve your spot.</span>
    <textarea class="field-textarea" rows="5" maxLength="500"
      on:keyup={(e) => handleChange(e, 'reason')}
      on:blur={(e) => handleBlur(e, 'reason')}
      bind:value={ formReason }
    ></textarea>
    {#if errors.reason} <span class="field-error">{errors.reason}</span> {/if}
    {#if warnings.reason} <span class="field-info">{warnings.reason}</span> {/if}
  </label>

  <fieldset class="field">
    <span class="field-label">What time slots work for you on April 22th?</span>
    <span class="field-tip">
      This will help me to decide what's the best slot for most of the people.
    </span>
    
    <label class="field-checkbox">
      <input type="checkbox" name="slot" value="morning"
        on:change={(e) => handleChange(e, 'time')}
        bind:group={ formTime }
      > 9 PM - 1 PM <a class="u-link" target="_blank" href="https://everytimezone.com/s/5659d1ce">(UTC+1 See timezone)</a>
    </label>

    <label class="field-checkbox">
      <input type="checkbox" name="slot" value="afternoon"
        on:change={(e) => handleChange(e, 'time')}
        bind:group={ formTime }
      > 2 PM - 6 PM <a class="u-link" target="_blank" href="https://everytimezone.com/s/90385a12">(UTC+1 See timezone)</a>
    </label>

    <label class="field-checkbox">
      <input type="checkbox" name="slot" value="none"
        on:change={(e) => handleChange(e, 'time')}
        bind:group={ formTime }
      > None 😭 
    </label>
    {#if errors.time} <span class="field-error">{errors.time}</span> {/if}
  </fieldset>

  <button type="submit" disabled={isSubmitting} class="btn-submit">
    {!isSubmitting ? 'Join the workshop' : 'Sending...'}
  </button>
</form>

{:else}

<div class="card">
  <h2 class="f-title card-title">
    That's all! <span aria-hidden="true">🎉</span>
  </h2>
  <p class="p">
    I'll get back to you in a few days (up to one week) with more details about the workshop!
    If you have any questions, feel free to send me an e-mail at <a class="u-link" href={ MAIL_TO }>a.sandrina.p@gmail.com</a>.
  </p>

  <span class="divider"></span>

  <h2 class="f-title card-title">
    <span>By the way...</span>
    <br/>
    Here's why A11Y means Accessibility
  </h2>
  <p class="p">
    The term A11Y is a numeronym, a form of abbreviation.
    <strong>A11Y means A + 11 characters + Y.</strong>
  </p>

  <pre class="ascii" role="img" alt="explanation about Accessibility word, showing there's 11 characters between the first character A and last character Y.">
.   a | c  c  e  s  s  i  b  i  l  i  t  | y   .
.     | 1  2  3  4  5  6  7  8  9  10 11 |     .
.     |__________________________________|     .
.                      ↓↓                      .
.                     A11Y                     .
  </pre>
  <p>Read more tips like this, by following me on <a class="u-link" href={TWITTER_URL} target="_blank" rel="noreferrer">Twitter</a>!</p>
</div>
{/if}
</main>

<footer class="footer">
  <p>Made without coffee by <a class="u-link" href={ SITE_URL } rel="noreferrer">Sandrina Pereira</a>.</p>
  <Contacts />
</footer>



