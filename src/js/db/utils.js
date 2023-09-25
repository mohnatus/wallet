import { getDb } from "./db";

export function getStore(storeName, toWrite) {
  let db = getDb();

  let transaction = db.transaction(
    storeName,
    toWrite ? "readwrite" : "readonly"
  );
  let store = transaction.objectStore(storeName);
  return store;
}
