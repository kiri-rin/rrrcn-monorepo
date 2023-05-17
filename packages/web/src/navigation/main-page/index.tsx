import React, { useCallback, useState } from "react";

import "../../features/random-forest/data-extraction.scss";
import { MainPageLeftPanel } from "../../navigation/main-page/left-panel";
import {
  MapDrawingContext,
  MapDrawingShape,
  MapEdit,
} from "../../common/map/MapEdit";
import { AnalysisRightPanel } from "../../navigation/main-page/right-panel";

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
      }}
    >
      <div>
        <MainPageLeftPanel />
        <MapEdit />
        <AnalysisRightPanel />
      </div>
    </MapDrawingContext.Provider>
  );
};
