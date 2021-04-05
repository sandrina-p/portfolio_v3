<script>
  import { EMAIL_URL } from '../data/misc.js';
  import { sendGA } from '../utils';

  export let essentialOnly;

  const contacts = [
    {
      name: 'dev.to',
      link: 'http://dev.to/a_sandrina_p',
    },
    {
      name: 'codepen',
      link: 'http://codepen.io/sandrina-p',
    },
    {
      name: 'twitter',
      link: 'http://twitter.com/a_sandrina_p',
    },
    {
      name: 'e-mail',
      link: EMAIL_URL,
    },
  ];

  const contactsList = essentialOnly ? [contacts[2], contacts[3]] :contacts
</script>

<style lang="postcss">
  .item {
    display: inline-block;

    &:not(:last-child) {
      margin-right: $spacer-M;
    }
  }
</style>

<div class={$$props.class}>
  <address>
    <p class="sr-only" id="a11y_sn">Social Stuff</p>
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
