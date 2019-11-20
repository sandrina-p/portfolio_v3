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

## Javascript

- Prefer using `window.scrollY` over `document.documentElement.scrollTop` to get [window scroll correctly across all browsers](https://stackoverflow.com/questions/20514596/document-documentelement-scrolltop-return-value-differs-in-chrome).

## CSS

- Horizontal content: Use grid as parent and flex as child. it will grow horizontally forever.

## VSCode

- Finally did the switch from Atom to VSCode because of lack of Svelte syntax support...
- How to [add multiline tabs to VScode](https://stackoverflow.com/a/57441591/4737729) (can't believe this isn't possible in a easier way)
