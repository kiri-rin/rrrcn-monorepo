import { IndexedMigration } from "./migrations";
import { Migration } from "./types";

export const parseMigrationsKml = async (
  worker: Worker,
  files: FileList | null
): Promise<Partial<IndexedMigration>[]> => {
  return new Promise((resolve) => {
    const id = Math.random();
    worker.postMessage({
      type: "parse",
      id,
      files,
    });
    worker.onmessage = (message) => {
      if (message.data.id === id) {
        resolve(message.data.result);
      }
    };
  });
};
export const indexTracksWithWorker = async (
  worker: Worker | undefined,
  migration: Migration
): Promise<Migration | undefined> => {
  if (!worker) {
    return Promise.resolve(undefined);
  }
  return new Promise((resolve) => {
    const id = Math.random();
    worker.postMessage({
      type: "index_track",
      id,
      migration: migration,
    });
    worker.onmessage = (message) => {
      if (message.data.id === id) {
        const res: Migration = message.data.result;
        resolve(res);
      }
    };
  });
};
