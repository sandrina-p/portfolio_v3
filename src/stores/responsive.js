// ENHANCEMENT: Make this a plugin
import { readable, writable } from 'svelte/store';
import debounce from 'lodash/debounce';

let isCalculated = false;
const debounceResize = debounce(handleResize, 100);
const _window = writable(null);

let onResponsiveChangeCb = () => true;
const onResponsiveChange = fn => (onResponsiveChangeCb = fn);

function handleResize() {
  _window.update(() => window);
  onResponsiveChangeCb();
}

export function initResponsive(options) {
  /** options ROADMAP: {}
   * breakpoints: accept a list with sizes in px { sm: 500, md: 700, lg: 1000 }
   * initial: a default initial breakpoint for SSR: 'md'
   */

  if (isCalculated) {
    console.warn('initResponsive only needs to be called once. Ignored.');
    return false;
  }
  console.log('initResponsive executing...');

  isCalculated = true;

  _window.update(() => window);
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
  /* A callback to be runned on resize, *after* _window update. */
  onResponsiveChange,

  /* ROADMAP:
    mediaIs, // current bp (breakpoint) (md, lg, etc...),
    media // Object with bps if they do match or not { md: true, lg: false } 
    mediaUntil // Object with bps if they do match or not { md: false, lg: true } 
    /ex:
    mediaIs.md // false if width is 699px
    media.lg // true if at least '1000px' width.
  */
};
