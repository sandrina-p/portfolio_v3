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

export function getIOstatus(entry) {
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

// Based on https://stackoverflow.com/a/22599173/4737729
export const checkScrollSpeed = (function(settings) {
  settings = settings || {};

  let lastPos;
  let newPos;
  let timer;
  let speed;
  let delay = settings.delay || 50; // in "ms" (higher means lower fidelity )

  function clear() {
    lastPos = null;
    speed = 0;
  }

  clear();

  return function() {
    newPos = window.scrollY;
    if (lastPos != null) {
      speed = newPos - lastPos;
    }
    lastPos = newPos;
    clearTimeout(timer);
    timer = setTimeout(clear, delay);
    return speed;
  };
})();
