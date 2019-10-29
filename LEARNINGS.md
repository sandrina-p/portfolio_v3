Here's a list of my learnings while building this website.

## Sapper / Svelte
- Add PostCSS with [svelte-preprocess](https://www.npmjs.com/package/svelte-preprocess)
- Global.css hot-reload doesn't seem to work on Sapper. (Need ref)
- BUG: Svelte currently [doesn't support passing down CSS classes](https://github.com/sveltejs/svelte/issues/2870#issuecomment-511251023)
- Svelte converts wild cards to .classes `.container > *` outputs `.container > .child`
- Question: When should export a variable? Docs don't explain it... Edit: export is a variable??


## Javascript

## CSS
- Horizontal content: Use grid as parent and flex as child. it will grow horizontally forever.
