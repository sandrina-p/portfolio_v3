<script>
import Container from './Container.svelte';
// import ProfileAscii from './ProfileAscii.svelte';
</script>

<style>
.intro {
  display: flex;
  padding-left: 10rem;
  align-items: center;
  width: 100vw;
  height: 100vh;
  border: 5px solid red;
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

<div class="intro">
  <div>
    <h1 class="title">
      Oh,
      <br/>hello there!
    </h1>
    <p class="text">Let me introduce you to somone who
      <br/>helps turn ideas into accessible experiences.
    </p>
    <p class="text">
      Her name is <strong>Sandrina</strong>
      <br/> and she’s a <strong>Frontend Developer</strong>
    </p>

    <span>And I’m her cyber-alter-ego, 008080.</span>
  </div>
  <!-- <ProfileAscii /> -->
</div>
