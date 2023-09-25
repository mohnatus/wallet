import { getState } from "./state";

export function selectItems() {
  return [...getState().items];
}

export function selectItemById(itemId) {
  const items = selectItems();
  return items.find((i) => i.id === itemId);
}

export function selectFlatItems() {
  const items = [];
  getState().items.forEach((item) => {
    items.push(item);
    items.push(...item.subitems);
  });
  return items;
}

export function selectItemsByTag(tagId) {
  const items = selectFlatItems();
  return items.filter((i) => i.tag === tagId);
}

export function selectActiveItems() {
  const state = getState();

  const period = state.activePeriod;

  if (!period) {
    return [...state.items];
  }

  const periodIndex = state.periods.findIndex((p) => p.id === period.id);
  const nextPeriod = state.periods[periodIndex + 1];

  return state.items.filter((item) => {
    if (period.createdAt && item.createdAt < period.createdAt) return false;
    if (nextPeriod && item.createdAt >= nextPeriod.createdAt) return false;
    return true;
  });
}
