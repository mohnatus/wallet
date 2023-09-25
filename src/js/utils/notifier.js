export function notify(message, data) {
  alert(message);
  console.info(message, data);
}

export function notifyError(message, data) {
  alert(message);
  console.error(message, data);
}
