import Dexie from "dexie";

export const db = new Dexie("Atlas");

// Stop thinking like fly...
db.version(1).stores({
  
});
