<script>
  import Contacts from './Contacts.svelte';
  import CircleComposition from './animations/CircleComposition.svelte';
  let circleCount = Array(10);
</script>

<style>
  .intro {
    display: flex;
    padding-top: 15vh;
    padding-left: 10rem;
    width: 100vw;
    height: 100vh;
    flex-shrink: 0;
  }

  .content {
    width: calc(50vw - 10rem);
  }

  .title {
    font-size: var(--font-heading_1);
    margin-bottom: var(--spacer-L);
  }

  .text {
    font-size: 2.5rem;
    line-height: 1.5;
    max-width: calc(2.5rem * 19);

    &:nth-of-type(2) {
      margin-top: var(--spacer-L);
      max-width: calc(2.5rem * 14);
    }
  }

  .animation {
    position: relative;
  }
</style>

<div class="intro">
  <div class="content">
    <h1 class="f-mono title">
      Oh,
      <br />
      hi there!
    </h1>
    <p class="text">
      Let me introduce you to somone who helps to turn ideas into accessible experiences.
    </p>
    <p class="text">Her name is Sandrina Pereira and she’s a Frontend Developer.</p>

    <Contacts />
  </div>
  <div class="animation">
    <CircleComposition isPaused={true} />
  </div>
</div>
