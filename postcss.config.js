const breakpoints = require('./src/theme/breakpoints.js');
const variables = require('./src/theme/variables.js');

// prefix `--` to each breakpoint for custom variables (ex: 'md' -> '--md')
const customMedia = {};
for (let bp in breakpoints) {
  customMedia[`--${bp}`] = breakpoints[bp];
}

const mixins = {
  motionDefault: function(mixin, dir) {
    return {
      ':global(.jsMotionDefault) &': {
        '@mixin-content': {},
      },
    };
  },
  motionReduced: function(mixin, dir) {
    return {
      ':global(.jsMotionReduced) &': {
        '@mixin-content': {},
      },
    };
  },
};

module.exports = {
  plugins: {
    'postcss-preset-env': {
      features: {
        'custom-media-queries': {
          importFrom: {
            customMedia,
          },
        },
        'focus-within-pseudo-class': false,
      },
    },
    'postcss-for': {},
    'postcss-mixins': { mixins }, // QUESTION / REVIE - Why isn't this working...
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
