const breakpoints = require('./src/theme/breakpoints.js');
const variables = require('./src/theme/variables.js');

// prefix `--` to each breakpoint for custom variables (ex: 'md' -> '--md')
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
    'postcss-simple-vars': {
      variables,
    },
    'postcss-conditionals': {},
    'postcss-calc': {},
    'css-mqpacker': { sort: true },
  },
};
