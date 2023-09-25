import { selectFlatItems } from "./items";
import { getState } from "./state";

export function selectTags() {
  return [...getState().tags];
}

export function selectTagById(tagId) {
  const tags = selectTags();
  return tags.find((t) => t.id === tagId);
}

function selectTagsWeight() {
  const state = getState();

  const items = selectFlatItems();
  const weight = {};
  state.tags.forEach((tag) => {
    weight[tag.id] = 0;
  });
  items.forEach((item) => {
    weight[item.tag] += 1;
  });
  return weight;
}

export function selectWeightedTags() {
  const tags = selectTags();
  const weight = selectTagsWeight();

  tags.sort((a, b) => weight[b.id] - weight[a.id]);

  return tags;
}
