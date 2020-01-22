// Media queries to be used by PostCSS and store/responsive (JS).

const breakpoints = {
  // 'xs': '(min-width: 26em)', // 416px // iphone plus
  // 'sm': '(min-width: 31.25em)', // 500px

  md: '(min-width: 48em)', // 768px (~tablet)
  'max-md': '(max-width: 47.9375em)', // 768px - 1px
};

module.exports = breakpoints;
