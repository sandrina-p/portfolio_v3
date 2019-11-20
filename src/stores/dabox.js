import { readable, writable } from 'svelte/store';
import { createStore } from './storeFactory.js';

let strDabox = writable({});
let stateDabox;

const unsubscribe = strDabox.subscribe(value => {
  stateDabox = value;
});

function updateDabox(newState) {
  const hasDifferences = Object.keys(newState).some(key => stateDabox[key] !== newState[key]);

  if (!hasDifferences) {
    return false;
  }

  strDabox.update(state => ({
    ...state,
    ...newState,
  }));
}

export { strDabox, updateDabox };
