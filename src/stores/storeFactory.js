import { readable, writable } from 'svelte/store';

// A factory to create a store that prevents useless updates,
// this is, it ignores updates that match the previous state.

export function createStore(initialState = {}) {
  let store = writable(initialState);
  let state;

  const unsubscribe = store.subscribe(value => {
    state = value;
  });

  function update(newState) {
    const isDifferent = Object.keys(newState).some(key => state[key] !== newState[key]);

    if (!isDifferent) {
      return;
    }

    store.update(state => ({
      ...state,
      ...newState,
    }));
  }

  return [store, update];
}
