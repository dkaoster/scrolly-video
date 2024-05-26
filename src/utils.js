export function debounce(func, delay = 0) {
  let timeoutId;

  return function (...args) {
    const context = this;

    // Clear the previous timeout if it exists
    clearTimeout(timeoutId);

    // Set a new timeout to call the function later
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

export const isScrollPositionAtTarget = (
  targetScrollPosition,
  threshold = 1,
) => {
  // eslint-disable-next-line no-undef
  const currentScrollPosition = window.pageYOffset;
  const difference = Math.abs(currentScrollPosition - targetScrollPosition);

  return difference < threshold;
};
