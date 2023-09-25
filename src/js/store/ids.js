const ids = {};

export function getNextId(fieldName) {
  if (!(fieldName in ids)) {
    ids[fieldName] = 0;
  }
  return ++ids[fieldName];
}

export function setLastId(fieldName, id) {
  ids[fieldName] = id;
}
