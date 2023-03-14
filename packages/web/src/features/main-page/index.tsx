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
import { useMutation, useQuery } from "react-query";
import { api } from "../../api";

export const MainPage = () => {
  const { data: dataExtractionState } = useQuery(
    "data-extraction-result",
    api.eeData.postApiEeDataExtract,
    { enabled: false }
  );
  const { data: scriptsList } = useQuery(
    "data-extraction-scripts",
    (opt) => api.eeData.getApiEeDataScripts(),
    { refetchOnWindowFocus: false }
  );
  console.log({ dataExtractionState });

  const resultId = dataExtractionState?.data;
  const { message, id: messageId } = useEventSource(
    // TODO maybe better to handle messages on low level? like dom
    `${BASE_PATH}/api/result/loading/${resultId}`,
    [dataExtractionState]
  );
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
        <Drawer variant="permanent" anchor="right">
          <Offset />

          <div style={{ width: 200 }}>{message}</div>
          {messageId === "success" && (
            <a>{`${BASE_PATH}/api/result/download/${resultId}`}</a>
          )}
        </Drawer>
      </div>
    </MapDrawingContext.Provider>
  );
};
