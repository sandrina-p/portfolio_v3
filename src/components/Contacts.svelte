<script>
  import { onMount, afterUpdate } from 'svelte';
  import baffle from 'baffle';

  let elDescr;
  let baffleTitle;
  let isVisible;
  let stopBaffle;

  let contacts = [
    {
      name: 'dev.to',
      link: 'http://dev.to/a_sandrina_p',
      svg: 'dev',
      description: 'development is more than code',
    },
    {
      name: 'codepen',
      link: 'http://codepen.io/sandrina-p',
      svg: 'codepen',
      description: 'coding without fun is just boring',
    },
    {
      name: 'twitter',
      link: 'http://twitter.com/a_sandrina_p',
      svg: 'twitter',
      description: 'where ideas are shared',
    },
    {
      name: 'email',
      link:
        'mailto:a.sandrina.p@gmail.com?subject=Oh, hi there!&body=Hi Sandrina, I just saw your personal website and...',
      svg: 'email',
      description: 'old, but gold!',
    },
  ];

  onMount(() => {
    baffleTitle = baffle(elDescr).set({ characters: '+-•~!=*' });
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
  .text {
    display: block;
    font-size: var(--font-M);
    height: 1em;
    /* padding-left: var(--spacer-XS); */
    margin-top: var(--spacer-S);
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
  <h3 class="sr-only">Social Networks</h3>
  <ul class="list">
    {#each contacts as { name, link, svg, description }, i}
      <li class="item">
        <a
          href={link}
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
  <span class="text" class:isVisible aria-hidden="true" bind:this={elDescr} />
</div>