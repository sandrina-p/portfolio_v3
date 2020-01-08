export function getInLimit(value, min, max) {
  const tooSmall = value < min;
  const tooBig = value > max;

  if (!tooSmall && !tooBig) {
    return Number(value.toFixed(3));
  } else if (tooSmall) {
    return min;
  } else if (tooBig) {
    return max;
  }
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

// There are some timeouts around the app.
// All of them have an explanation:
export const TIMEOUTS = {
  // approximately the time of CSS intro animations.
  INTRO_ANIMATED: 2000,
  // Nav animation on click has an animation. Wait when it's
  // "fullscreen" animated (~middle), to hide the manual scroll behind.
  NAV_ANIMATING: 500,
  // the section change might be triggered by Nav, so the scroll
  // is manually done (Nav.svelte). Just a time-sanity check.
  NAV_SCROLLED: 15,
};

export function setRIC() {
  // requestIdleCallback support for all browsers
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
