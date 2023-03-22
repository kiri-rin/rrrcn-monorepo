import {
  DrawingManager,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import React, { createContext, useCallback, useEffect, useState } from "react";

import Drawer from "@mui/material/Drawer";
import { BASE_PATH } from "../../api/constants";
import { Offset } from "../../App";
import "./left-panel/data-extraction.scss";
import { useEventSource } from "../../utils/hooks";
import { MainPageLeftPanel } from "./left-panel";
import {
  MapDrawingContext,
  MapDrawingShape,
  MapEdit,
} from "../../common/map/MapEdit";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "../../api";
import { AnalysisRightPanel } from "./right-panel";

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
