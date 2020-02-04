/* 

A "deridable" version of the original "window"
This is, its values (width, height, etc...) are automatically updated when a resize happens.

## Roadmap:
- Publish this package!
- Add options (read below)
*/

import { get, readable, writable } from 'svelte/store';
import debounce from 'lodash/debounce';
import breakpoints from '../theme/breakpoints';

let privateIsCalculated = false;
const debounceResize = debounce(handleResize, 100);
const _window = writable(null);
const matchMq = writable({});
const isCalculated = writable(false);

let matchMqState;
let _windowState;

const matchMqUnsubscribe = matchMq.subscribe(value => {
  matchMqState = value;
});
const _windowUnsubscribe = _window.subscribe(value => {
  _windowState = value;
});

let afterResponsiveUpdateCb = () => true;
const afterResponsiveUpdate = fn => (afterResponsiveUpdateCb = fn);

function updateResponsiveData() {
  const getState = () => ({ matchMq: matchMqState, _window: _windowState });
  const prevState = getState();
  _window.update(() => ({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
  }));

  matchMq.update(() => {
    const qs = {};
    for (let key in breakpoints) {
      /* OPTIMIZE_1 - should use change instead? */
      /* OPTIMIZE_2 - add polifil? */
      qs[key] = window.matchMedia(breakpoints[key]).matches;
    }

    return qs;
  });

  const state = getState();
  afterResponsiveUpdateCb(prevState, state);
}

function handleResize() {
  const preW = get(_window);
  if (window.innerWidth === preW.innerWidth) {
    const diffHeight = Math.abs(window.innerHeight - preW.innerHeight);
    if (diffHeight < 50) {
      // OPTIMIZE - Do this better?
      // Probably was a resize on mobile (while scrolling and toolbar did hide)... so ignore this for now.
      return;
    }
  }
  const prevState = { _window, matchMq };
  updateResponsiveData();
}

export function initResponsive(options) {
  /** options ROADMAP: {}
   * breakpoints: accept a list with sizes in px { sm: 500, md: 700, lg: 1000 }
   * initial: a default initial breakpoint for SSR: 'md'
   */

  if (privateIsCalculated) {
    console.warn('initResponsive ignored. It only needs to be called once.');
    return false;
  }

  console.log('initResponsive executing...');

  privateIsCalculated = true;

  updateResponsiveData();
  isCalculated.update(() => true);
  window.addEventListener('resize', debounceResize);
}

export {
  /* true after initResponsive is called - _window is now available  */
  isCalculated,
  /* A "deridable" version of the original window.
  This is, its values are automatically updated when a resize happens.
  // QUESTION: How to make it read-only to the outside?
  */
  _window,
  /* A callback to be runned on resize, *after* _window update. 
  NOTE/BUG: This cb is called even after the component is destroyed.
  I need to figure how to fix that. Until then make sure to return earlier
  on the component if it's not mounted. (ex: ValuesHorizon) */
  afterResponsiveUpdate,
  /* An object with mediaqueries matches cached. */
  matchMq,
};
