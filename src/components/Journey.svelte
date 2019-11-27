<script>
  import { onMount } from 'svelte';
  import words from '../data/words.js';
</script>

<style>
  .wrapper {
    max-width: 80rem;
    margin: 0 auto;
    padding: var(--spacer-XL) var(--spacer-M);
    min-height: 100vh;
    margin-top: 50vh;
  }

  .heading {
    font-size: var(--font-heading_2);
    transform: rotate(-4deg);
    margin-bottom: var(--spacer-XL);
  }

  .text {
    max-width: 50rem;
    margin: 0 auto;
    font-size: var(--font-L);
    line-height: 1.5;
    color: var(--text_1);

    strong {
      /* box-shadow: 0.2em 0 0 var(--primary_1b), -0.2em 0 0 var(--primary_1b);
      background-color: var(--primary_1b); */
      box-decoration-break: clone; /* make it work on FF */
    }
  }

  a {
    color: var(--text_0);
  }
</style>

<section class="wrapper">
  <h2 class="f-mono heading">
    Uff,
    <br />
    you came so far...
    <br />
    and so did Sandrina!
  </h2>
  <p class="text">
    During the last year she have been helping to bring a new (open source) idea to life -
    <a href="TODO">Group Income</a>
    - a decentralized basic income system for small communities. Before that, she was a Senior UI
    Engineer at
    <a href="TODO">Farfetch</a>
    for a few years.
    <br />
    <br />
    Since her early days, back when she was studying Communication Design, Sandrina always looked
    for ways to emerge these two fields: design and development. Her meta-goal is still the same:
    <strong>create human experiences through the digital world.</strong>
    <br />
    <br />
    Currently,
    <strong>Sandrina is looking for new opportunities</strong>
    where she can make the difference as a developer who cares not only about the code, but also
    about the people. Remote friendly or somewhere in North Europe.
    <a href="TODO">Get in touch!</a>
  </p>
</section>
