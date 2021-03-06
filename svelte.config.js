// module.exports = {
//   preprocess: {
//     style: async ({ content, attributes }) => {
//       if (attributes.type !== 'text/postcss') return;
//       return new Promise((resolve, reject) => {
//         resolve({ code: '', map: '' });
//       });
//     },
//   },
// };

const sveltePreprocess = require('svelte-preprocess');
module.exports = { preprocess: sveltePreprocess({ postcss: true }) };
