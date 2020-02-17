Here's a list of my learnings while building this website. When I release the website, I'll share some of my learnings with a deeper explanation:

- 📦 Candidate for a package release.
- 📝 Candidate for an article.
- 🎈 Candidate for quick tip (tweet).

## Sapper / Svelte

- Add PostCSS with [svelte-preprocess](https://www.npmjs.com/package/svelte-preprocess)
- Global.css hot-reload doesn't seem to work on Sapper. (Need ref)
- 🐛 BUG: Svelte currently [doesn't support passing down CSS classes](https://github.com/sveltejs/svelte/issues/2870#issuecomment-511251023)
- Svelte converts wild cards to .classes `.container > *` outputs `.container > .child`
- ❓Question: When should we export a variable? Docs don't explain it... Edit: export is a variable?? Edit2: Yes, it is. It's the last thing and you can access it before creating/exporting it (odd)
- Use dynamic + static classes: `class="icon {svg}"`
- 🎈You don't need to worry about extra updates with useless setState() as in React.
- 📦 Create first store! (responsive).
- ❓Question: How to conditionally add attr/events on an element? ??
- 🎈Passing props down isn't trivial at all... [Workaround](https://github.com/sveltejs/svelte/issues/2870#issuecomment-529200474)
- 📦 Create a storeFactory to prevent useless updates (storeFactory)
- 🎈Functions can be reactive too (as variables!)
- 🐛 BUG: Svelte removes written classes when they are added through `@html` (ex: Values.svelte -> .sBox strong).
- 🎈Child components are PureComponents by default!
- 🎈how to log a reactive variable each time it changes: `$: foo, console.log('value:', foo);` 
- 🎈 props cant have numbers! `isLevel1` -> `isLevelOne`. But you know what? This made me find a better solution: `level="1"`
- 🐛Bug: Svelte does a poor hydratation causing issues with CSS Animations. [Sapper#1088](https://github.com/sveltejs/sapper/issues/1088). Workaround: Use a Svelte fork!

## Javascript

- Prefer using `window.scrollY` over `document.documentElement.scrollTop` to get [window scroll correctly across all browsers](https://stackoverflow.com/questions/20514596/document-documentelement-scrolltop-return-value-differs-in-chrome).
- 📦 Learned how to detect an IntersectionObserver status - if entering / leaving & what direction (top/bottom/left/right)

## CSS

- 🎈Horizontal content: Use grid as parent and flex as child. it will grow horizontally forever.
- 🎈Place consecutive paragraphs in the same line without position absolute using -1em.
- 🎈 `position:sticky` doesn't work when the parent has `overflow:hidden`
- 🎈🐛 `transparent` on Safari means rgba(0, 0, 0, 0) instead of rgba(255, 255, 255, 0). If you do `linear-gradient(red, transparent)` it will go from red to black transparent.
- 🎈How to prevent CSS transition from happening on 1st render.
- 📝 Learning so about animations optimization using Safari Layers.
  - lookout for elements size - white space consumes memory (ex: display block vs inline)
  - look out for overlapping animations, avoid when possible. (ex: site intro)
  - reduce size using scale() whenever possible. (ex: echo)
  - look out for fixed elements, remove useless paddings / width / hight around.
  - use `visibility: hidden` to hide animations out of viewport - watch out to not hide text!
- Reminder: 100vh is evil on mobile. But JS can save us here...
- 📝 Use SCSS or CSS Variables? - TLDR: they complement each other.
- 🎈 When using `position:fixed`, you can't add `transform` to that element. It will ignore fixed. Solution: Apply transform to child element. (ex: footer title)


## HTML/Accessibility

- 🎈`aria-current` to a link to mark it as [the current page link](https://tink.uk/using-the-aria-current-attribute/).
- 🎈when using smooth scrolling on a#tag we need to handle the focus-changing ourselves because we are override the default scroll behavior.
- 🎈Use `el.focus()` on a element inside a scrollable container, it will scroll to the element automatically (safari won't!). Useful to scroll between sliders on a scroll-snap container.

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

- [x] Start by finish the page navigation - The _About/Journey_ section isn't working correctly on nav click.
- [x] Add the decorative elements to the Intro. Check Figma, they're there.
- [x] By now I'm sure you'll know what to do next better than I do now. Good luck and welcome back!

—- Your past self, December 3rd 2019.
