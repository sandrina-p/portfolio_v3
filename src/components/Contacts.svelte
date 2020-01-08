<script>
  import { onMount, afterUpdate } from 'svelte';
  import baffle from 'baffle';

  let elTitle;
  let baffleTitle;
  let isVisible;
  let stopBaffle;

  let contacts = [
    {
      name: 'Dev.to',
      link: '//dev.to/a_sandrina_p',
      svg: 'dev',
      description: 'The web is not only about code',
    },
    {
      name: 'Codepen',
      link: '//codepen.io/sandrina-p',
      svg: 'codepen',
      description: 'Because coding without fun is just boring',
    },
    {
      name: 'Twitter',
      link: '//twitter.com/a_sandrina_p',
      svg: 'twitter',
      description: 'Where ideas are shared',
    },
    {
      name: 'Email',
      link:
        'mailto:a.sandrina.p@gmail.com?subject=Oh, hi there!&body=Hi Sandrina, I just saw your personal website and...',
      svg: 'email',
      description: 'Waiting for you message!',
    },
  ];

  onMount(() => {
    baffleTitle = baffle(elTitle).set({ characters: '+-•~!=*' });
  });

  function doBaffle(title, description) {
    isVisible = true;
    clearTimeout(stopBaffle);

    baffleTitle
      .start()
      .text(currentText => `${title}: ${description}`)
      .reveal(200, 150);
  }

  function removeBaffle() {
    baffleTitle.start();

    stopBaffle = setTimeout(() => {
      isVisible = false;
      baffleTitle.stop();
    }, 200);
  }

</script>

<style>
  .title {
    display: block;
    font-size: var(--font-M);
    height: 1em;
    padding-left: var(--spacer-XS);
    margin-bottom: var(--spacer-S);
    color: var(--text_1);
    opacity: 0;
    transition: opacity 50ms;

    &.isVisible {
      opacity: 1;
    }
  }


  .item {
    display: inline-block;
    margin-right: 2.5rem;

    &:focus {
      outline: none;
    }
  }

  .icon {
    width: 3rem;
    height: 3rem;
    fill: var(--text_1);

    &.twitter {
      width: 3.1rem;
      height: 3.1rem;
    }

    &.codepen {
      width: 2.9rem;
      height: 2.9rem;
    }

    &.email { /* TODO - better icon */
      width: 3.3rem;
      height: 3.3rem;
    }

    .link:hover &,
    .link:focus & {
      fill: var(--primary_1);
    }
  }
</style>

<div class="{$$props.class}">
  <h2 class="sr-only">Social Networks</h2>
  <span class="title" class:isVisible aria-hidden="true" bind:this={elTitle} />
  <ul class="list">
    {#each contacts as { name, link, svg, description }, i}
      <li class="item">
        <a
          href={link}
          target="_blank"
          aria-label="{name}: {description}"
          class="link"
          on:mouseenter={() => doBaffle(name, description)}
          on:focus={() => doBaffle(name, description)}
          on:mouseleave={removeBaffle}
          on:blur={removeBaffle}>
          <svg aria-hidden="true" class="icon {svg}">
            <use xlink:href="#{svg}" />
          </svg>
        </a>
      </li>
    {/each}
  </ul>
</div>