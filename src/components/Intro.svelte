<script>
  import Contacts from './Contacts.svelte';
  import CircleComposition from './animations/CircleComposition.svelte';

  let circleCount = Array(10);
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
    background: var(--bg);
  }

  .content {
    width: calc(50vw - 10rem);
  }

  .title {
    font-size: var(--font-heading_1);
    margin-bottom: var(--spacer-L);

    span {
      opacity: 0;
      animation: laserOn 500ms steps(9) forwards;

      /* 13 chars */
      @for $i from 1 to 13 {
        &:nth-of-type($i) {
          animation-delay: calc(100ms + 70ms * $i);

          @if $i == 4 {
            display: block; /* linebreak */
          }
        }
      }
    }
  }

  .text {
    font-size: 2.1rem;
    line-height: 1.5;
    max-width: calc(2.5rem * 19);
    opacity: 0;
    animation: laserOn 750ms steps(9) forwards calc(500ms + 70ms * 14);

    &:nth-of-type(2) {
      margin-top: var(--spacer-L);
      max-width: calc(2.5rem * 14);
    }
  }

  :global(.g-intro-contacts) {
    opacity: 0;
    animation: laserOn 750ms steps(9) forwards calc(500ms + 70ms * 17);
  }

  .animation {
    position: relative;
    opacity: 0;
    animation: laserOn 750ms steps(9) forwards calc(100ms + 70ms * 12);
    z-index: 1; /* To be above Values intro */
  }
</style>

<div class="intro">
  <div class="content">
    <h1 class="f-mono title">
      {#each intro.split('') as char}
        <span>{char}</span>
      {/each}
    </h1>
    <p class="text">
      Let me introduce you to someone who helps to turn ideas into accessible experiences.
    </p>
    <p class="text">Her name is Sandrina Pereira and she’s a frontend developer.</p>

    <Contacts class="g-intro-contacts" />
  </div>
  <div class="animation">
    <CircleComposition />
  </div>
</div>
