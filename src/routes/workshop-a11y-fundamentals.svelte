<script>
  import HeadMeta from '../components/HeadMeta.svelte';
  import ToggleTheme from '../components/navigation/ToggleTheme.svelte';
  import Nav from '../components/navigation/Nav.svelte';
  import Contacts from '../components/Contacts.svelte';
  import { TWITTER_URL, SITE_URL } from '../data/misc.js';

  const emailRegex = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;
  const MAIL_TO = 'mailto:a.sandrina.p@gmail.com?subject=Workshop%20-%20Accessibility%20Fundamentals&body=So,%20I%20was%20checking%20your%20"Accessibility%20Fundamentals"%20workshop%20and...';

  let isFormSubmitting = false;
  let isFormSubmitted = false;
  let formErrorMsg = '';
  
  let hasInlineError = false;

  let first_name = '';
  let email_address = '';
  // let formReason = '';
  // let form_time = [];

  let warnings = {}
  let errors = {
    name: false,
    email: false,
    // reason: false,
    // time: false,
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
      // case 'reason':
      //   if (errors.reason && !!value) {
      //     errors.reason = ''
      //   }
      //   if (value.length >= 350) {
      //     warnings.reason = "That's enough Shakespeare 🧐"
      //   }
      //   break;
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
      // case 'reason':
      //   if (value.length < 15) {
      //     errors.reason = "Don't be shy, tell me more."
      //   }
      //   break;
      default:
        break;
    }
  }

  async function handleSubmit(event) {
    if (isFormSubmitting) { return }
    console.log(first_name, email_address)
    hasInlineError = false;

    if (!first_name) {
      errors.name = 'Your name is required.';
      hasInlineError = true;
    }

    if (!email_address) {
      errors.email = 'Your e-mail is required.';
      hasInlineError = true;
    } else if (!email_address.match(emailRegex)) {
      errors.email = 'Your e-mail does not seem valid.';
      hasInlineError = true;
    }

    // if (formReason.length < 15) {
    //   errors.reason = "Don't be shy, tell me more.";
    //   hasInlineError = true;
    // }

    // if (!form_time.length) {
    //   errors.time = 'Select a time slot.';
    //   hasInlineError = true;
    // } else if (form_time.length > 1 && form_time.includes('none')) {
    //   errors.time = 'You seem undecided... You can either pick "None" or a time slot, but not both.';
    //   hasInlineError = true;
    // }

    if (hasInlineError) { return }

    isFormSubmitting = true;

    try {
      await fetch('https://app.convertkit.com/forms/1318242/subscriptions', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
        },
        body: JSON.stringify({first_name, email_address}),
      });
    } catch (e) {
      console.error('Error on submit!', e)
      formErrorMsg = e.message;
    }
    isFormSubmitting = false;
    isFormSubmitted = true;
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
      /* display: block; */
      font-weight: 500;
    }
  }

  .card {
    background: var(--bg_1);
    margin: $spacer-XL 0;
    max-width: 44rem;
    padding: $spacer-L $spacer-M;
    border-radius: 3px;

    @media (--md) {
      padding: $spacer-LM $spacer-L;
    }

    &-title {
      font-size: $font-XL;
      margin-bottom: $spacer-M;
    }

    &-txt {
      margin-bottom: 2.4rem;

      /* strong { font-weight: 600; } */
    }
  }

  .feedbackMsg {
    font-size: $font-L2;
    padding: $spacer-M 0 $spacer-M;
  }

  .feedbackTip {
    font-size: $font-M;
  }

  /* .ascii {
    font-family: monospace;
    font-size: 2.9vw;
    margin: $spacer-MS 0;
    color: var(--text_1);

    @media(--md) {
      font-size: $font-L;
    }
  } */

  .field {
    display: block;
    margin-bottom: $spacer-MS;

    &.error {
      .field-input {
      /* .field-textarea { */
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

    /* &-textarea, */
    &-input {
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

    /* &-textarea {
      max-width: none;
      height: auto;
      resize: vertical;
    } */

    &-error {
      display: block;
      font-size: $font-M;
    }

    &-error {
      color: var(--error);
    }

    /* &-info {
      color: var(--text_0);
      font-style: italic;
    } */

    /* &-checkbox {
      display: block;
      margin-top: $spacer-S;
    } */
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

  /* .divider {
    display: block;
    border-bottom: 1px solid var(--primary_1);
    opacity: 0.5;
    margin: $spacer-L 0;
  } */

  .footer {
    text-align: center;
    padding: $spacer-L 0;
    background: var(--bg_1);

    p {
      margin-bottom: $spacer-S;
    }
  }

  .u-danger {
    color: var(--error);
  }

  .u-primary {
    color: var(--primary_1_sat);
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
<p class="rw">Remote Workshop <span class="rw-d">•</span> <span class="rw-t">4 Hours</span></p>

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

{#if !isFormSubmitted}
<form class="card" on:submit|preventDefault={handleSubmit}>
  <h3 class="f-title card-title">Want to join? <span class="u-primary">Mark your spot!</h3>

  <p class="card-txt field-tip">
    Be the first to know when this workshop is scheduled, with access to exclusive discounts!
  </p>

  <label class="field" class:error={errors.name}>
    <span class="field-label">Your name</span>
    <input type="text" class="field-input" aria-required
      on:keyup={(e) => handleChange(e, 'name')}
      on:blur={(e) => handleBlur(e, 'name')}
      bind:value={ first_name }
    >
    {#if errors.name} <span class="field-error">{errors.name}</span> {/if}
  </label>

  <label class="field" class:error={errors.email}>
    <span class="field-label">Your e-mail</span>
    <input type="text" inputmode="email" class="field-input" aria-required
      on:keyup={(e) => handleChange(e, 'email')}
      on:blur={(e) => handleBlur(e, 'email')}
      bind:value={ email_address }>
    {#if errors.email} <span class="field-error">{errors.email}</span> {/if}
  </label>

  <!-- <fieldset class="field">
    <span class="field-label">What time slots work the best for you?</span>
    <span class="field-tip">
      This will help me to decide what's the best schedule for most of the people.
    </span>
    
    <label class="field-checkbox">
      <input type="checkbox" name="slot" value="morning"
        on:change={(e) => handleChange(e, 'time')}
        bind:group={ form_time }
      > 9 AM - 1 PM <a class="u-link" target="_blank" href="https://everytimezone.com/s/5659d1ce?t=5e9f8900,1e0">(UTC+1 See timezone)</a>
    </label>

    <label class="field-checkbox">
      <input type="checkbox" name="slot" value="afternoon"
        on:change={(e) => handleChange(e, 'time')}
        bind:group={ form_time }
      > 2 PM - 6 PM <a class="u-link" target="_blank" href="https://everytimezone.com/s/a5b961ec">(UTC+1 See timezone)</a>
    </label>

    <label class="field-checkbox">
      <input type="checkbox" name="slot" value="none"
        on:change={(e) => handleChange(e, 'time')}
        bind:group={ form_time }
      > None 😭 
    </label>
    {#if errors.time} <span class="field-error">{errors.time}</span> {/if}
  </fieldset> -->

  <button type="submit" disabled={isFormSubmitting} class="btn-submit">
    {!isFormSubmitting ? 'Reserve your spot' : 'Sending...'}
  </button>
</form>

{:else}
<div class="card">
  {#if !formErrorMsg}
    <h2 class="f-title card-title">
      <span class="u-primary">Cool!</span> One last thing...
    </h2>
    <p class="p feedbackMsg">
      Go <strong>check your inbox</strong> to confirm <span class="u-nowrap">your e-mail!</span>
    </p>

    <p class="p feedbackTip">
      Didn't receive an e-mail? Send me one directly at <a class="u-link" href={ MAIL_TO } target="_blank">a.sandrina.p@gmail.com</a> and I'll reserve your spot!
    </p>
  {:else}
    <h2 class="f-title card-title">
      <span class="u-danger">Ups!</span> Something went wrong...
    </h2>
    <p class="p feedbackMsg">
      Error: {formErrorMsg}
    </p>
    <p class="p feedbackTip">
      Please send me an e-mail directly at <a class="u-link" href={ MAIL_TO } target="_blank">a.sandrina.p@gmail.com</a> reporting the above error and I'll reserve your spot!
    </p>


  <!-- <p>If you have any questions, feel free to send me an e-mail at <a class="u-link" href={ MAIL_TO } target="_blank">a.sandrina.p@gmail.com</a>.</p> -->

  <!-- <span class="divider"></span>

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
  <p>Read more tips like this, by following me on <a class="u-link" href={TWITTER_URL} target="_blank" rel="noreferrer">Twitter</a>!</p> -->
  {/if}
</div>
{/if}
</main>

<footer class="footer">
  <p>Made without coffee by <a class="u-link" href={ SITE_URL } rel="noreferrer">Sandrina Pereira</a>.</p>
  <Contacts />
</footer>



