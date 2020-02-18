# Oh, hi there!

Let me introduce myself. I love to help turning ideas into accessible experiences.

My name is Sandrina Pereira and I'm a UX Engineer.

----

This is where you can see my personal website code. But... wait, it's still in development! 🚧 So, don't be surprised with the amount of `TODO` / `REVIEW` / `OPTMIZE` comments you'll find around. Anyway, here's some info about it:

## Run it locally
```bash
# Install dependencies
yarn # or npm install

# Run in dev mode
yarn dev # or npm run dev
```

## Stack
- **Development**: [Svelte](https://svelte.dev/) ([Sapper](https://sapper.svelte.dev/)) + [PostCSS](https://postcss.org/)
- **Testing**: [Cypress](https://www.cypress.io/) & [Jest](https://jestjs.io/)
- **Deploy**: [Netlify](https://www.netlify.com/)

## What's missing:
Well... let's say we are 80% done and the other 20% is taking 80% of the time.

### UI/UX
- [x] Short scroll length of initial morph
- [x] Finalize animations for Intro (99%)
- [x] Review "Skills" section overall UX
- [x] Light/Dark theme
- [x] Toggle Theme
- [x] Decide footer
- [x] Decide where to put contacts
- [x] Responsive
- [x] Style text-selection
- [x] Design Menu
- [x] Navigation (transition between sections) 
- [ ] Review transitions consistency
- [x] Refine copywrite
- [ ] Reduced motion (80% done)
  - intro: Remove circle animation
  - intro: Pause dots animations
  - intro: gelly and echo are simply opacity effect.
  - words: has no animations/opacity. a simple go over.
  - skills: remove zoom effect and opacities.
  - skills: remove starts rotation and remove delays.
  - journey: show it all without fades.
  - contacts: remove _all_ animations, includind svg scroll.

### Development
- [x] 🐛 Resize recalculation.
- [x] 🐛 Responsive change needs recalculation.
- [x] 🐛 Values - when scrolling to fast, clipping values are wrong.
- [x] 🐛 Contacts - On Safari a horizonal scroll happens on elements with translate (not absolute). Refactor that.
- [x] Verify slow loading
- [ ] Bundle production mode
- [ ] Review test coverage
- [x] Review Accessibility
- [ ] Review SEO (Missing favicon)
- [x] Review HTML
- [ ] Review manifest
- [ ] Review Lighthouse
- [x] Review animations performance
- [ ] Add GA Tracking (for error tracking)
- [ ] Do critical path (maybe)
- [ ] Easter Eggs (maybe)
- [ ] Review custom properties fallback (maybe)