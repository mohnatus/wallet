export const IDS = {
  items: {
    list: "items",
    template: "item-tmpl",
    subitemTemplate: "subitem-tmpl",
  },

  itemForm: {
    dialog: "new-item-dialog",
    form: "new-item-form",
    addButton: "add-item",
    closeButton: "close-new-item-dialog",
    subitemsList: "new-item-form-subitems",
    tagsSelect: "tags-select",
    addSubitemBtn: "new-item-add-subitem",
    subitemTemplate: "subitem-form-tmpl",
  },

  tags: {
    list: "tags",
    template: "tag-tmpl",
    aside: "tags-sidebar",
    toggleListBtn: "tags-toggle",
  },

  tagForm: {
    dialog: "new-tag-dialog",
    form: "new-tag-form",
    addButton: "add-tag",
    closeButton: "close-new-tag-dialog",
  },

  periods: {
    toggleButton: 'periods-toggle',
    startButton: 'start-period',
    aside: 'periods-sidebar',
    list: 'periods-list',
    periodTemplate: 'period-tmpl'
  }
};

const cache = {};

export function getElement(id) {
  if (cache[id]) return cache[id];

  const element = document.getElementById(id);
  cache[id] = element;
  return element;
}

export function getTemplate(id) {
  const template = getElement(id);
  const $clone = template.content.cloneNode(true);
  return $clone;
}
