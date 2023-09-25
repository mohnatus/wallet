import { getState } from "./state";

export function selectPeriods() {
  return getState().periods;
}

export function selectPeriodById(periodId) {
  const periods = selectPeriods();
  return periods.find((p) => p.id === periodId);
}

export function selectActivePeriod() {
  return getState().activePeriod;
}
