import { IndexedMigration } from "../migrations";
import { Migration } from "../types";
import { WorkerMessage } from "../workers/parse_kml/types";
import { useCallback, useEffect, useRef } from "react";
export const SetTimeoutPromise = (timeout: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
    }, timeout);
  });
export const useParseMigrationsKml = (worker: Worker | null) => {
  const messageErrorRef = useRef<MessageEvent[]>([]);
  const successRef = useRef<MessageEvent[]>([]);

  useEffect(() => {
    function messageErrorListener(e: MessageEvent) {
      messageErrorRef.current.push(e);
    }
    function errorListener(e: ErrorEvent) {
      console.log(e);
    }
    function listener(message: MessageEvent) {
      successRef.current.push(message);
    }
    if (worker) {
      worker?.addEventListener("message", listener);
      worker?.addEventListener("messageerror", messageErrorListener);
      worker?.addEventListener("error", errorListener);
      return () => {
        worker?.removeEventListener("message", listener);
        worker?.removeEventListener("messageerror", messageErrorListener);
        worker?.removeEventListener("error", errorListener);
      };
    }
  }, [worker]);
  const parseMigrationsKml = useCallback(
    async (arg: WorkerMessage) => {
      if (!worker) {
        return Promise.reject("Worker is null");
      }
      worker.postMessage(arg);
      let success = successRef.current.find((it) => it.data.id === arg.id);
      let error = messageErrorRef.current.find((it) => it.data.id === arg.id);
      while (!success && !error) {
        await SetTimeoutPromise(0);
        success = successRef.current.find((it) => it.data.id === arg.id);
        error = messageErrorRef.current.find((it) => it.data.id === arg.id);
      }
      if (error) {
        return Promise.reject(error);
      }
      if (success) {
        return success.data.result;
      }
    },
    [successRef, worker, messageErrorRef]
  );
  return parseMigrationsKml;
};
export const parseMigrationsKml = (
  args: WorkerMessage,
  worker: Worker | null
): Promise<Migration | null> => {
  if (!worker) {
    return Promise.resolve(null);
  }
  return new Promise((resolve, reject) => {
    function messageErrorListener(e: MessageEvent) {
      reject(e);
      worker?.removeEventListener("message", listener);
      worker?.removeEventListener("messageerror", messageErrorListener);
      worker?.removeEventListener("error", errorListener);
    }
    function errorListener(e: ErrorEvent) {
      reject(e);
      worker?.removeEventListener("message", listener);
      worker?.removeEventListener("messageerror", messageErrorListener);
      worker?.removeEventListener("error", errorListener);
    }
    function listener(message: MessageEvent) {
      if (message.data.id === args.id) {
        console.log(message.data.id, "finished");
        resolve(message.data.result);
      }
      worker?.removeEventListener("message", listener);
      worker?.removeEventListener("messageerror", messageErrorListener);
      worker?.removeEventListener("error", errorListener);
    }

    worker.addEventListener("message", listener);
    worker.addEventListener("messageerror", messageErrorListener);
    worker.addEventListener("error", errorListener);
    worker.postMessage(args);
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
