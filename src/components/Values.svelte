<script>
  import { onMount, afterUpdate } from 'svelte';
  import { getInLimit } from '../utils';
  let elContainer = null;
  let s3Y = 0;

  onMount(() => {
    listenForS3();
  });

  function listenForS3() {
    const s3Width = 600;
    // const horizonWidth = elContainer.offsetWidth;
    const io = 1.5; // because it's the 2nd element
    // start animation at middle of the screen
    const startPosition = window.innerWidth * io + s3Width / 3;
    const Ylimit = 85 * 2;

    document.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const translate = scrollY - startPosition;
      const tooSmall = translate < 0;
      const tooBig = translate > Ylimit;

      s3Y = getInLimit(translate / 2, 0, Ylimit / 2);
    });
  }
</script>

<style>
  .container {
    display: flex;
    align-items: center;
    padding-left: 25vw;

    > * {
      padding-right: var(--spacer-XL);
      position: relative;
      min-width: 100vw;
      height: 100vh;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .title {
    font-size: var(--font-heading_1);
  }

  .subtitle {
    font-size: var(--font-heading_1);
  }

  .c-text {
    line-height: 1.5;
    font-size: 2.4rem;
  }

  .s1 {
  }

  .s2 {
    position: relative;

    &-title {
      position: relative;
      line-height: 1;
    }

    &-text {
      width: 38rem;
      margin-left: 37rem;
      margin-top: 4rem;
    }

    &-pattern {
      display: block;
      position: absolute;
      top: 250%;
      left: 0;
      transform: translate(-100%, -100%) rotate(-25deg);
      transform-origin: 0 0;
      width: 20rem;
      height: 60rem;
      background-image: radial-gradient(var(--primary_1) 25%, transparent 25%);
      background-size: 1rem 1rem;
      background-position: 0 0;
      opacity: 0.8;
      z-index: -1;
    }
  }

  .s3 {
    position: relative;

    &-title {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);

      &-part {
        position: relative;
        display: block;
        background-color: var(--bg);

        &:first-child {
          &::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: var(--primary_1);
          }
        }

        &:last-child {
          &::before {
            content: '';
            position: absolute;
            top: -1px;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: var(--primary_1);
          }
        }
      }
    }

    &-text {
      line-height: 1.5;
      font-size: 2.4rem;
      width: 60rem;
    }
  }

  .s4 {
    $title: 50rem;
    $text: 28rem;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: calc($title - $text - 2rem);
      height: 100%;
      background: var(--primary_1);
      z-index: -1;
    }

    &-title {
      width: $title;
      font-size: 4.2rem;
      text-indent: 0.1rem; /* align with *t*eam */

      &-part {
        font-size: 8rem;
      }
    }

    &-text {
      width: $text;
      margin-left: calc($title - $text);
      margin-top: 5rem;
    }
  }

  .s5 {
    &-content {
      display: flex;
      align-items: flex-end;
    }

    &-title {
      width: 75rem;
      font-size: 12rem;
      margin-right: 10rem;
      transform: translateY(0.25em); /* align to baseline */
    }

    &-text {
      width: 46rem;
    }
  }

  .finalle {
    background-color: var(--primary_1);
  }
</style>

<section class="container" aria-label="Values" bind:this={elContainer}>
  <!-- <div class="s1">
    <h2 class="f-mono title">
      From day to day,
      <br />
      here’s what defines her...
    </h2>
  </div> -->
  <div class="s2">
    <h3 class="f-mono subtitle s2-title">
      <span class="s2-pattern" />
      Let's
      <br />
      connect the dots
    </h3>
    <p class="c-text s2-text">
      Combining the design and the development processes is one of Sandrina’s expertises. She loves
      to work closely with product designers to build remarkable&nbsp;products.
    </p>
  </div>
  <div class="s3">
    <h3 class="f-mono subtitle s3-title">
      <span class="s3-title-part" style="transform: translateY(-{s3Y}px)">Ask why,</span>
      <span class="s3-title-part" style="transform: translateY({s3Y}px)">understand how</span>
    </h3>
    <p class="c-text s3-text">
      You’ll see Sandrina asking a lot of questions around. Wanna create a simple but detailed
      solution? Let’s understand the problem, first. Only then we can make wiser decisions taken
      with true care.
    </p>
  </div>
  <div class="s4">
    <h3 class="f-mono subtitle s4-title">
      From a lone wolf to a
      <span class="s4-title-part">team player</span>
    </h3>
    <div class="s4-text c-text">
      <p class="s4-text-p">
        If you wanna go quickly, Sandrina can make it happen. As a fast paced worker with a high
        quality bar, she can be the lone wolf when needed.
        <br />
        <br />
        However, if you wanna go far, ask her to join your wolves pack and let’s go together, as a
        team.
      </p>
    </div>
  </div>
  <div class="s5">
    <div class="s5-content">
      <h3 class="f-mono subtitle s5-title">Put people before code</h3>
      <p class="s5-text c-text">
        At the end, it doesn’t matter if all the best practices are followed, all the code is reused
        and each pixel is perfectly aligned, if there isn’t a human connection between the people
        who create a product.
        <br />
        <br />
        The technology is only the starting point. The passion behind a team it’s the fuel to create
        a memorable experience to everyone.
      </p>
    </div>
  </div>
  <div class="finalle" />
</section>
