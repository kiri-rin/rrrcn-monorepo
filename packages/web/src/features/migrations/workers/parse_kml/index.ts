import { kml } from "@tmcw/togeojson";
import { GeoJSON } from "geojson";
import { parse } from "date-fns";
import { IndexedMigration } from "../../migrations";
import "@react-google-maps/api";
import { WorkerMessage } from "./types";
import { parseHTMLTable } from "./utils";
const DATE_PROP = "timestamp";
const DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
const DOMParser = new (require("xmldom").DOMParser)();

/* eslint-disable-next-line no-restricted-globals */
self.onmessage = (e: MessageEvent<WorkerMessage>) => {
  switch (e.data.type) {
    case "parse": {
      const res: any[] = [];

      Array.from(e.data.files || []).forEach(async (file) => {
        const text = await file.text();
        const geojson = kml(
          DOMParser.parseFromString(text, "text/xml")
        ) as GeoJSON.FeatureCollection;
        geojson.features = geojson.features.reduce((acc, it) => {
          if (it.geometry.type === "Point") {
            acc.push({
              ...it,
              properties: {
                ...it.properties,
                elevation: parseInt(
                  (
                    parseHTMLTable(
                      DOMParser.parseFromString(
                        it.properties?.description?.value || "<div></div>",
                        "text/html"
                      )
                    ).find((it) => it?.[0]?.includes("Altitude"))?.[1] || "0"
                  ).replace(/\D/g, "")
                ), //@ts-ignore
                date: parse(
                  it.properties?.[DATE_PROP] || "",
                  DATE_FORMAT,
                  new Date()
                ),
              },
            });
          }
          return acc;
        }, [] as GeoJSON.Feature<GeoJSON.Geometry, { date: Date; elevation?: number }>[]);
        geojson.features = [...geojson.features].sort((a, b) =>
          a.properties?.date > b.properties?.date ? 1 : -1
        );
        geojson.features = geojson.features.map((it, index) => ({
          ...it,
          properties: { ...it.properties, index },
        }));
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
