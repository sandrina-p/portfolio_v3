import { createStore } from './storeFactory.js';

const [strCircle, updateCircle] = createStore({
  // isPaused: Bool - Pause circle animation,
  // style: String - inline style to change variables
});

export { strCircle, updateCircle };
