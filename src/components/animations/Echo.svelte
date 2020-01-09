<style>
  .echos {
    position: fixed;
    top: 0; left: 0;
    height: 100vh;
    width: 100%;
    z-index: -1;
    transform: translate(var(--scrollY));
    pointer-events: none;
    display: none; /* TODO - decide this... */
  }

  .echo {
    position: absolute;
    top: 0;
    left: calc(50vw - 50vh);
    width: 100vh;
    height: 100vh;
    border-radius: 50%;
    transform: transform 500ms cubic-bezier(0, 1.63, 0.5, 0.96);

    &:nth-child(1) {
      background: linear-gradient(140deg, #ff000008, transparent 71%);
    }

    &:nth-child(2) {
      transform: scale(0.8);
      background:
        linear-gradient(140deg, #ff000008, transparent 71%),
        radial-gradient(#5800ff36, transparent 70%);
    }

    &:nth-child(3) {
      transform: scale(0.6);
      background:
        linear-gradient(140deg, #ff000008, transparent 71%),
        radial-gradient(#5800ff36, transparent 70%);
    }
  }

</style>

<div class="echos">
  <div class="echo" />
  <div class="echo" />
  <div class="echo" />
</div>
