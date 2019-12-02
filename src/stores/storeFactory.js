import { readable, writable } from 'svelte/store';

// A factory to create a store that prevents useless updates,
// this is, it ignores updates that match the previous state.

export function createStore(initialState = {}) {
  let store = writable(initialState);
  let state;
  let afterUpdateCb = [];
  const afterUpdate = fn => afterUpdateCb.push(fn);

  const unsubscribe = store.subscribe(value => {
    state = value;
  });

  function update(newState) {
    const prevState = state;
    const isDifferent = Object.keys(newState).some(key => prevState[key] !== newState[key]);

    if (!isDifferent) {
      return;
    }

    store.update(state => ({
      ...state,
      ...newState,
    }));

    for (const cb of afterUpdateCb) {
      cb(prevState, state);
    }
  }

  return [store, update, afterUpdate];
}
