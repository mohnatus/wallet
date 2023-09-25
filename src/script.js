import { initDB } from "./js/db";
import { addItemToDb, removeItemFromDb } from "./js/db/items";
import { addPeriodToDb } from "./js/db/periods";
import { addTagToDb, removeTagFromDb } from "./js/db/tags";
import * as state from "./js/state";
import { notifyError } from "./js/utils/notifier";
import {
  closeNewItemForm,
  initNewItemForm,
  updateTagsSelect,
} from "./js/view/itemForm";
import {
  addItemToList,
  initItemsList,
  removeItemFromList,
  renderItemsList,
} from "./js/view/items";
import {
  addPeriodToList,
  initPeriodsList,
  renderPeriodsList,
} from "./js/view/periods";
import { closeNewTagForm, initNewTagForm } from "./js/view/tagForm";
import {
  addTagToList,
  initTagsList,
  removeTagFromList,
  renderTagsList,
} from "./js/view/tags";

// Subscriptions
state.subscribe(state.fields.tags, state.events.update, (tags) => {
  renderTagsList(tags);
  updateTagsSelect();
});
state.subscribe(state.fields.tags, state.events.add, (tag) => {
  addTagToList(tag);
  closeNewTagForm();
  updateTagsSelect();
  addTagToDb(tag);
});
state.subscribe(state.fields.tags, state.events.remove, (tag) => {
  removeTagFromList(tag.id);
  updateTagsSelect();
  removeTagFromDb(tag);
});

state.subscribe(state.fields.items, state.events.update, (items) => {
  const periodItems = state.getPeriodItems();
  renderItemsList(periodItems);
  updateTagsSelect();
});
state.subscribe(state.fields.items, state.events.add, (item) => {
  addItemToList(item);
  closeNewItemForm();
  addItemToDb(item);
  updateTagsSelect();
});
state.subscribe(state.fields.items, state.events.remove, (item) => {
  removeItemFromList(item.id);
  removeItemFromDb(item);
  updateTagsSelect();
});

state.subscribe(state.fields.periods, state.events.update, (periods) => {
  renderPeriodsList(periods);
});
state.subscribe(state.fields.periods, state.events.add, (period) => {
  addPeriodToList(period);
  addPeriodToDb(period);
  state.setActivePeriod(period);
});

state.subscribe(
  state.fields.activePeriod,
  state.events.update,
  (activePeriod) => {
    const periodItems = state.getPeriodItems();
    renderItemsList(periodItems);
  }
);

// Database
initDB().then(({ tags, items, periods }) => {
  const periodsList = periods;
  if (periods.length === 0) {
    const basePeriod = {
      id: 0,
      createdAt: null,
    };
    periodsList.push(basePeriod);
    addPeriodToDb(basePeriod);
  }

  state.init({ tags, items, periods: periodsList });
});

// Init
initNewItemForm({
  onSubmit: (formData) => {
    const { text, price, tag, subitems } = formData;
    const createdAt = +new Date();

    const newItem = {
      id: state.getId(state.fields.items),
      text,
      price,
      tag,
      createdAt,

      subitems: subitems.map((subitem) => {
        return {
          id: state.getId(state.fields.items),
          text: subitem.text,
          price: subitem.price,
          tag: subitem.tag,
          createdAt,
        };
      }),
    };

    state.add(state.fields.items, newItem);
  },
});
initNewTagForm({
  onSubmit: (formData) => {
    const { name } = formData;
    const newTag = {
      id: state.getId(state.fields.tags),
      name,
      createdAt: +new Date(),
    };
    state.add(state.fields.tags, newTag);
  },
});
initItemsList({
  onRemove: (itemId) => {
    const items = state.getState(state.fields.items);
    const item = items.find((i) => i.id === itemId);
    state.remove(state.fields.items, item);
  },
});
initTagsList({
  onRemove: (tagId) => {
    const tags = state.getState(state.fields.tags);
    const tag = tags.find((t) => t.id === tagId);

    const items = state.getState(state.fields.items);

    const tagItems = items.some((item) => {
      if (item.tag === tag.id) return true;
      return item.subitems.some((subitem) => subitem.tag === tag.id);
    });
    if (tagItems) {
      notifyError("Тег нельзя удалить");
      return;
    }
    state.remove(state.fields.tags, tag);
  },
});
initPeriodsList({
  onStart: () => {
    const newPeriod = {
      id: state.getId(state.fields.periods),
      createdAt: +new Date(),
    };
    state.add(state.fields.periods, newPeriod);
  },
  onRemove: (periodId) => {
    const periods = state.getState(state.fields.periods);
    const period = periods.find((p) => p.id === periodId);
    state.remove(state.fields.periods, period);
  },
  onSelect: (periodId) => {
    const periods = state.getState(state.fields.periods);
    const period = periods.find((p) => p.id === periodId);
    state.setActivePeriod(period);
  },
});
