import { createStore } from './storeFactory.js';

const [strGeneral, updateGeneral, afterGeneralUpdate] = createStore({
  pageSections: ['intro', 'words', 'skills', 'about'],
  pageCurrentSection: 'intro',
  isReady: false, // when Intro animations are done, and user can start to scroll.
});
export { strGeneral, updateGeneral, afterGeneralUpdate };
