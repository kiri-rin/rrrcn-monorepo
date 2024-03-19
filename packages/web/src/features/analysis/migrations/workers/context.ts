import { createContext, useContext, useEffect, useState } from "react";
import WebworkerPromise from "webworker-promise";
import PromiseWorker from "webworker-promise";
export const IndexTracksWorkerContext = createContext<{
  worker: Worker | undefined;
}>({ worker: undefined });
export const VulnerabilityWorkerContext = createContext<{
  worker: PromiseWorker | undefined;
}>({ worker: undefined });
export const useIndexTracksWorker = () => {
  const [worker, setWorker] = useState<Worker | undefined>();
  useEffect(() => {
    setWorker(new Worker(new URL("./index_tracks/index.ts", import.meta.url)));
  }, []);
  return worker;
};
export const useParseKMLWorker = () => {
  const [worker, setWorker] = useState<Worker | null>(null);
  useEffect(() => {
    setWorker(new Worker(new URL("./parse_kml/index.ts", import.meta.url)));
  }, []);
  return worker;
};

export const useProcessVulnerabilityWorker = () => {
  const [worker, setWorker] = useState<PromiseWorker | undefined>();
  useEffect(() => {
    setWorker(
      new WebworkerPromise(
        new Worker(new URL("./parse_kml/index.ts", import.meta.url))
      )
    );
  }, []);
  return worker;
};
export const useProcessVulnerabilityWorkerContext = () => {
  return useContext(VulnerabilityWorkerContext);
};
