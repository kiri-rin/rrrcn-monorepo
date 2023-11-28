import type { ParseTrackerXML } from "./types";
import { kml } from "@tmcw/togeojson";
import { Feature, GeoJSON } from "geojson";
import { parse } from "date-fns";
import { parseHTMLTable } from "./utils";
import {
  Migration,
  MigrationPointProperties,
  MigrationYear,
} from "../../types";
const DATE_PROP = "timestamp";
const DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
export const parseAquilaKML: ParseTrackerXML = async (file, DOMParser) => {
  const text = await file.text();
  const geojson = kml(
    DOMParser.parseFromString(text, "text/xml")
  ) as GeoJSON.FeatureCollection;
  let features: Migration["geojson"]["features"] = geojson.features.reduce(
    (acc, it) => {
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
            ),
            date: parse(
              it.properties?.[DATE_PROP] || "",
              DATE_FORMAT,
              new Date()
            ),
          },
        } as Feature<GeoJSON.Point, MigrationPointProperties>);
      }
      return acc;
    },
    [] as GeoJSON.Feature<GeoJSON.Point, { date: Date; elevation?: number }>[]
  );
  features = [...features].sort((a, b) =>
    a.properties?.date > b.properties?.date ? 1 : -1
  );
  features = features.map((it, index) => ({
    ...it,
    properties: { ...it.properties, index },
  }));
  const res: Migration["geojson"] = {
    features,
    type: geojson.type,
    bbox: geojson.bbox,
  };
  return {
    geojson: res,
    years: {} as Migration["years"],
    title: file.name,
  };
};
