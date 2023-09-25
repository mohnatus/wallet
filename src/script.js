import { addPeriodToDb, initDB } from "./js/db";
import {
  addItem,
  addPeriod,
  addTag,
  getNextId,
  initStore,
  removeItem,
  removePeriod,
  removeTag,
  selectItemById,
  selectItemsByTag,
  selectPeriodById,
  selectTagById,
  setActivePeriod,
  storeFields,
} from "./js/store";

import {
  initItemsList,
  initNewItemForm,
  initNewTagForm,
  initPeriodsList,
  initTagsList,
} from "./js/view";
import { subscribeToStore } from "./subscribe";
import { notifyError } from "./js/utils/notifier";

subscribeToStore();

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

  initStore({ tags, items, periods: periodsList });
});

// Init
initNewItemForm({
  onSubmit: (formData) => {
    const { text, price, tag, subitems } = formData;
    const createdAt = +new Date();

    const newItem = {
      id: getNextId(storeFields.items),
      text,
      price,
      tag,
      createdAt,

      subitems: subitems.map((subitem) => {
        return {
          id: getNextId(storeFields.items),
          text: subitem.text,
          price: subitem.price,
          tag: subitem.tag,
          createdAt,
        };
      }),
    };

    addItem(newItem);
  },
});
initNewTagForm({
  onSubmit: (formData) => {
    const { name } = formData;
    const newTag = {
      id: getNextId(storeFields.tags),
      name,
      createdAt: +new Date(),
    };
    addTag(newTag);
  },
});
initItemsList({
  onRemove: (itemId) => {
    const item = selectItemById(itemId);
    removeItem(item);
  },
});
initTagsList({
  onRemove: (tagId) => {
    const tag = selectTagById(tagId);
    const tagItems = selectItemsByTag(tagId);

    if (tagItems.length) {
      notifyError("Тег нельзя удалить");
      return;
    }

    removeTag(tag);
  },
});
initPeriodsList({
  onStart: () => {
    const newPeriod = {
      id: getNextId(storeFields.periods),
      createdAt: +new Date(),
    };
    addPeriod(newPeriod);
  },
  onRemove: (periodId) => {
    const period = selectPeriodById(periodId);
    removePeriod(period);
  },
  onSelect: (periodId) => {
    const period = selectPeriodById(periodId);
    setActivePeriod(period);
  },
});
