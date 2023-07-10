import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  Button,
  Input,
  Typography,
} from "@mui/material";
import { kml } from "@tmcw/togeojson";
import {
  GoogleMapObject,
  parseGeojson,
  useDrawGeojson,
} from "../../utils/geometry/map/useDrawGeojson";
import { GeoJSON } from "geojson";
import { Migration } from "./types";
import { MapDrawingContext } from "../../common/map/MapEdit";
import { BirdMigrationInfo } from "./components/BirdMigrationInfo";
import { parse } from "date-fns";
const DATE_PROP = "name";
const DATE_FORMAT = "yyyy-MM-dd hh:mm:ss";
type MigrationMapObjects = {
  mapObjects: GoogleMapObject[];
};
export type IndexedMigration = Migration & MigrationMapObjects;
export const MigrationsForm = () => {
  const [migrations, setMigrations] = useState<
    IndexedMigration[] | undefined
  >();
  const { map } = useContext(MapDrawingContext);
  const [currentEdit, setCurrentEdit] = useState<number | null>(null);
  const showMapObjects = (shapes: GoogleMapObject[]) => {
    shapes.forEach((shape) => shape.setMap(map || null));
  };
  const hideMapObjects = (shapes: GoogleMapObject[]) => {
    shapes.forEach((shape) => shape.setMap(null));
  };

  return (
    <>
      <Input
        inputProps={{ multiple: true }}
        size={"small"}
        type={"file"}
        onChange={onFilesChange(setMigrations)} // TODO add show/hide button
      />
      {migrations?.map((migr, index) => (
        <BirdMigrationInfo
          setIsEdit={(edit) => {
            setCurrentEdit((curEdit) => {
              if (curEdit === index && !edit) {
                return null;
              } else {
                return index;
              }
            });
          }}
          migration={migr}
          isEdit={currentEdit === index}
          showOnMap={showMapObjects}
          hideOnMap={hideMapObjects}
          onEditEnd={(result) => {
            setMigrations((prev) => {
              if (!prev) {
                prev = [];
              }
              prev[index] = result;
              return prev;
            });
          }}
        />
      ))}
    </>
  );
};
const onFilesChange =
  (onParseEnd: (res: (Migration & MigrationMapObjects)[]) => any) =>
  ({ target: { files, form } }: React.ChangeEvent<HTMLInputElement>) => {
    const res: IndexedMigration[] = [];
    Array.from(files || []).forEach((file) => {
      setTimeout(async () => {
        const text = await file.text();
        const geojson = kml(
          new DOMParser().parseFromString(text, "text/xml")
        ) as GeoJSON.FeatureCollection;
        geojson.features = geojson.features
          .reduce((acc, it) => {
            if (it.geometry.type === "Point") {
              acc.push({
                ...it,
                properties: {
                  date: parse(
                    it.properties?.[DATE_PROP] || "",
                    DATE_FORMAT,
                    new Date()
                  ),
                },
              });
            }
            return acc;
          }, [] as GeoJSON.Feature<GeoJSON.Geometry, { date: Date }>[])
          .sort((a, b) => (a.properties.date < b.properties.date ? 1 : -1));
        res.push({
          geojson: geojson as IndexedMigration["geojson"],
          title: file.name,
          years: [],
          mapObjects: parseGeojson(geojson).map((it, index) => {
            it.set("title", geojson.features[index].properties?.date);
            return it;
          }),
        });
        if (res.length === files?.length) {
          onParseEnd(res);
        }
      }, 0);
    });
  };
