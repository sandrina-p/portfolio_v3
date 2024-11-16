import splitbee from '@splitbee/web';

if (process.env.ENVIRONMENT === 'production') {
  splitbee.init({
    disableCookie: true,
  });
}

export function sendTrack(eventName, extra = '') {
  if (process.env.ENVIRONMENT === 'production') {
    splitbee.track(eventName, { extra: extra.toString() });
  }
}

export function trackUser(options) {
  if (process.env.ENVIRONMENT === 'production') {
    splitbee.user.set(options);
  }
}
