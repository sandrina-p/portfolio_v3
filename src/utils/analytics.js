import splitbee from '@splitbee/web';

if (process.env.NODE_ENV === 'production') {
  splitbee.init({
    disableCookie: true,
  });
}

export function sendTrack(eventName, extra = '') {
  if (process.env.NODE_ENV === 'production') {
    splitbee.track(eventName, { extra: extra.toString() });
  }
}

export function trackUser(options) {
  if (process.env.NODE_ENV === 'production') {
    splitbee.user.set(options);
  }
}
