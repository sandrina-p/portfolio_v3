<script>
  import { EMAIL_URL, EMAIL_URL_WORKSHOP } from '../data/misc.js';
  import { sendGA } from '../utils';

  export let essentialOnly;
  export let isWorkshop;

  const contacts = [
    {
      name: 'twitter',
      link: 'http://twitter.com/a_sandrina_p',
    },
    {
      name: 'e-mail',
      link: isWorkshop ? EMAIL_URL_WORKSHOP : EMAIL_URL,
    },
    {
      name: 'codepen',
      link: 'http://codepen.io/sandrina-p',
    },
    {
      name: 'dev.to',
      link: 'http://dev.to/a_sandrina_p',
    },
  ];

  const contactsList = essentialOnly ? [contacts[0], contacts[1]] :contacts
</script>

<style lang="postcss">
  .row {
    .item {
      display: inline-block;
  
      &:not(:last-child) {
        margin-right: $spacer-M;

        @media (--md) {
          margin-right: $spacer-MS;
        }
      }
    }
  }

  .column {
    .item {
      display: block;
      
      &:not(:last-child) {
        margin-bottom: $spacer-S;
      }
    }
  }
</style>

<div class={$$props.class} class:row={!essentialOnly} class:column={!!essentialOnly}>
  <address>
    <p class="sr-only" id="a11y_sn">Contacts</p>
    <ul aria-labelledby="a11y_sn">
      {#each contactsList as { name, link }, i}
        <li class="item">
          <a
            href={link}
            rel="noreferrer"
            target="_blank"
            class="u-link link"
            on:click={() => sendGA('send', 'event', 'click', 'contacts', name)}>
            {name}
          </a>
        </li>
      {/each}
    </ul>
  </address>
</div>
