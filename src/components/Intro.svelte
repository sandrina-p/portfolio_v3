<script>
import Container from './Container.svelte';
import ProfileAscii from './ProfileAscii.svelte';
</script>

<style>
/* NOTE/BUG: Svelte currently doesn't support passing down CSS classes
https://github.com/sveltejs/svelte/issues/2870#issuecomment-511251023 */
:global(.introContainer) {
    display: flex;
    align-items: center;
    min-height: var(--full-vh);
}

.title {
  font-size: 5rem;
  margin-bottom: var(--spacer-L);
  /* text-transform: uppercase; */
}

.text {
  font-size: 2.5rem;
  line-height: 1.4;

  &:nth-of-type(2) {
    margin-top: var(--spacer-L);
  }
}

strong {
  font-weight: 600;
}
</style>

<Container class="introContainer">
  <div>
    <h1 class="title">
      Hey,
      <br/>nice to meet you!
    </h1>
    <p class="text">Let me introduce you to a <strong>web lover</strong>
      <br/> who helps turn ideas into accessible experiences.
    </p>
    <p class="text">
      Her name is <strong>Sandrina</strong>
      <br/> and she’s a <strong>UX Developer</strong>
    </p>

    <span>And I’m her cyber-alter-ego, 008080.</span>
  </div>
  <ProfileAscii />
</Container>
