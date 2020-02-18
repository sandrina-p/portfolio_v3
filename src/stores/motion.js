import { createStore } from './storeFactory.js';

const [strMotion, updateMotion, afterMotionUpdate] = createStore({
  // isReduced: bool
});

export { strMotion, updateMotion, afterMotionUpdate };
