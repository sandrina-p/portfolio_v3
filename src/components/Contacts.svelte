<script>
  import { onMount, afterUpdate } from 'svelte';
  import baffle from 'baffle';

  let elTitle;
  let elDescription;
  let baffleTitle;
  let baffleDescription;
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
    baffleDescription = baffle(elDescription).set({ characters: '+-•~!=*' });
  });

  function doBaffle(title, description) {
    isVisible = true;
    clearTimeout(stopBaffle);

    baffleTitle
      .start()
      .text(currentText => title)
      .reveal(200, 150);

    baffleDescription
      .start()
      .text(currentText => description)
      .reveal(200, 150);
  }

  function removeBaffle() {
    baffleTitle.start();
    baffleDescription.start();

    stopBaffle = setTimeout(() => {
      isVisible = false;
      baffleTitle.stop();
      baffleDescription.stop();
    }, 200);
  }

</script>

<style>
  .container {
    margin-top: 3rem;
  }

  .title,
  .description {
    display: block;
    font-size: 1.6rem;
    height: 1.6rem;
    padding-left: 0.25rem;
    opacity: 0;
    transition: opacity 50ms;

    &.isVisible {
      opacity: 1;
    }
  }

  .title {
    margin-bottom: 0.5rem;
  }

  .description {
    color: var(--text_1);
    margin-top: 1.5rem;
  }

  .item {
    display: inline-block;
    margin-right: 2.5rem;

    &:focus {
      outline: none;
    }
  }

  .icon {
    width: 4rem;
    height: 4rem;
    fill: var(--primary_1);

    &.twitter {
      width: 4.1rem;
      height: 4.1rem;
    }

    &.codepen {
      width: 3.9rem;
      height: 3.9rem;
    }

    &.email {
      width: 4.6rem;
      height: 4.6rem;
    }

    .link:hover &,
    .link:focus & {
      fill: var(--text_0);
    }
  }
</style>

<div class="container {$$props.class}">
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
  <span class="description" class:isVisible aria-hidden="true" bind:this={elDescription} />
</div>