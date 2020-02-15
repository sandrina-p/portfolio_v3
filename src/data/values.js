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
      `Combining design and development processes is one of my expertises. As someone with a background in communication design, I love to <strong>work closely with the design team</strong> and don't let technical constraints compromise the final experience.`,
    ],
    width: '52rem',
    height: '21rem',
  },
  ASK: {
    text: [
      'Clear understanding and open communication are fundamental parts of my process: expect lots of questions - questions that help clear barriers, unpack assumptions and spark <a class="u-link" target="_blank" rel="noreferrer" href="https://en.wikipedia.org/wiki/Eureka_effect">eureka</a> moments.',
    ],
    width: '32rem',
    height: '32rem',
  },
  WOLF: {
    text: [
      'If you wanna go quickly, I can make it happen. As a fast paced learner with a <strong>high quality bar</strong>, I can go solo when needed.',
      `But if you wanna go far and prefer collaboration over competition, <a class="u-link" href="${EMAIL_URL}">ask me</a> to join your team!`,
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
