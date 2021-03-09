<script>
  import HeadMeta from '../components/HeadMeta.svelte';
  import ToggleTheme from '../components/navigation/ToggleTheme.svelte';
  import Nav from '../components/navigation/Nav.svelte';
  import Contacts from '../components/Contacts.svelte';
  import { TWITTER_URL, SITE_URL } from '../data/misc.js';

  // props
  export let formEndpoint;

  const emailRegex = /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/;
  const MAIL_TO = 'mailto:a.sandrina.p@gmail.com?subject=Workshop%20-%20Accessibility%20Fundamentals&body=So,%20I%20was%20checking%20your%20"Accessibility%20Fundamentals"%20workshop%20and...';

  let isFormSubmitting = false;
  let isFormSubmitted = false;
  let formErrorMsg = '';
  
  let hasInlineError = false;

  let first_name = '';
  let email_address = '';
  // let formReason = '';
  let form_time = [];

  let warnings = {}
  let errors = {
    name: null,
    email: null,
    // reason: null,
    time: null,
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

    if (!form_time.length) {
      errors.time = 'Select a time slot.';
      hasInlineError = true;
    } else if (form_time.length > 1 && form_time.includes('none')) {
      errors.time = 'You seem undecided... You can either pick "None" or a time slot, but not both.';
      hasInlineError = true;
    }

    if (hasInlineError) { return }

    isFormSubmitting = true;

    try {
      await fetch(formEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
        },
        body: JSON.stringify({first_name, email_address, form_time }),
      });
    } catch (e) {
      console.error('Error on submit!', e)
      formErrorMsg = e.message;
    }
    isFormSubmitting = false;
    isFormSubmitted = true;
  }
</script>

<style lang="postcss">
  .p {
    margin-bottom: $spacer-M;

    strong {
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
    }
  }

  .feedbackMsg {
    font-size: $font-L2;
    padding: $spacer-M 0 $spacer-M;
  }

  .feedbackTip {
    font-size: $font-M;
  }

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
      background-color: var(--primary_1);
    }

    &[disabled] {
      cursor: not-allowed;
    }
  }

  .u-danger {
    color: var(--error);
  }

  .u-primary {
    color: var(--primary_1);
  }
</style>

{#if !isFormSubmitted}
<form class="card" on:submit|preventDefault={handleSubmit}>
  <h3 class="f-title card-title">Want to join? <span class="u-primary">Mark your spot!</h3>

  <p class="card-txt field-tip">
    Be the first to know when this workshop is scheduled, with access to exclusive discounts!
  </p>

  <label class="field" class:error={errors.name}>
    <span class="field-label">Your name</span>
    <input type="text" class="field-input" aria-required
      aria-invalid={!!errors.name}
      on:keyup={(e) => handleChange(e, 'name')}
      on:blur={(e) => handleBlur(e, 'name')}
      bind:value={ first_name }
    >
    {#if errors.name} <span class="field-error">{errors.name}</span> {/if}
  </label>

  <label class="field" class:error={errors.email}>
    <span class="field-label">Your e-mail</span>
    <input type="text" inputmode="email" class="field-input" aria-required
      aria-invalid={!!errors.email}
      on:keyup={(e) => handleChange(e, 'email')}
      on:blur={(e) => handleBlur(e, 'email')}
      bind:value={ email_address }>
    {#if errors.email} <span class="field-error">{errors.email}</span> {/if}
  </label>

  <fieldset class="field">
    <legend class="field-label">What time slots work the best for you?</legend>
    <span class="field-tip">
      This will help me to decide what's the best schedule for most of the people.
    </span>
    
    <label class="field-checkbox">
      <input type="checkbox" name="slot" value="morning"
        on:change={(e) => handleChange(e, 'time')}
        bind:group={ form_time }
      > 9 AM - 1 PM UTC</label>

    <label class="field-checkbox">
      <input type="checkbox" name="slot" value="afternoon"
        on:change={(e) => handleChange(e, 'time')}
        bind:group={ form_time }
      > 2 PM - 6 PM UTC</label>

    <label class="field-checkbox">
      <input type="checkbox" name="slot" value="none"
        on:change={(e) => handleChange(e, 'time')}
        bind:group={ form_time }
      > None 😭 
    </label>
    {#if errors.time} <span class="field-error">{errors.time}</span> {/if}
  </fieldset>

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
  {/if}
</div>
{/if}



