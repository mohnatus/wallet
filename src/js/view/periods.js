import { formatDate } from "../utils/date";
import { IDS, getElement, getTemplate } from "./elements";

const selectors = {
  period: ".period",
  periodStart: ".period-start",
  periodEnd: ".period-end",
  periodRemove: ".period-remove",
};

function renderPeriod(period, nextPeriod) {
  const $clone = getTemplate(IDS.periods.periodTemplate);

  const $period = $clone.querySelector(selectors.period);
  $period.dataset.periodId = period.id;

  const start = new Date(period.createdAt);
  const end = nextPeriod ? new Date(nextPeriod.createdAt) : null;

  $period.querySelector(selectors.periodStart).textContent = `с ${formatDate(
    start
  )}`;
  $period.querySelector(selectors.periodEnd).textContent = end
    ? `по ${formatDate(end)}`
    : `...`;

  return $period;
}

export function renderPeriodsList(periods) {
  const $periodsList = getElement(IDS.periods.list);
  $periodsList.innerHTML = "";

  periods.forEach((period, i) => {
    const $period = renderPeriod(period, periods[i + 1]);
    $periodsList.appendChild($period);
  });
}

export function addPeriodToList(period) {
  const $periodsList = getElement(IDS.periods.list);
  const $period = renderPeriod(period);
  $periodsList.appendChild($period);
}

export function removePeriodFromList(periodId) {
  const $element = document.querySelector(`[data-period-id="${periodId}"]`);
  $element.remove();
}

export function initPeriodsList(config) {
  const { onStart, onRemove, onSelect } = config;

  const $toggleButton = getElement(IDS.periods.toggleButton);
  const $periodsSidebar = getElement(IDS.periods.aside);
  const $periodsList = getElement(IDS.periods.list);
  const $startButton = getElement(IDS.periods.startButton);

  $toggleButton.addEventListener("click", () => {
    if ($periodsSidebar.hasAttribute("data-open")) {
      $periodsSidebar.removeAttribute("data-open");
    } else {
      $periodsSidebar.setAttribute("data-open", "true");
    }
  });

  $periodsList.addEventListener("click", (e) => {
    const $removeButton = e.target.closest(selectors.periodRemove);
    if ($removeButton) {
      const $period = e.target.closest(selectors.period);
      onRemove(Number($period.dataset.periodId));
      return;
    }

    const $period = e.target.closest(selectors.period);
    if ($period) {
      onSelect(Number($period.dataset.periodId));
    }
  });

  $startButton.addEventListener("click", onStart);
}

export function highlightActivePeriod(period) {

}