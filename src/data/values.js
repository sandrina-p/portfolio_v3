import { EMAIL_URL } from './misc.js';

export default {
  // NOTE: The texts are static, so let's take advantage of that
  // and save ms from useless getBoundingClientRect, shall we?
  MORPH: {
    text: '',
    width: '20rem' /* same as circle */,
    height: '20rem',
  },
  DOTS: {
    text: [
      'Combining the design and development processes is one of Sandrina’s expertises. She loves to <strong>work closely with the design team</strong> to create stuff that actually works for everyone.',
    ],
    width: '48rem',
    height: '21rem',
  },
  ASK: {
    text: [
      'You’ll see Sandrina asking the questions you never thought about. Those that will wisper <a class="u-link" target="_blank" href="https://en.wikipedia.org/wiki/Eureka_effect">eureka</a> and lead us to wiser decisions, taken with true care.',
    ],
    width: '32rem',
    height: '32rem',
  },
  WOLF: {
    text: [
      'If you wanna go quickly, Sandrina can make it happen. As a fast paced learner with a <strong>high quality bar</strong>, she can be the lone wolf when needed.',
      `But if you wanna go far, <a class="u-link" href=${EMAIL_URL}>ask her to join</a> your wolves pack and let’s go together, as a team.`,
    ],
    width: '30rem',
    height: '40rem',
  },
  PEOPLE: {
    // TODO - rename to PROGRESS?
    text: [
      'Sandrina is in a constant search for disruptive but pragmatic solutions. She goes beyond best practices and perfect pixels. She’s the one who will <strong>strive for innovation</strong> when everyone else is too afraid to change.',
    ],
    width: '64rem',
    height: '15rem',
  },
  FINALLE: {
    text: '',
    width: '64rem', // same as PEOPLE
    height: '0',
  },
};
