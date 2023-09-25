import { selectTags } from "../store";
import { notifyError } from "../utils/notifier";
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

  $newTagForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = getNewTagFormData();
    if (!formData.name) {
      notifyError("Не заполнено поле name", { formData });
      return;
    }

    const tags = selectTags();
    const isDouble = tags.some((t) => t.name === formData.name);
    if (isDouble) {
      notifyError(`Тег с именем ${formData.name} уже добавлен`, { formData });
      return;
    }

    onSubmit(formData);
  });

  $addTagButton.addEventListener("click", () => {
    openNewTagForm();
  });

  $closeDialogButton.addEventListener("click", () => {
    closeNewTagForm();
  });
}
