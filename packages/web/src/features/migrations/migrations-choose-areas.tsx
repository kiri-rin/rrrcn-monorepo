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
import { Migration, SEASONS } from "./types";
import { MapDrawingContext } from "../../common/map/MapEdit";
import { MigrationInfo } from "./components/migration-info";
import { parse } from "date-fns";
import { parseMigrationsKml } from "./utils";
import { ParamsImageInput } from "../../common/params-image-input";
import { useQuery } from "react-query";

type MigrationMapObjects = {
  mapObjects: GoogleMapObject[];
};
export type IndexedMigration = Migration & MigrationMapObjects;
export const MigrationsChooseAreas = () => {
  const { data: migrationSplitAreaState } = useQuery(
    "migration-split-area",
    () => {},
    { enabled: false }
  );
  const mapObjectsRef = useRef<GoogleMapObject[]>([]);
  const { showMapObjects, hideMapObjects } = useContext(MapDrawingContext);
  useEffect(() => {
    if (migrationSplitAreaState) {
      console.log(migrationSplitAreaState);
      mapObjectsRef.current = parseGeojson(
        migrationSplitAreaState as unknown as GeoJSON
      );
    }
    showMapObjects(mapObjectsRef.current);
    return () => {
      hideMapObjects(mapObjectsRef.current);
    };
  }, [migrationSplitAreaState]);
  return <ParamsImageInput name={"params"} />;
};
