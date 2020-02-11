export function getInLimit(value, min, max) {
  const theValue = Math.max(min, Math.min(value, max));

  return Number(theValue.toFixed(3));
}

export function getIOstatusHorizontal(entry) {
  const threshold = 5; // sometimes edge isn't exactly 0 when triggered.

  const { boundingClientRect, intersectionRect, rootBounds, isIntersecting } = entry;
  const { height, width } = rootBounds;

  if (isIntersecting) {
    if (intersectionRect.left < threshold) {
      return 'enterLeft';
    } else {
      return 'enterRight';
    }
  } else {
    if (boundingClientRect.left - rootBounds.right < threshold * -1) {
      return 'leaveLeft';
    } else {
      return 'leaveRight';
    }
  }
}

export function getIOstatusVertical(entry) {
  const threshold = 5; // sometimes edge isn't exactly 0 when triggered.

  const { boundingClientRect, intersectionRect, rootBounds, isIntersecting } = entry;
  const { height, width } = rootBounds;

  if (isIntersecting) {
    if (boundingClientRect.top < threshold) {
      return 'enterTop';
    } else {
      return 'enterBottom';
    }
  } else {
    if (boundingClientRect.top < threshold) {
      return 'leaveTop';
    } else {
      return 'leaveBottom';
    }
  }
}

export function getBrowsers() {
  const browsers = {
    jsChrome: /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor),
    jsSafari: !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),
    jsIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    jsFF: !!navigator.userAgent.match(/firefox/i),
  };

  return Object.keys(browsers).reduce((classes, browser) => {
    return browsers[browser] ? `${classes} ${browser}` : classes;
  }, '');
}

// Similar to how Element.scrollIntoView() works but with custom position
// taking in account possible animations within this element.
// ex: scroll 10px from top
// <div on:focusin={ (e) => scrollIntoView(e, { value: 10 }) }>
export function scrollIntoView(
  event,
  {
    // Get elements position vertically (top) or horizontally (left).
    direction = 'top', // top || left
    // where element should be in vieport.
    value,
  }
) {
  if (!['BUTTON', 'A'].includes(event.target.tagName)) {
    // Maybe it was something else?... Strange. Abort and report.
    console.error('scrollIntoView ignored', event.target);
    return false;
  }

  const scrollY = window.scrollY;
  const parentAway = event.currentTarget.getBoundingClientRect()[direction];
  const awaitFromPosition = value - parentAway;
  const to = scrollY - awaitFromPosition;
  window.scrollTo(0, to);
  console.debug('handleKeyboardFocus focus to:', to, event.target);
}

// There are some timeouts around the app.
// All of them have an explanation:
export const TIMEOUTS = {
  // approximately the time of CSS intro animations.
  INTRO_ANIMATED: 2000,
  // Nav animation on click has an animation. Wait when it's
  // "fullscreen" animated (~middle), to hide the manual scroll behind.
  NAV_ANIMATING: 700,
  // the section change might be triggered by Nav, so the scroll
  // is manually done (Nav.svelte). Just a time-sanity check.
  NAV_SCROLLED: 15,
};

// requestIdleCallback support for all browsers
export function setRIC() {
  window.requestIdleCallback =
    window.requestIdleCallback ||
    function(cb) {
      var start = Date.now();
      return setTimeout(() => {
        cb({
          didTimeout: false,
          timeRemaining: function() {
            return Math.max(0, 50 - (Date.now() - start));
          },
        });
      }, 1);
    };

  window.cancelIdleCallback =
    window.cancelIdleCallback ||
    function(id) {
      clearTimeout(id);
    };
}

// Handle styling related to focus based on type of navigation (mouse vs keyboard)
// Ref: https://medium.com/hackernoon/removing-that-ugly-focus-ring-and-keeping-it-too-6c8727fefcd2
export function focusOnlyWhenNeeded() {
  function handleTabOnce(e) {
    if (e.keyCode === 9) {
      document.body.classList.add('js-tabbing');

      window.removeEventListener('keydown', handleTabOnce);
      window.addEventListener('mousedown', handleMouseDownOnce);
    }
  }

  function handleMouseDownOnce() {
    document.body.classList.remove('js-tabbing');

    window.removeEventListener('mousedown', handleMouseDownOnce);
    window.addEventListener('keydown', handleTabOnce);
  }

  window.addEventListener('keydown', handleTabOnce);
}
