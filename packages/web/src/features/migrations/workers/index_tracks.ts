import { kml } from "@tmcw/togeojson";
import { GeoJSON } from "geojson";
import { parse } from "date-fns";
import { IndexedMigration } from "../migrations";
import "@react-google-maps/api";
const DATE_PROP = "name";
const DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
const DOMParser = require("xmldom").DOMParser;
export type WorkerMessage =
  | {
      type: "init";
      parser: DOMParser;
    }
  | {
      type: "parse";
      files: File[];
      id: string;
    };
/* eslint-disable-next-line no-restricted-globals */
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  switch (e.data.type) {
    case "init": {
      break;
    }
    case "parse": {
      const res: any[] = [];

      Array.from(e.data.files || []).forEach(async (file) => {
        const text = await file.text();
        const geojson = kml(
          new DOMParser().parseFromString(text, "text/xml")
        ) as GeoJSON.FeatureCollection;
        geojson.features = geojson.features.reduce((acc, it) => {
          if (it.geometry.type === "Point") {
            acc.push({
              ...it,
              properties: {
                ...it.properties,
                date: parse(
                  it.properties?.[DATE_PROP] || "",
                  DATE_FORMAT,
                  new Date()
                ),
              },
            });
          }
          return acc;
        }, [] as GeoJSON.Feature<GeoJSON.Geometry, { date: Date }>[]);
        geojson.features = [...geojson.features].sort((a, b) =>
          a.properties?.date > b.properties?.date ? 1 : -1
        );
        res.push({
          geojson: geojson as IndexedMigration["geojson"],
          title: file.name,
          years: [],
        }); //@ts-ignore
        if (res.length === e.data.files?.length) {
          //@ts-ignore eslint-disable-next-line no-restricted-globals
          /* eslint-disable-next-line no-restricted-globals */ /*@ts-ignore*/
          self.postMessage({ result: res, id: e.data.id });
        }
      });
    }
  }
};
export {};
