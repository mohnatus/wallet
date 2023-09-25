import { storeFields } from "./constants";
import { emit } from "./emitter";
import { events } from "./events";
import { setLastId } from "./ids";

const state = {
  items: [],
  tags: [],
  periods: [],
  activePeriod: null,
};

export function getState() {
  return { ...state };
}

export function initStore({
  tags: tagsList,
  items: itemsList,
  periods: periodsList,
}) {
  if (tagsList.length > 0) {
    setLastId(storeFields.tags, tagsList[tagsList.length - 1].id);
    state.tags = tagsList;
  }

  if (itemsList.length > 0) {
    setLastId(storeFields.items, itemsList[itemsList.length - 1].id);
    state.items = itemsList;
  }

  if (periodsList.length > 0) {
    const lastPeriod = periodsList[periodsList.length - 1];
    setLastId(storeFields.periods, lastPeriod.id);
    state.periods = periodsList;
    state.activePeriod = lastPeriod;
  }

  emit(events.inited, state);
}

export function addItem(item) {
  state.items.push(item);
  emit(events.addItem, item);
}

export function addTag(tag) {
  state.tags.push(tag);
  emit(events.addTag, tag);
}

export function addPeriod(period) {
  state.periods.push(period);
  emit(events.addPeriod, period);
}

export function removeItem(item) {
  state.items = state.items.filter((i) => i.id !== item.id);
  emit(events.removeItem, item);
}

export function removeTag(tag) {
  state.tags = state.tags.filter((t) => t.id !== tag.id);
  emit(events.removeTag, tag);
}

export function removePeriod(period) {
  state.periods = state.items.filter((p) => p.id !== period.id);
  emit(events.removePeriod, period);
}

export function setActivePeriod(period) {
  state.activePeriod = period;
  emit(events.setActivePeriod, period);
}
