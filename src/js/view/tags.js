import { IDS, getElement, getTemplate } from "./elements";

const selectors = {
  tag: ".tag",
  tagName: ".tag-name",
  tagRemove: ".tag-remove",
};

function renderTag(tag) {
  const $clone = getTemplate(IDS.tags.template);

  const $tag = $clone.querySelector(selectors.tag);
  $tag.dataset.tagId = tag.id;
  $tag.querySelector(selectors.tagName).textContent = tag.name;
  return $tag;
}

export function renderTagsList(tags) {
  const $tagsList = getElement(IDS.tags.list);

  tags.forEach((tag) => {
    const $tag = renderTag(tag);
    $tagsList.appendChild($tag);
  });
}

export function addTagToList(tag) {
  const $tagsList = getElement(IDS.tags.list);

  const $tag = renderTag(tag);
  $tagsList.appendChild($tag);
}

export function removeTagFromList(tagId) {
  const $element = document.querySelector(`[data-tag-id="${tagId}"]`);
  $element.remove();
}

export function initTagsList(config) {
  const { onRemove } = config;

  const $tagsList = getElement(IDS.tags.list);
  $tagsList.addEventListener("click", (e) => {
    const $removeButton = e.target.closest(selectors.tagRemove);
    if ($removeButton) {
      const $tag = e.target.closest(selectors.tag);
      onRemove(Number($tag.dataset.tagId));
    }
  });

  const $tagsToggleButton = getElement(IDS.tags.toggleListBtn);
  const $tagsSidebar = getElement(IDS.tags.aside);

  $tagsToggleButton.addEventListener("click", () => {
    if ($tagsSidebar.hasAttribute("data-open")) {
      $tagsSidebar.removeAttribute("data-open");
    } else {
      $tagsSidebar.setAttribute("data-open", "true");
    }
  });
}
