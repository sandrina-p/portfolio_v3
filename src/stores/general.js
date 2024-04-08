import { createStore } from './storeFactory.js';

const [strGeneral, updateGeneral, afterGeneralUpdate] = createStore({
  pageSections: ['intro', 'words', 'journey', 'contact'],
  pageSectionsId: { intro: 0, words: 1, skills: 2, journey: 3, contact: 4 },
  pageCurrentSection: 'intro',

  /* A list of sections with their last pixel
    to be used as anchor point to update pageCurrentSection.
    That way this logic is centralized at Nav.svelte.
    Each section MUST NOT care about what's next or prev
    to avoid bugs related with IO callbacks...
  */
  // [SECTION]: {
  //   el: DOMElement, // used to get section rect limits.
  //   end: Number, // end of section - edge case for Intro (Intro + Values.svelte).
  // }

  // when Intro animations are done
  isIntroAnimated: false,
  // when Values section is fully loaded (in case it's async on desktop)
  isValuesLoaded: false,
  // isIntroAnimated and isValuesLoaded are true,
  // everywhing is ready to go!
  isReady: false,
  // Skills background/content is visible
  isSkillsVisible: false,
});

export { strGeneral, updateGeneral, afterGeneralUpdate };
