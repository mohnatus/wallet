import { addItemToDb, addPeriodToDb, addTagToDb, removeItemFromDb, removeTagFromDb } from "./js/db";
import {
  events,
  selectActiveItems,
  selectActivePeriod,
  selectPeriods,
  selectTags,
  selectWeightedTags,
  setActivePeriod,
  subscribe,
} from "./js/store";
import { addItemToList, addPeriodToList, addTagToList, closeNewItemForm, closeNewTagForm, highlightActivePeriod, removeItemFromList, renderItemsList, renderPeriodsList, renderTagsList, updateTagsSelect } from "./js/view";

function updateTagsHelper() {
  updateTagsSelect(selectWeightedTags());
}

export function subscribeToStore() {
  subscribe(events.inited, () => {
    renderTagsList(selectTags());
    renderItemsList(selectActiveItems());
    renderPeriodsList(selectPeriods());
    highlightActivePeriod(selectActivePeriod());
    updateTagsHelper();
  });

  subscribe(events.addItem, (item) => {
    addItemToDb(item);
    addItemToList(item);
    closeNewItemForm();
    updateTagsHelper();
  });

  subscribe(events.addTag, (tag) => {
    addTagToDb(tag);
    addTagToList(tag);
    closeNewTagForm();
    updateTagsHelper();
  });

  subscribe(events.addPeriod, (period) => {
    addPeriodToDb(period);
    addPeriodToList(period);
    setActivePeriod(period);
  });

  subscribe(events.removeTag, (tag) => {
    removeTagFromDb(tag);
    removeTagFromList(tag.id);
    updateTagsHelper();
  });

  subscribe(events.removeItem, (item) => {
    removeItemFromDb(item);
    removeItemFromList(item.id);
    updateTagsHelper();
  });

  subscribe(events.setActivePeriod, (activePeriod) => {
    renderItemsList(selectActiveItems());
    highlightActivePeriod(activePeriod);
  });
}
