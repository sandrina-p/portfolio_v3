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
