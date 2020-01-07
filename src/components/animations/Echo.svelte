<style>
  .container {
    position: absolute;
    height: 100vh;
    width: 100%;
    top: 0; left: 0;
    z-index: -1;
    pointer-events: none;
  }

  .echo {
    position: absolute;
    top: 0; left: 0;
    width: 100vh;
    height: 100vh;
    border-radius: 50%;

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

<div class="container">
  <div class="echo" />
  <div class="echo" />
  <div class="echo" />
</div>
