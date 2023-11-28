import { createContext, useEffect, useState } from "react";

export const IndexTracksWorkerContext = createContext<{
  worker: Worker | undefined;
}>({ worker: undefined });
export const useIndexTracksWorker = () => {
  const [worker, setWorker] = useState<Worker | undefined>();
  useEffect(() => {
    setWorker(new Worker(new URL("./index_tracks.ts", import.meta.url)));
  }, []);
  return worker;
};
export const useParseKMLWorker = () => {
  const [worker, setWorker] = useState<Worker | undefined>();
  useEffect(() => {
    setWorker(new Worker(new URL("./parse_kml.ts", import.meta.url)));
  }, []);
  return worker;
};
