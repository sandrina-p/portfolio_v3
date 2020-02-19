// Media queries to be used by PostCSS and store/responsive (JS).

const breakpoints = {
  md: '(min-width: 48em)', // 768px (~tablet)
  'max-xs': '(max-width: 20em)', // 320px (iphone5)
  'max-md': '(max-width: 47.9375em)', // 768px - 1px
};

module.exports = breakpoints;
