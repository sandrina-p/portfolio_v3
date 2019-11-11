<script>
  import { onMount } from 'svelte';
  import Intro from '../components/Intro.svelte';
  import Values from '../components/Values.svelte';
  import Words from '../components/Words.svelte';
  import Tools from '../components/Tools.svelte';
  import Journey from '../components/Journey.svelte';
  import Footer from '../components/Footer.svelte';
  import Nav from '../components/Nav.svelte';
  import { getInLimit } from '../utils';

  let translateX = 0;
  let elHorizon;
  let elHorizonAfter;
  let marginTop = '100vh';

  onMount(() => {
    // OPTIMIZE: Recalculate these values on resize.
    const horizonWidth = elHorizon.offsetWidth;
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    // OPTIMIZE: review these calcs...
    const maxScroll = horizonWidth - (screenWidth - screenHeight);
    const maxScroll2 = maxScroll + (screenWidth - screenHeight);
    marginTop = `${maxScroll + screenHeight}px`; // OPTIMIZE - define a marginTop from SS
    document.addEventListener('scroll', () => {
      translateX = getInLimit(window.scrollY, 0, maxScroll2);
    });
  });
</script>

<style>
  .panel {
    position: fixed;
    top: 0;
    left: 0;
    display: grid; /* make it grow horizontally */
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .horizon {
    display: flex;
  }

  .horizonAfter {
    position: relative;
    margin-top: 100vh;
  }
</style>

<svelte:head>
  <title>Sandrina Pereira - UX Developer</title>
</svelte:head>

<div class="panel">
  <div class="horizon" bind:this={elHorizon} style="transform: translateX(-{translateX}px)">
    <Intro />
    <Values />
  </div>
</div>
<div class="horizonAfter" style="margin-top: {marginTop}">
  <Words />
  <Tools />
  <Journey />
  <Footer />
</div>
<Nav />

<!-- <div>
	<h2>On her free time she loves to push pixels around</h2>
	<p>Check her experiments on <a href="/">Codepen</a></p>
	<span>(because code without fun is just boring!)</span>

	<h2>she enjoys to share ideas</h2>

	<h3>written...</h3>
	<h4>How Developers can Empower Designers’ work</h4>
	<span>Published at Smashing Magazine</span>

	<h4>Bringing a Healthy Code Review Mindset to your Team</h4>
	<span>Published at Smashing Magazine</span>

	<h3>or spoken...</h3>
	<p>Conferences</p>

	<h4>Bringing a Healthy Code Review Mindset to your Team</h4>
	<span>@ ruhrjs 2019</span>

	<h4>How Can Javascript Improve Your CSS Mixins</h4>
	<span>@ JSConf Budapest 2017</span>

	<p>Trainings</p>
	<h4>About Testing React Apps with Jest and Enzyme, Accessibility and CSS Architecture.</h4>


	<div>[ twitter, dev, medium links somewhere ]</div>



	<h2>Get to know her powers</h2>
	<button>had fun with</button>
	<button>rocking at</button>
	<button>curious about</button>
	<button>made me with</button>
	<div>
	[Powers illustration]
	</div>


	<div>
	[BOOORINGG]
	<p>At the moment she’s open to new projects! One of them is helping to build Group Income, an open source project about Universal Basic Income.

	Before that, she worked at Farfetch, where she learned zillions things about working at big companies.

	Her early days started jumping between startups and freelance projects.

	These are her favorite college projects  made during her degree in Design of Communication.

	Oh, and if you want, you can also check my older brother (her previous website)
	</p>
	</div>

	<h2>
	Well,
	that’s all for now!
	</h2>

	<p>I'm not allowed to share more info about her. </p>
	<p>
	But by all means, don't be shy and go say hello.
	<br/>
 She is very nice, specially if you are a web lover too.
	</p>

	<div>[social media stuff]</div>


	<div>
		[CHAT]
		<p>Or you can talk with me. It’s lonely on this side.</p>

		<input type="text" placeholder="Just be cool">
	</div>
</div> -->
