import {
  DrawingManager,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import { Libraries } from "@react-google-maps/api/dist/utils/make-load-script-url";

const center = {
  lat: -3.745,
  lng: -38.523,
};
const styles = { width: "100%", height: 700 };
const libraries: Libraries = ["drawing", "geometry"];
const polygons: any[] = [];
export const MapDrawingContext = createContext<{
  onShapeReady: (shape: MapDrawingShape) => any;
  setOnShapeReady: Dispatch<SetStateAction<(shape: MapDrawingShape) => any>>;
  drawing: boolean | google.maps.drawing.OverlayType;
  setDrawing: Dispatch<
    SetStateAction<boolean | google.maps.drawing.OverlayType>
  >;
  map?: google.maps.Map;
  setMap: Dispatch<SetStateAction<google.maps.Map | undefined>>;
  drawingManager?: google.maps.drawing.DrawingManager;

  setDrawingManager: Dispatch<
    SetStateAction<google.maps.drawing.DrawingManager | undefined>
  >;
}>({
  onShapeReady: (shape: MapDrawingShape) => {},
  setOnShapeReady: () => {},
  drawing: false,
  setDrawing: () => {},
  setMap: () => {},
  setDrawingManager: () => {},
});
type ShapeKeys = "overlay" | "circle" | "marker" | "polygon" | "rectangle";
export type MapDrawingShape =
  // | { type: "overlay"; shape: google.maps.drawing.OverlayCompleteEvent["overlay"] }
  | { type: "circle"; shape: google.maps.Circle }
  | { type: "marker"; shape: google.maps.Marker }
  | { type: "polygon"; shape: google.maps.Polygon }
  | { type: "rectangle"; shape: google.maps.Rectangle };

export const MapEdit = () => {
  const {
    onShapeReady,
    setOnShapeReady,
    setDrawingManager,
    drawing,
    setDrawing,
    setMap,
  } = useContext(MapDrawingContext);

  const _onShapeReady = useCallback(
    (shapeKey: MapDrawingShape["type"]) =>
      (shape: MapDrawingShape["shape"]) => {
        console.log(onShapeReady);
        onShapeReady({ type: shapeKey, shape } as MapDrawingShape);
      },
    [onShapeReady]
  );
  return (
    <LoadScript
      libraries={libraries}
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY || ""}
    >
      <GoogleMap
        onLoad={(map) => {
          setMap(map);
        }}
        center={center}
        zoom={10}
        mapContainerStyle={styles}
      >
        {drawing && (
          <DrawingManager
            onLoad={(dw) => setDrawingManager(dw)}
            drawingMode={drawing === true ? undefined : drawing}
            // onOverlayComplete={_onShapeReady("overlay")}
            onCircleComplete={_onShapeReady("circle")}
            onMarkerComplete={_onShapeReady("marker")}
            onPolygonComplete={_onShapeReady("polygon")}
            onRectangleComplete={_onShapeReady("rectangle")}
          />
        )}

        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};
