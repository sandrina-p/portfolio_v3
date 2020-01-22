const breakpoints = require('./src/utils/breakpoints.js');

// prefix to each breakpoint `--` for custom variable (ex: 'md' -> '--md')
const customMedia = {};
for (let bp in breakpoints) {
  customMedia[`--${bp}`] = breakpoints[bp];
}

module.exports = {
  plugins: {
    'postcss-preset-env': {
      features: {
        'custom-media-queries': {
          importFrom: {
            customMedia,
          },
        },
      },
    },
    'postcss-for': {},
    'postcss-random': { round: true },
    'postcss-nested': {},
    'postcss-simple-vars': {},
    'postcss-conditionals': {},
    'postcss-calc': {},
    'css-mqpacker': { sort: true },
  },
};
