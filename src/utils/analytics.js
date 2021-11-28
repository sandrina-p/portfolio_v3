import splitbee from '@splitbee/web';

splitbee.init({
  disableCookie: true,
});

export function sendTrack(eventName, extra = '') {
  splitbee.track(eventName, { extra: extra.toString() });
}

export function trackUser(options) {
  splitbee.user.set(options);
}
