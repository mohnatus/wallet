import { notifyError } from "../utils/notifier";
import {
  DB_NAME,
  DB_VERSION,
  ITEMS_STORE_NAME,
  PERIODS_STORE_NAME,
  TAGS_STORE_NAME,
} from "./constants";
import { setDb } from "./db";
import { getStore } from "./utils";

function getItems() {
  return new Promise((resolve) => {
    const items = getStore(ITEMS_STORE_NAME);
    const request = items.getAll();
    request.onsuccess = function () {
      const result = request.result;
      resolve(result);
    };
  });
}

async function getTags() {
  return new Promise((resolve) => {
    const tags = getStore(TAGS_STORE_NAME);
    const request = tags.getAll();
    request.onsuccess = function () {
      const result = request.result;
      resolve(result);
    };
  });
}

async function getPeriods() {
  return new Promise((resolve) => {
    const periods = getStore(PERIODS_STORE_NAME);
    const request = periods.getAll();
    request.onsuccess = function () {
      const result = request.result;
      resolve(result);
    };
  });
}

export async function initDB() {
  return new Promise((resolve) => {
    const dbRequest = indexedDB.open(DB_NAME, DB_VERSION);
    dbRequest.onupgradeneeded = function () {
      let db = dbRequest.result;
      if (!db.objectStoreNames.contains(ITEMS_STORE_NAME)) {
        db.createObjectStore(ITEMS_STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(TAGS_STORE_NAME)) {
        db.createObjectStore(TAGS_STORE_NAME, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(PERIODS_STORE_NAME)) {
        db.createObjectStore(PERIODS_STORE_NAME, { keyPath: "id" });
      }
    };
    dbRequest.onerror = function () {
      notifyError("DB ERROR", dbRequest.error);
    };
    dbRequest.onsuccess = function () {
      Promise.all([getTags(), getItems(), getPeriods()]).then(
        ([tags, items, periods]) => {
          resolve({ tags, items, periods });
        }
      );
    };
    setDb(dbRequest);
  });
}
