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
      description: 'Where almost everything is shared',
    },
    {
      name: 'Email',
      link:
        'mailto:a.sandrina.p@gmail.com?subject=Oh, hi there!&body=Hi Sandrina, I just saw your personal website and...',
      svg: 'email',
      description: 'Waiting for you message...',
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

<div class="container">
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

<svg xmlns="http://www.w3.org/2000/svg" style="display: none">
  <symbol id="twitter">
    <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5T1369.5 1125 1185 1335.5t-258 146-323
        54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5T285 1033q33 5 61 5 43 0
        85-11-112-23-185.5-111.5T172 710v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149
        294.5 238.5T884 653q-8-38-8-74 0-134 94.5-228.5T1199 256q140 0 236 102 109-21 205-78-37
        115-142 178 93-10 186-50z" />
    </svg>
  </symbol>
  <symbol id="codepen">
    <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M216 1169l603 402v-359L485 989zm-62-144l193-129-193-129v258zm819 546l603-402-269-180-334
        223v359zm-77-493l272-182-272-182-272 182zM485 803l334-223V221L216 623zm960 93l193
        129V767zm-138-93l269-180-603-402v359zm485-180v546q0 41-34 64l-819 546q-21 13-43 13t-43-13L34
        1233q-34-23-34-64V623q0-41 34-64L853 13q21-13 43-13t43 13l819 546q34 23 34 64z" />
    </svg>

  </symbol>
  <symbol id="dev">
    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45
        11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1
        32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0
        43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61
        47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01
        70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15
        8.56-20.41 19.71-20.69h63.19l-.01 29.52zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44
        0l-38.53-144.8h32.57l29.71 113.72 29.57-113.72h32.58l-38.46 144.8z" />
    </svg>

  </symbol>
  <symbol id="email">
    <svg viewBox="0 0 100 95">
      <g transform="translate(0,-952.36218)">
        <path
          style="color:#000000;enable-background:accumulate"
          d="M 13.4375,974.36219 50,1008.2684 l 36.5625,-33.90621 -73.125,0 z m -4.4375001,4.0625
          0,47.68751 L 33.75,1001.3622 8.9999999,978.42469 z m 82.0000001,0 -24.75,22.93751
          24.75,24.75 0,-47.68751 z m -52.875,27.03121 -24.90625,24.9063 73.5625,0
          -24.90625,-24.9063 -9.84375,9.0938 a 3.0003,3.0003 0 0 1 -4.0625,0 l -9.84375,-9.0938 z" />
      </g>
    </svg>
  </symbol>
</svg>
