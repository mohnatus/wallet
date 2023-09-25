import { getStore } from ".";
import { notify, notifyError } from "../utils/notifier";
import { PERIODS_STORE_NAME } from "./constants";

export function addPeriodToDb(period) {
  const periods = getStore(PERIODS_STORE_NAME, true);
  let request = periods.add(period);
  request.onsuccess = function () {
    notify("Запись успешно сохранена");
  };
  request.onerror = function () {
    notifyError("Не удалось сохранить запись", request.error);
  };
}

export function removePeriodFromDb(period) {
  let periods = getStore(PERIODS_STORE_NAME, true);
  let request = periods.delete(period.id);
  request.onsuccess = function () {
    notify("Запись успешно удалена");
  };
  request.onerror = function () {
    notifyError("Не удалось удалить запись", request.error);
  };
}
