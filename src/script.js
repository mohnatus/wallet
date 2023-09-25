import { initDB } from "./js/db";
import { addItemToDb, removeItemFromDb } from "./js/db/items";
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
  renderItemsList(items);
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

// Database
initDB().then(({ tags, items }) => {
  state.init({ tags, items });
});

// Init
console.log("init");
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
