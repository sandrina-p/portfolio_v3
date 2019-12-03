Here's a list of my learnings while building this website.

## Sapper / Svelte

- Add PostCSS with [svelte-preprocess](https://www.npmjs.com/package/svelte-preprocess)
- Global.css hot-reload doesn't seem to work on Sapper. (Need ref)
- BUG: Svelte currently [doesn't support passing down CSS classes](https://github.com/sveltejs/svelte/issues/2870#issuecomment-511251023)
- Svelte converts wild cards to .classes `.container > *` outputs `.container > .child`
- Question: When should export a variable? Docs don't explain it... Edit: export is a variable??
- Use dynamic + static classes: `class="icon {svg}"`
- You don't need to worry about extra updates with useless setState() as in React.
- Create first store! (responsive).
- Question: How to conditionally add attr/events on an element? ??
- Passing props down isn't trivial at all... [Workaround](https://github.com/sveltejs/svelte/issues/2870#issuecomment-529200474)
- Create a storeFactory to prevent useless updates (storeFactory)
- Functions can be reactive too (as variables!)
- BUG: Svelte removes classes when they are added through `@html` (ex: Values.svelte -> .sBox strong).
- Child components are PureComponents by default!

## Javascript

- Prefer using `window.scrollY` over `document.documentElement.scrollTop` to get [window scroll correctly across all browsers](https://stackoverflow.com/questions/20514596/document-documentelement-scrolltop-return-value-differs-in-chrome).

## CSS

- Horizontal content: Use grid as parent and flex as child. it will grow horizontally forever.
- Place multiples texts in the same line without position absolute using -1em.
- TIL: `position:sticky` doesn't work when the parent has `overflow:hidden`

## Accessibility

- `aria-current` to a link to mark it as [the current page link](https://tink.uk/using-the-aria-current-attribute/).
- smooth scrolling when clicking a#tag - we need to handle the focus-changing ourselves because we are override the default scroll behavior.

## VSCode

- Finally did the switch from Atom to VSCode because of lack of Svelte syntax support...
- How to [add multiline tabs to VScode](https://stackoverflow.com/a/57441591/4737729) (can't believe this isn't possible in a easier way)


---
---


## Welcome back Sandrina, happy 2020!

Yes, you, miss Sandrina! I hope you come back to this project only in 2020. We both know you needed to rest.
Now with a fresh mind, let's finish this up! Here's a quick recap:

### What's missing:
Well... a bunch of stuff, here and there, but it's okay! I won't list everything because if I did, you would feel overwhelmed and stressed with all of those tiny details missing just to do a "landing page".
So, instead I'll leave you with a couple of starting points. I'm sure you'll remember the rest as you go.

1. Start by finish the page navigation - The _About/Journey_ section isn't working correctly on nav click.
2. Add the decorative elements to the Intro. Check Figma, they're there.
3. By now I'm sure you'll know what to do next better than I do now. Good luck and welcome back!

—- Your past self, December 3rd 2019.
