import { createStore } from './storeFactory.js';

const [strGeneral, updateGeneral] = createStore({});

/*
{
  isReady: bool - when Intro animations are done, and user can start to scroll.
} 
*/
export { strGeneral, updateGeneral };
