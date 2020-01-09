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
      'Combining both design and development processes is one of Sandrina’s expertises. She loves to <strong>work closely with the design team</strong> to define and implement exciting experiences.',
    ],
    width: '48rem',
    height: '21rem',
  },
  ASK: {
    text: [
      'You’ll see Sandrina asking a lot of questions around. Wanna create a simple but detailed solution?',
      'Let’s understand the problem first.',
      'Only then we can make wise decisions taken with true care.',
    ],
    width: '39rem',
    height: '30rem',
  },
  WOLF: {
    text: [
      'If you wanna go quickly, Sandrina can make it happen. As a fast paced worker with a <strong>high quality bar</strong>, she can be the lone wolf when needed.',
      `However, if you wanna go far, <a class="u-link" href=${EMAIL_URL}>ask her to join</a> your wolves pack and let’s go together, as a team.`,
    ],
    width: '30.2rem',
    height: '40rem',
  },
  PEOPLE: {
    text: [
      "At the end the best practices were followed, all the code was reused and each pixel is perfectly aligned. But <strong>it doesn't matters if there isn’t a human connection</strong> between the people who create a product.",
      // "The technology is only the starting point. The passion behind a team is the fuel to create a memorable experience to everyone.",
    ],
    width: '54rem',
    height: '27rem',
  },
  FINALLE: {
    text: '',
    width: '0',
    height: '0',
  },
};
