/* 

A "deridable" version of the original "window"
This is, its values (width, height, etc...) are automatically updated when a resize happens.

## Roadmap:
- Publish this package!
- Add options (read bottom of file)
*/

import { get, readable, writable } from 'svelte/store';
import debounce from 'lodash/debounce';
import breakpoints from '../theme/breakpoints';
import { sendGA } from '../utils';

let privateIsCalculated = false;
const debounceResize = debounce(handleResize, 250);
const _window = writable(null);
const matchMq = writable({});
const isCalculated = writable(false);

let matchMqState;
let _windowState;

const matchMqUnsub = matchMq.subscribe(value => {
  matchMqState = value;
});
const _windowUnsub = _window.subscribe(value => {
  _windowState = value;
});

let afterUpdateCb = [];
const afterUpdate = fn => afterUpdateCb.push(fn);

function updateResponsiveData({ doCb = true } = {}) {
  const getState = () => ({ matchMq: matchMqState, _window: _windowState });
  const prevState = getState();
  _window.update(() => ({
    // Roadmap: Set these values as option.windowAttrs.
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
  }));

  matchMq.update(() => {
    const qs = {};
    for (let key in breakpoints) {
      /* OPTIMIZE_1 - should use .change() instead? */
      /* OPTIMIZE_2 - add polyfill */
      qs[key] = window.matchMedia(breakpoints[key]).matches;
    }

    return qs;
  });

  const state = getState();

  if (doCb) {
    for (const cb of afterUpdateCb) {
      cb(prevState, state);
    }
  }
}

function handleResize() {
  const preW = get(_window);
  const { innerWidth, innerHeight } = window;
  if (innerWidth === preW.innerWidth) {
    const diffHeight = Math.abs(innerHeight - preW.innerHeight);
    const didToggleBars = diffHeight < 170;

    if (didToggleBars) {
      return;
    } else {
      // Probably was on a mobile device https://stackoverflow.com/questions/8898412/iphone-ipad-triggering-unexpected-resize-events
      sendGA(
        'send',
        'event',
        'resize',
        'mobile_from_to',
        `${innerWidth}-${preW.innerHeight}-${innerHeight}`
      );
    }
  }
  updateResponsiveData();
}

function initResponsive(options) {
  /** options ROADMAP: {}
   * breakpoints: accept a list with sizes in px { sm: 500, md: 700, lg: 1000 }
   * initial: a default initial breakpoint for SSR: 'md'
   * windowAttrs: A list of attributes to get from window on resize.
   */

  if (privateIsCalculated) {
    console.warn('initResponsive ignored. It only needs to be called once.');
    return false;
  }

  privateIsCalculated = true;
  updateResponsiveData({ doCb: false });
  isCalculated.update(() => true);
  window.addEventListener('resize', debounceResize);
  console.log('initResponsive started');
}

export {
  initResponsive,
  /* true after initResponsive is called - _window is now available  */
  isCalculated,
  /* A copy of some window properties (innerWidth + innerHeight) */
  _window,
  /* A callback to be runned on resize, *after* _window update. 
  NOTE/BUG: This cb is called even after the component is destroyed.
  I need to figure how to fix that. Until then make sure to return earlier
  on the component if it's not mounted. (ex: ValuesHorizon) */
  afterUpdate as afterResponsiveUpdate,
  /* An object with mediaqueries matches cached. */
  matchMq,
};
