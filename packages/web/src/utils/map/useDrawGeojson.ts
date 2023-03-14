import { useContext, useEffect, useRef } from "react";
import { MapDrawingContext } from "../../common/map/MapEdit";
import { Geojson } from "@rrrcn/services/dist/src/types";
import { GeoJSON } from "geojson";

export const useDrawGeojson = (geojson: GeoJSON, deps: any[]) => {
  const { drawingManager } = useContext(MapDrawingContext);
  const mapObjectsRef = useRef<any[]>([]);
  useEffect(() => {}, deps);
};
