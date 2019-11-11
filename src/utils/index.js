export function getInLimit(value, min, max) {
  const tooSmall = value < min;
  const tooBig = value > max;
  if (!tooSmall && !tooBig) {
    return value;
  } else if (tooSmall) {
    return min;
  } else if (tooBig) {
    return max;
  }
}
