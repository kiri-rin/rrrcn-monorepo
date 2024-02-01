import type { ParseTrackerXML } from "./types";
import { kml } from "@tmcw/togeojson";
import { Feature, GeoJSON } from "geojson";
import { parse, parseISO } from "date-fns";
import { parseHTMLTable } from "./utils";
import { Migration, MigrationPointProperties } from "../../types";
import { SetTimeoutPromise } from "../../utils/parser-utils";
const DATE_PROP = "timestamp";
const DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

export const parseOrnitellaKML: ParseTrackerXML = async (file, DOMParser) => {
  const text = await file.text();
  const geojson = kml(
    DOMParser.parseFromString(text, "text/xml")
  ) as GeoJSON.FeatureCollection;
  let features: Migration["geojson"]["features"] = [];
  let index = 0;
  for (let it of geojson.features) {
    index++;
    if (index % 100 === 0) {
      await SetTimeoutPromise(0);
    }
    if (it.geometry.type === "Point") {
      features.push({
        ...it,
        properties: {
          ...it.properties,
          altitude: parseInt(
            (
              parseHTMLTable(
                DOMParser.parseFromString(
                  it.properties?.description?.value || "<div></div>",
                  "text/html"
                )
              ).find((it) => it?.[0]?.includes("Altitude"))?.[1] || "0"
            ).replace(/\D/g, "")
          ),
          date: parseISO(it.properties?.[DATE_PROP] || ""),
        },
      } as Feature<GeoJSON.Point, MigrationPointProperties>);
    }
  }
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
