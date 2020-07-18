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
      `Combining design and development processes is one of my expertises. As a frontend developer, I do my best to empower designers and prevent technical constraints from compromising the user experience.`,
    ],
    width: '52rem',
    height: '22rem',
  },
  ASK: {
    text: [
      'Clear understanding and open communication are fundamental parts of my process: <strong>expect lots of questions</strong> - questions that help clear barriers, unpack assumptions and spark <a class="u-link" rel="noreferrer" target="_blank" href="https://en.wikipedia.org/wiki/Eureka_effect">eureka</a> moments.',
    ],
    width: '32rem',
    height: '32rem',
  },
  WOLF: {
    text: [
      'If you wanna go quickly, I can make it happen. As a fast paced learner with a <strong>high quality bar</strong>, I can go solo when needed.',
      `But if you wanna go far and prefer collaboration over competition, then we may be a match made in heaven!`,
    ],
    width: '31.4rem',
    height: '40rem',
  },
  PEOPLE: {
    text: [
      'I feel myself in a constant search for disruptive but pragmatic solutions. Not one for tradition, <strong>striving for innovation</strong>  is my default while helping those around me to go beyond best practices and product requirements.',
    ],
    width: '67rem',
    height: '15rem',
  },
  FINALLE: {
    text: '',
    width: '100vw',
    height: '100vh',
  },
};
