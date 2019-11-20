<script>
  import { onMount, afterUpdate } from 'svelte';
  import { getInLimit } from '../utils';
  import { _window, onResponsiveChange } from '../stores/responsive.js';
  import { updateDabox } from '../stores/dabox.js';
  import { updateCircle } from '../stores/circle.js';

  let isMounted = false;
  let elContainer = null;

  // ::: S3 related stuff...
  let s3Y = 0;
  const s3Width = 600; // TODO - get from DOM.
  const S3io = 1.5; // because it's the 2nd element
  const Ylimit = 85 * 2;
  // start animation at middle of the screen
  $: s3StartPosition = isMounted ? $_window.innerWidth * S3io + s3Width : 0;

  onMount(() => {
    isMounted = true;
  });

  function letsGetStarted() {
    // All the magic related to values happens here.
    // 🐻 with me, it's going to be a funny ride!

    // const translate = window.scrollY - s3StartPosition;
    // s3Y = getInLimit(translate / 2, 0, Ylimit / 2);

    // 1º - Metamorphose the initial circle into a square (dabox)
    // -    P.S. me doing this part: https://i.imgur.com/3uyRWGJ.jpg
   
    // - 1.a Static values
    const scrollRatio = 2.5; // changes progression based on scroll. (ex: it needs to scroll 25px to change 10px)
    const size = 200 // --size TODO - get real.
    const scaleStart = 0.8 // --scaleStart // TODO - get real.
    const halfSize = size/2
    const distanceCircle = $_window.innerWidth/2 - size*1.5 // --distance - TODO get real.

    const scrollY = window.scrollY - halfSize; // substract halfSize so the circle gets in the middle of the screen.
    const progress = distanceCircle - scrollY/scrollRatio;
    const newDistance = getInLimit(progress, 0, distanceCircle);
    const offLimit = distanceCircle*scrollRatio
    const offsetY = getInLimit(scrollY, 0, offLimit);
    const scaleStartAdjusted = scaleStart + (0.2 - (newDistance * 0.2 / distanceCircle));
    const daboxProgress = getInLimit(progress*-1/50, 0, 1);

    updateCircle({
      style: `
        --scrollY: ${offsetY}px;
        --distance: ${newDistance}px;
        --scaleStart: ${scaleStartAdjusted}
      `,
      isPaused: newDistance === 0,
    })
    updateDabox({
      isActive: newDistance === 0,
      progress: daboxProgress,
    })

    // 2º - dabox is on stage now... Let's give it shape and text.
    
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
    opacity: 0;
  }

  .s2 {
    opacity: 0;
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

<svelte:window on:scroll={letsGetStarted} />
<section class="container" aria-label="Values" bind:this={elContainer}>
  <div class="s1">
    <h2 class="f-mono title">
      x
    </h2>
  </div>
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
