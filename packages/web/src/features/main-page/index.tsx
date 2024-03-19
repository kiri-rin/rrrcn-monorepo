import React, { useCallback, useState } from "react";

import "../analysis/classifications/random-forest/data-extraction.scss";
import { MainPageLeftPanel } from "./left-panel";
import {
  MapDrawingContext,
  MapDrawingShape,
  MapEdit,
} from "@/components/map/map-edit";
import { GoogleMapObject } from "../../utils/geometry/map/useDrawGeojson";

export const MainPage = () => {
  const [drawing, setDrawing] = useState<
    boolean | google.maps.drawing.OverlayType
  >(false);
  const [drawingManager, setDrawingManager] =
    useState<google.maps.drawing.DrawingManager>();
  const [map, setMap] = useState<google.maps.Map>();
  const [onShapeReady, setOnShapeReady] = useState(
    useCallback(() => (shape: MapDrawingShape) => {}, [])
  );
  const showMapObjects = useCallback(
    (shapes: GoogleMapObject[]) => {
      shapes.forEach((shape) => shape.setMap(map || null));
    },
    [map]
  );
  const hideMapObjects = useCallback(
    (shapes: GoogleMapObject[]) => {
      shapes.forEach((shape) => shape.setMap(null));
    },
    [map]
  );
  return (
    <MapDrawingContext.Provider
      value={{
        drawing,
        setDrawing,
        onShapeReady,
        setOnShapeReady,
        drawingManager,
        setDrawingManager,
        map,
        setMap,
        showMapObjects,
        hideMapObjects,
      }}
    >
      <div>
        <MainPageLeftPanel />
        <MapEdit />
        <div id={"main-page-right-panel"} />
      </div>
    </MapDrawingContext.Provider>
  );
};
