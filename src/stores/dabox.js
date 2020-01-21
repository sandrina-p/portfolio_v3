/* OPTIMIZE - This code be deleted, cause now is only used in 1 file */

import { createStore } from './storeFactory.js';

const [strDabox, updateDabox] = createStore({
  // isActive: Boolean - true when dabox is visible,
  // progress: Number (0 to 1) - when morph is going on
});

export { strDabox, updateDabox };
