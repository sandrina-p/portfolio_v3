<script>
  import Contacts from './Contacts.svelte';
  import CircleComposition from './animations/CircleComposition.svelte';

  const intro = 'Oh, hi there!';
</script>

<style>
  .intro {
    display: flex;
    padding-left: 10rem;
    width: 100vw;
    height: 100vh;
    flex-shrink: 0;
    align-items: center;
    background: var(--bg_0);
  }

  .content {
    width: calc(50vw - 10rem);
  }

  .title {
    font-size: var(--font-heading_1);
    margin-bottom: var(--spacer-L);

    span {
      opacity: 0;
      animation: laserOn 500ms steps(8) forwards;

      /* 13 chars */
      @for $i from 1 to 13 {
        &:nth-of-type($i) {
          @if $i == 4 {
            display: block; /* linebreak */
          }

          @if $i < 4 {
            animation-delay: calc(200ms + 50ms * $i);
          } @else {
            animation-delay: calc(600ms + 50ms * $i);
          }
        }
      }
    }
  }

  .text {
    font-size: 2.1rem;
    line-height: 1.5;
    max-width: 45rem;
    opacity: 0;
    animation: laserOn 750ms calc(600ms + 50ms * 13) steps(8) forwards;

    &:nth-of-type(2) {
      margin-top: var(--spacer-M);
      max-width: 32rem;
    }
  }

  :global(.g-intro-contacts) {
    opacity: 0;
    animation: laserOn 750ms calc(600ms + 50ms * 14) steps(8) forwards;
  }

  .animation {
    position: relative;
    opacity: 0;
    animation: fadeIn 1000ms calc(600ms + 50ms * 13) forwards;
    z-index: 1; /* To be above values */
  }
</style>

<div class="intro">
  <div class="content">
    <h1 class="f-mono title">
      {#each intro.split('') as char}
        <span>{char}</span>
      {/each}
    </h1>
    <p class="text">Let me introduce you to someone who helps to turn ideas into accessible experiences.</p>
    <p class="text">Her name is Sandrina Pereira and she’s a frontend developer.</p>
    <Contacts class="g-intro-contacts" />
  </div>
  <div class="animation">
    <CircleComposition />
  </div>
</div>
