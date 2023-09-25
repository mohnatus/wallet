import { IDS, getElement } from "./elements";

const selectors = {
  period: ".period",
  periodStart: ".period-start",
  periodEnd: ".period-end",
  periodRemove: ".period-remove",
};

export function renderPeriodsList() {}

export function addPeriodToList(period) {}

export function removePeriodFromList(periodId) {}

export function initPeriodsList(config) {
  const { onStart, onRemove } = config;

  const $toggleButton = getElement(IDS.period.toggleButton);
  const $periodsSidebar = getElement(IDS.period.aside);
  const $periodsList = getElement(IDS.period.list);
  const $startButton = getElement(IDS.period.startButton);

  $toggleButton.addEventListener("click", () => {
    if ($periodsSidebar.hasAttribute("data-open")) {
      $periodsSidebar.removeAttribute("data-open");
    } else {
      $periodsSidebar.setAttribute("data-open", "true");
    }
  });

  $periodsList.addEventListener("click", (e) => {
    const $removeButton = e.target.closest(selectors.period);
    if ($removeButton) {
      const $tag = e.target.closest(selectors.period);
      onRemove(Number($tag.dataset.periodId));
    }
  });

  $startButton.addEventListener("click", onStart);
}
