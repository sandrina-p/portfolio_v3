<script>
  import { onMount } from 'svelte';
  import words from '../data/words.js';

  // onMount(() => {
  //   setTimeout(() => {
  //     window.scroll(0, 11000); // easier debug
  //   }, 250);
  // });
</script>

<style>
  .wrapper {
    padding: 0 var(--spacer-M);
    min-height: 100vh;
    overflow: hidden;
  }

  .pattern {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    background-color: var(--primary_2);
    width: 200vw;
    height: 200vh;
    transform: rotate(15deg);
    transform-origin: 0 0;
  }

  .container {
    position: relative;
    display: flex;
    max-width: 100rem;
    margin: 0 auto;
    padding-top: 15vw;
  }

  .heading {
    padding: var(--spacer-XL) 0;
    font-size: 5rem; /*var(--font-heading_2);*/
  }

  .text {
    max-width: 50rem;
    font-size: var(--font-L);
    line-height: 1.5;
    color: var(--text_0);

    a {
      color: inherit;
    }
  }
</style>

<section class="wrapper">
  <div class="container">
    <!-- TODO: turn into a pseudo-element -->
    <div class="pattern" />
    <div class="info">
      <h2 class="f-mono heading">
        Well,
        <br />
        that’s all for now!
      </h2>
      <p class="text">
        I'm not allowed to share more info about Sandrina.
        <br />
        <br />
        But by all means, don't be shy and
        <a href="todo">go say hello.</a>
        <br />
        She is very nice, specially if you are a web lover too.
      </p>
    </div>
    <div>[Chat on the way...]</div>
  </div>
</section>
