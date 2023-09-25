import { fields, getState, getTagsWeight } from "../state";
import { IDS, getElement, getTemplate } from "./elements";

const selectors = {
  subitem: ".subitem-form",
};

function renderSubitemForm() {
  const $clone = getTemplate(IDS.itemForm.subitemTemplate);

  const $subitem = $clone.querySelector(selectors.subitem);
  const $subitemSelect = $subitem.querySelector("select");

  const tags = getState(fields.tags);

  tags.forEach((tag) => {
    const $tag = renderTagOption(tag);
    $subitemSelect.appendChild($tag);
  });

  return $subitem;
}

function renderTagOption(tag) {
  const $option = document.createElement("option");
  $option.textContent = tag.name;
  $option.value = tag.id;
  return $option;
}

export function updateTagsSelect() {
  const $tagsSelect = getElement(IDS.itemForm.tagsSelect);

  $tagsSelect.innerHTML = "";

  const tags = [...getState(fields.tags)];
  const tagsWeight = getTagsWeight();
  tags.sort((a, b) => tagsWeight[b.id] - tagsWeight[a.id]);

  tags.forEach((tag) => {
    const $option = renderTagOption(tag);
    $tagsSelect.appendChild($option);
  });
}

function resetNewItemForm() {
  const $newItemForm = getElement(IDS.itemForm.form);
  const $newItemFormSubitemsList = getElement(IDS.itemForm.subitemsList);

  $newItemForm.reset();
  $newItemFormSubitemsList.innerHTML = "";
}

function openNewItemForm() {
  const $newItemDialog = getElement(IDS.itemForm.dialog);
  $newItemDialog.showModal();
}

export function closeNewItemForm() {
  const $newItemDialog = getElement(IDS.itemForm.dialog);
  $newItemDialog.close();
  resetNewItemForm();
}

export function getNewItemFormData() {
  const $newItemForm = getElement(IDS.itemForm.form);

  const fd = new FormData($newItemForm);

  const subitemTexts = fd.getAll("subitems[text][]");
  const subitemPrices = fd.getAll("subitems[price][]");
  const subitemTags = fd.getAll("subitems[tag][]");

  return {
    text: fd.get("text"),
    price: fd.get("price"),
    tag: Number(fd.get("tag")),

    subitems: subitemTexts.map((text, i) => {
      return {
        text,
        price: subitemPrices[i],
        tag: Number(subitemTags[i]),
      };
    }),
  };
}

export function initNewItemForm(config) {
  const { onSubmit } = config;

  const $newItemForm = getElement(IDS.itemForm.form);
  const $addItemButton = getElement(IDS.itemForm.addButton);
  const $closeDialogButton = getElement(IDS.itemForm.closeButton);
  const $addSubitemButton = getElement(IDS.itemForm.addSubitemBtn);
  const $subitemsList = getElement(IDS.itemForm.subitemsList);

  $newItemForm.addEventListener("submit", (e) => {
    e.preventDefault();

    onSubmit(getNewItemFormData());
  });

  $addItemButton.addEventListener("click", () => {
    openNewItemForm();
  });

  $closeDialogButton.addEventListener("click", () => {
    closeNewItemForm();
  });

  $addSubitemButton.addEventListener("click", () => {
    const $subitemForm = renderSubitemForm();
    $subitemsList.appendChild($subitemForm);
  });
}
