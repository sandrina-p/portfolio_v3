import { createStore } from './storeFactory.js';

const [strGeneral, updateGeneral, afterGeneralUpdate] = createStore({
  pageSections: ['intro', 'words', 'skills', 'journey'],
  pageCurrentSection: 'intro',

  // A list of sections with their last pixel
  // to be used as anchor point to update pageCurrentSection.
  // That way this logic is centralized at Nav.svelte.
  // Each section MUST NOT care about what's next or prev
  // to avoid bugs related with IO callbacks order...
  // [SECTION]: {
  //   el: DOMElement, // used to get section rect limits.
  //   end: Number, // end of section - edge case for Intro (Intro + Values.svelte).
  // }

  // when Intro animations are done, and user can start to scroll.
  // ideally, meanwhile, each section has plenty of time to
  // inform the store about their own pivots.
  isReady: false,
});

export { strGeneral, updateGeneral, afterGeneralUpdate };
