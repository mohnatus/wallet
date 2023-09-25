let dbRequest;

export function setDb(db) {
  dbRequest = db;
}

export function getDb() {
  return dbRequest.result;
}
