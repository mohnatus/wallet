import { fields, getState } from "../state";
import { IDS, getElement, getTemplate } from "./elements";

const selectors = {
  item: ".item",
  itemText: ".item-text",
  itemPrice: ".item-price",
  itemTag: ".item-tag",
  itemRemove: ".item-remove",

  subitems: ".item-subitems",

  subitem: ".subitem",
  subitemText: ".subitem-text",
  subitemPrice: ".subitem-price",
  subitemTag: ".subitem-tag",
};

function renderSubitem(subitem) {
  const $clone = getTemplate(IDS.items.subitemTemplate);

  const $subitem = $clone.querySelector(selectors.subitem);
  $subitem.querySelector(selectors.subitemText).textContent = subitem.text;
  $subitem.querySelector(selectors.subitemPrice).textContent = subitem.price;

  const tags = getState(fields.tags);

  const subitemTag = tags.find((tag) => tag.id === subitem.tag);
  $subitem.querySelector(selectors.subitemTag).textContent =
    subitemTag?.name || "";

  return $subitem;
}

function renderItem(item) {
  const $clone = getTemplate(IDS.items.template);

  const $item = $clone.querySelector(selectors.item);
  $item.dataset.itemId = item.id;
  $item.querySelector(selectors.itemText).textContent = item.text;
  $item.querySelector(selectors.itemPrice).textContent = item.price;

  const tags = getState(fields.tags);

  const itemTag = tags.find((tag) => tag.id === item.tag);
  $item.querySelector(selectors.itemTag).textContent = itemTag?.name || "";

  if (item.subitems?.length > 0) {
    const $subitemsList = $item.querySelector(selectors.subitems);
    item.subitems.forEach((subitem) => {
      const $subitem = renderSubitem(subitem);
      $subitemsList.appendChild($subitem);
    });
  }

  return $item;
}

export function renderItemsList(items) {
  const $itemsList = getElement(IDS.items.list);

  items.forEach((item) => {
    const $item = renderItem(item);
    $itemsList.appendChild($item);
  });
}

export function addItemToList(item) {
  const $item = renderItem(item);

  const $itemsList = getElement(IDS.items.list);
  $itemsList.appendChild($item);
}

export function removeItemFromList(itemId) {
  const $element = document.querySelector(`[data-item-id="${itemId}"]`);
  $element.remove();
}

export function initItemsList(config) {
  const { onRemove } = config;

  const $itemsList = getElement(IDS.items.list);
  $itemsList.addEventListener("click", (e) => {
    const $removeButton = e.target.closest(selectors.itemRemove);
    if ($removeButton) {
      const $tag = e.target.closest(selectors.item);
      onRemove(Number($tag.dataset.itemId));
    }
  });
}
