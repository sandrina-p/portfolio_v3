<script>
  import { onMount } from 'svelte';
  let s3Title;

  onMount(() => {
    setTimeout(() => {
      window.scroll(0, 3500); // easier debug
    }, 250);
    console.log(s3Title);

    /*
    // TODO - animate title using scroll, scroll/s3
    - s3 position: values.width / sectionsCount * 3
    - use translateX(10px) as it scrolls
    - stop translateX when outside of viewport.
    - custom IO... shrug
    */
    listenForS3();
  });

  function listenForS3() {
    console.log('hum');
  }
</script>

<style>
  .container {
    display: flex;
    align-items: center;

    > * {
      min-width: 100vw;
      flex-shrink: 0;
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

    &-text {
      width: 38rem;
      margin-left: 37rem;
      margin-top: 4rem;
    }

    &-pattern {
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(-50%, -50%) rotate(-25deg);
      transform-origin: 0 0;
      width: 22rem;
      height: 50rem;
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
        display: block;
        background-color: var(--bg);
      }
    }

    &-text {
      line-height: 1.5;
      font-size: 2.4rem;
      width: 60rem;
    }
  }
</style>

<section class="container" aria-label="Values">
  <div class="s1">
    <h2 class="f-mono title">
      From day to day,
      <br />
      here’s what defines her...
    </h2>
  </div>
  <div class="s2">
    <div class="s2-pattern" />
    <h3 class="f-mono subtitle">Connect the dots</h3>
    <p class="c-text s2-text">
      Combining the design and the development processes is one of Sandrina’s expertises. She loves
      to work closely with product designers to build remarkable&nbsp;products.
    </p>
  </div>
  <div class="s3">
    <h3 class="f-mono subtitle s3-title" bind:this={s3Title}>
      <span class="s3-title-part">Ask how,</span>
      <span class="s3-title-part">understand why</span>
    </h3>
    <p class="c-text s3-text">
      You’ll see Sandrina asking a lot of questions around. Wanna create a simple but detailed
      solution? Let’s understand the problem, first. Only then we can make wiser decisions taken
      with true care.
    </p>
  </div>
  <div class="s1">
    <h3 class="f-mono">Doing less but better</h3>
    <p>
      ratione dolorum hic enim reprehenderit quia, numquam laudantium quos illum debitis itaque
      voluptate eius quis maxime consequuntur doloribus impedit?
    </p>
  </div>
</section>
