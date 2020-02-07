<script>
  import { EMAIL_URL } from '../data/misc.js';

  let contacts = [
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
</script>

<style>
  .item {
    display: inline-block;

    &:not(:last-child) {
      margin-right: $spacer-M;
    }
  }
</style>

<div class="{$$props.class}">
  <h4 class="sr-only" id="a11y_sn">Social Stuff</h4>
  <ul aria-labelledby="a11y_sn">
    {#each contacts as { name, link }, i}
      <li class="item">
        <a href={link} class="u-link link">{name}</a>
      </li>
    {/each}
  </ul>
</div>