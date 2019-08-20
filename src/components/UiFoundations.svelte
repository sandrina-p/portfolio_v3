<script>
	import CssReset from './CssReset.svelte';
</script>

<style global>
	:root {
		--text: #e6e6e6;
		--bg: #171717;
		/* --bg_1:  */
		--font-M: 1.6rem;
		--font-L: 1.8rem;
		--spacer-M: 1.6rem;
		--spacer-L: 3.2rem;
		--spacer-XL: 6.4rem;
		--full-vh: 100vh; /* TIL */
	}

	html {
		font-size: 62.5%; /* 1rem = 10px */
	}

	body {
		background: var(--bg);
		color: var(--text);
		font-size: var(--font-M);
	}

	a {
		color: red;
	}

	p {

	}
</style>

<span>
	<CssReset />
</span>
