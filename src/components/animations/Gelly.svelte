<style>
  .gelly {
    position: absolute;
    height: 100vh;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 1;
  }

  .gum {
    position: absolute;
    top: -15vh;
    left: 0%;
    width: 33vw;
    height: 33vh;
    background: var(--primary_1);
    opacity: 0.1;
    animation:
      gelly 30s alternate-reverse infinite ease-in-out,
      live 20s alternate-reverse infinite ease-in-out;
  }

  .gum2 {
    position: absolute;
    bottom: -25vw;
    left: 25%;
    width: 5vw;
    height: 5vw;
    background: var(--primary_1);
    border-radius: 50%;
    opacity: 0.2;
    box-shadow: 0 0 30vw 30vw var(--primary_1);
  }

@keyframes gelly {
  0%, 100% { border-radius: 60% 40% 45% 55% / 55% 45% 50% 60%; } 
  20% { border-radius: 54% 46% 40% 60% / 43% 57% 40% 65%; } 
  40% { border-radius: 40% 60% 46% 54% / 50% 60% 41% 50% } 
  60% { border-radius: 56% 44% 60% 30% / 56% 44% 60% 30% } 
  80% { border-radius: 46% 54% 35% 75% / 50% 50% 40% 65%; } 
}

@keyframes live {
  0%, 100% { transform: translate3d(0, 0, 0) }
  50% { transform: translate3d(-20%, -20%, 0) }
}
</style>

<div class="gelly">
  <div class="gum" />
  <div class="gum2"/>
</div>
