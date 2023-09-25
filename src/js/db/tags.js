import { getStore } from ".";
import { notify, notifyError } from "../utils/notifier";
import { TAGS_STORE_NAME } from "./constants";

export function addTagToDb(tag) {
  let tags = getStore(TAGS_STORE_NAME, true);
  let request = tags.add(tag);
  request.onsuccess = function () {
    notify("Запись успешно сохранена");
  };
  request.onerror = function () {
    notifyError("Не удалось сохранить запись", request.error);
  };
}

export function removeTagFromDb(tag) {
  let tags = getStore(TAGS_STORE_NAME, true);
  let request = tags.delete(tag.id);
  request.onsuccess = function () {
    notify("Запись успешно удалена");
  };
  request.onerror = function () {
    notifyError("Не удалось удалить запись", request.error);
  };
}
