import { IDS, getElement } from "./elements";

function resetNewTagForm() {
  const $newTagForm = getElement(IDS.tagForm.form);
  $newTagForm.reset();
}

function openNewTagForm() {
  const $newTagDialog = getElement(IDS.tagForm.dialog);
  $newTagDialog.showModal();
}

export function closeNewTagForm() {
  const $newTagDialog = getElement(IDS.tagForm.dialog);
  $newTagDialog.close();
  resetNewTagForm();
}

function getNewTagFormData() {
  const $newTagForm = getElement(IDS.tagForm.form);
  return {
    name: $newTagForm.elements.name.value,
  };
}

export function initNewTagForm(config) {
  const { onSubmit } = config;

  const $newTagForm = getElement(IDS.tagForm.form);
  const $addTagButton = getElement(IDS.tagForm.addButton);
  const $closeDialogButton = getElement(IDS.tagForm.closeButton);

  console.log($addTagButton)

  $newTagForm.addEventListener("submit", (e) => {
    e.preventDefault();

    onSubmit(getNewTagFormData());
  });

  $addTagButton.addEventListener("click", () => {
    openNewTagForm();
  });

  $closeDialogButton.addEventListener("click", () => {
    closeNewTagForm();
  });
}
