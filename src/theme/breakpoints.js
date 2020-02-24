// Media queries to be used by PostCSS and store/responsive (JS).

const breakpoints = {
  'max-xs': '(max-width: 20em)', // 320px (iphone5)
  md: '(min-width: 48em)', // 768px (tablet)
  lg: '(min-width: 64.0625em)', // 1024px + 1px (laptop)
  'max-md': '(max-width: 47.9375em)', // until tablet - 1px
  'max-lg': '(max-width: 64em)', // until desktop
  'only-tablet': '(min-width: 48em) and (max-width: 64em)', // 768px - 1024px (tablet)
};

module.exports = breakpoints;
