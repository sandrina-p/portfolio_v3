<script>
	import { onMount, afterUpdate } from 'svelte';
	import Contacts from './Contacts.svelte';
	import { strGeneral, updateGeneral } from '../stores/general.js';

	const pageSections = $strGeneral.pageSections;
	$: current = $strGeneral.pageCurrentSection;
	let prevPageCurrent = $strGeneral.pageCurrentSection;
	let wasSelected = null; // when the link is clicked, activates the transition

	afterUpdate(() => {
		if(current !== prevPageCurrent) {
			prevPageCurrent = current;
			console.log('pageSection changed:', current)
		}
	})

	function updatePageSection(e, pageCurrentSection) {
		e.preventDefault();

		if (pageCurrentSection === current) {
			return false;
		}

		console.log('pageSection changing to:', pageCurrentSection)
		
		const target = document.getElementById(pageCurrentSection);
		const from = window.scrollY;
		const to = pageCurrentSection !== 'intro' ? from + target.getBoundingClientRect().top : 0;

		wasSelected = pageCurrentSection;

		setTimeout(() => {
			// NOTE: Make sure to call scrollTo before updateGeneral,
			// so all sections read currectly the current scrollY
			window.scrollTo(0, to);
			updateGeneral({ pageCurrentSection })
			// TODO - handle a11y focus
		}, 600) // eye picked value, ~ middle of "fancyAnimation"

	}


</script>

<style>
	$gutter: 2rem;

	.nav {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
	}

	.links {
		&List {
			position: absolute;
			top: $gutter;
			left: calc($gutter*2);
			display: flex;
			margin: 0;
			padding: 0;
			font-size: var(--font-M);
			
			@media (height > 42em) {
				flex-direction: column;				
			}
		}

		&Item {
			margin: 0;
			padding: 0;
			margin: 0 2rem 0 0;
			padding: 0.5rem 0;

			&::before,
			&::after {
				content: '';
				position: absolute;
				top: -50vw;
				left: -50vw;
				width: 200vw;
				height: 200vw;
				display: block;
				border-radius: 50%;
				transform: scale(0);
				transform-origin: 25% 25%;
				box-sizing: border-box;
				z-index: -1;
			}

			&::before {
				background: var(--morph_total);
			}

			&::after {
				background: var(--bg_1);
			}

			&.isCurrent {
				@for $i from 1 to 4 {
					&:nth-child($i) {
						~ .decorative {
							transform: translateY(calc($i * 1.62em));
						}
					}
				}
			}

			&.wasSelected {
				&::before,
				&::after {
					animation: fancyNavigation 1000ms ease-out;
				}

				&::after {
					animation-duration: 1250ms;
				}
			}
		}

		&Anchor {
			display: inline-block;
			text-decoration: none;
			color: var(--text_1);

			&:hover,
			&:focus,
			&[aria-current="true"] {
				color: var(--primary_1);
			}
		}
	}

	.decorative {
		position: absolute;
		left: calc($gutter * -1);
		top: -0.75em;
		width: 1.5rem;
		border-bottom: 1px solid var(--text_0);
		transition: transform 250ms ease;
	}

	:global(.g-contacts) {
		position: absolute;
		bottom: $gutter;
		left: $gutter;
		width: 100%;
		white-space: nowrap;
    opacity: 0;
    animation: laserOn 750ms calc(600ms + 50ms * 14) steps(8) forwards;
  }

	@keyframes fancyNavigation {
		0% {
			transform: scale(0);
		}
		80% {
			opacity: 1;
		}
		100% {
			transform: scale(1);
			opacity: 0;
		}
	}
</style>
<nav class="nav">
		<ul class="linksList">
			{#each pageSections as name }
				<li class="linksItem"
					class:isCurrent={current === name}
					class:wasSelected={wasSelected === name}
				>
					<a href="#{name}"
						class="linksAnchor u-linkInteract"
						aria-current={current === name}
						on:click={(e) => updatePageSection(e, name)}>
						{name}
					</a>
				</li>
			{/each}
			<li class="decorative" aria-hidden="true"></li>
		</ul>

		<Contacts class="g-contacts" />
</nav>