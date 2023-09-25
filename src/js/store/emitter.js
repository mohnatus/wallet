const callbacks = {};

export function subscribe(eventName, eventCb) {
  if (!(eventName in callbacks)) {
    callbacks[eventName] = [];
  }

  callbacks[eventName].push(eventCb);
}

export function emit(eventName, eventData) {
  const eventCallbacks = callbacks[eventName];
  if (!eventCallbacks) return;
  eventCallbacks.forEach((cb) => cb(eventData));
}
