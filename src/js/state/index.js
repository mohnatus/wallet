export const fields = {
  items: "items",
  tags: "tags",
};

export const events = {
  update: "update",
  add: "add",
  remove: "remove",
};

const state = {
  items: [],
  tags: [],
};

const lastId = {
  items: 0,
  tags: 0,
};

const callbacks = {};

export function getState(field) {
  return state[field];
}

export function getAllItems() {
  const items = [];
  state.items.forEach((item) => {
    items.push(item);
    items.push(...item.subitems);
  });
  return items;
}

export function getTagsWeight() {
  const items = getAllItems();
  const weight = {};
  state.tags.forEach((tag) => {
    weight[tag.id] = 0;
  });
  items.forEach((item) => {
    weight[item.tag] += 1;
  });
  return weight;
}

export function getId(field) {
  return ++lastId[field];
}

function onChange(field, event, data) {
  const fieldCbs = callbacks[field];
  if (!fieldCbs) return;

  const eventCbs = fieldCbs[event];
  if (!eventCbs) return;

  eventCbs.forEach((cb) => cb(data));
}

export function subscribe(field, event, cb) {
  if (!(field in callbacks)) callbacks[field] = {};
  if (!(event in callbacks[field])) callbacks[field][event] = [];

  callbacks[field][event].push(cb);
}

export function init({ tags: tagsList, items: itemsList }) {
  if (tagsList.length > 0) {
    lastId.tags = tagsList[tagsList.length - 1].id;
    state.tags = tagsList;
    onChange(fields.tags, events.update, tagsList);
  }

  if (itemsList.length > 0) {
    lastId.items = itemsList[itemsList.length - 1].id;
    state.items = itemsList;
    onChange(fields.items, events.update, itemsList);
  }
}

export function add(field, instance) {
  state[field].push(instance);
  onChange(field, events.add, instance);
}

export function remove(field, instance) {
  state[field] = state[field].filter((i) => i.id !== instance.id);
  onChange(field, events.remove, instance);
}
