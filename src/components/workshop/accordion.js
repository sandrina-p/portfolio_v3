const setHeight = (detail, isOpen) => {
  detail.open = isOpen;
  const { width, height } = detail.getBoundingClientRect();
  // TODO convert this to svelte
  detail.dataset.width = width;
  detail.style.setProperty(isOpen ? `--expanded` : `--collapsed`, `${height}px`);
};

export function setAccordion(el) {
  const RO = new ResizeObserver(entries => {
    return entries.forEach(entry => {
      const detail = entry.target;
      const width = parseInt(detail.dataset.width, 10);

      if (width !== entry.contentRect.width) {
        detail.removeAttribute('style');
        setHeight(detail, false);
        setHeight(detail, true);
        detail.open = false;
      }
    });
  });

  RO.observe(el);
}
