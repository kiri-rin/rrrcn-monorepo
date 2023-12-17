import { IndexedMigration } from "../../migrations";
import "@react-google-maps/api";
import { Feature, Point } from "geojson";
import { indexTracksByDate } from "./by-date";
import { Migration } from "../../types";
import { indexTracksByDailyDistances } from "./by-daily-distances";
export type WorkerMessage = {
  type: "index_track";
  migration: Migration;
  id: string;
};
/* eslint-disable-next-line no-restricted-globals */
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  console.log(e);
  //@ts-ignore eslint-disable-next-line no-restricted-globals
  /* eslint-disable-next-line no-restricted-globals */ /*@ts-ignore*/
  self.postMessage({ result: e.type });

  switch (e.data.type) {
    case "index_track": {
      const years = indexTracksByDailyDistances(e.data.migration);
      const res = { ...e.data.migration, years };
      //@ts-ignore

      //@ts-ignore eslint-disable-next-line no-restricted-globals
      /* eslint-disable-next-line no-restricted-globals */ /*@ts-ignore*/
      self.postMessage({ result: res, id: e.data.id });
    }
  }
};
export {};
