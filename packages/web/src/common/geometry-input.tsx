import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GeometriesImportConfig } from "@rrrcn/services/dist/src/analytics_config_types";
import { Button, Input, Select, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useEffectNoOnMount } from "../utils/hooks";
import { MapDrawingContext, MapDrawingShape } from "./map/MapEdit";
import {
  pointsToGeojson,
  polygonsToGeojson,
} from "../utils/map/map-geojson-utils";
import { useTranslations } from "../utils/translations";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
type InputModesType = "csv" | "geojson" | "geojson_file" | "shp";

const inputModes: InputModesType[] = [
  "csv",
  "geojson",
  // "geojson_file",
  "shp",
];
const typeTitles: any = {
  geojson: "map",
};
const inputTypesPlaceholders = {
  csv: "Загруззите csv файл",
  shp: "Загруззите shp файл",
  asset: "Загруззите shp файл",
  geojson: "",
  map: "Выберите точки на карте",
};
export type GeometryInputConfig = GeometriesImportConfig<File | undefined>;
export const GeometryInput = ({
  value: geometryConfig = {
    type: "csv",
    path: undefined,
  },
  error,
  onChange: setGeometryConfig = () => {},
  available = inputModes,
  type = "marker" as google.maps.drawing.OverlayType.MARKER,
}: {
  value?: GeometryInputConfig;
  available?: InputModesType[];
  onChange?: (config: GeometryInputConfig) => any;
  type?: google.maps.drawing.OverlayType;
  error?: boolean;
}) => {
  return (
    <>
      <div className={(error && "common__error-container") || ""}>
        {geometryConfig?.type !== "geojson" ? (
          <Input
            inputProps={{
              accept:
                geometryConfig?.type === "shp" ? "application/zip" : "text/csv",
            }}
            size={"small"}
            type={"file"}
            onChange={({
              target: { files, form },
            }: React.ChangeEvent<HTMLInputElement>) => {
              const prev = geometryConfig;
              setGeometryConfig?.(
                prev.type !== "computedObject" &&
                  prev.type !== "asset" &&
                  files?.[0]
                  ? { ...prev, path: files?.[0] }
                  : prev
              );
            }}
          />
        ) : (
          <MapGeometryInput
            type={type}
            onSave={(json) => {
              setGeometryConfig({
                type: "geojson",
                json,
              } as GeometryInputConfig);
            }}
          />
        )}
        <Select
          size={"small"}
          onChange={(it) =>
            setGeometryConfig({
              type: it.target.value as GeometryInputConfig["type"],
              path: it.target.value === "asset" ? "" : undefined,
            } as GeometryInputConfig)
          }
          value={geometryConfig.type}
        >
          {available.map((it) => (
            <MenuItem key={it} value={it}>
              {typeTitles[it] || it}
            </MenuItem>
          ))}
        </Select>
      </div>
      {geometryConfig.type === "csv" && (
        <>
          <TextField
            sx={{ marginTop: "2px" }}
            size={"small"}
            label={"latitude_key"}
            onChange={({ target: { value } }) => {
              setGeometryConfig({ ...geometryConfig, latitude_key: value });
            }}
            value={geometryConfig.latitude_key}
          />
          <TextField
            sx={{ marginTop: "2px" }}
            size={"small"}
            label={"longitude_key"}
            onChange={({ target: { value } }) => {
              setGeometryConfig({ ...geometryConfig, longitude_key: value });
            }}
            value={geometryConfig.longitude_key}
          />
          <TextField
            sx={{ marginTop: "2px" }}
            size={"small"}
            label={"id_key"}
            onChange={({ target: { value } }) => {
              setGeometryConfig({ ...geometryConfig, id_key: value });
            }}
            value={geometryConfig.id_key}
          />
        </>
      )}
    </>
  );
};
export const MapGeometryInput = ({
  type = google.maps.drawing.OverlayType.MARKER,
  onSave,
}: {
  type?: google.maps.drawing.OverlayType;
  onSave: (json?: GeoJSON.FeatureCollection) => any;
}) => {
  const { onShapeReady, drawing, setDrawing, setOnShapeReady, map } =
    useContext(MapDrawingContext);
  const [show, setShow] = useState(true);
  const [edit, setEdit] = useState(true);
  const mapShapesRef = useRef<MapDrawingShape["shape"][]>([]);
  const strings = useTranslations();

  useEffect(() => {
    if (edit) {
      const _onShapeReady = (shape: MapDrawingShape) => {
        if (shape.type === type) {
          mapShapesRef.current.push(shape.shape);
        }
      };
      setOnShapeReady(() => _onShapeReady);
    }
    setDrawing(edit ? type : false);
  }, [edit]);
  useEffect(() => {
    if (show) {
      mapShapesRef.current.forEach((shape) => shape.setMap(map || null));
    } else {
      mapShapesRef.current.forEach((shape) => shape.setMap(null));
    }
  }, [show]);
  useEffect(() => {
    return () => {
      mapShapesRef.current.forEach((shape) => shape.setMap(null));
      setDrawing(false);
    };
  }, []);
  return (
    <>
      <>
        <Typography>
          {mapShapesRef.current.length}{" "}
          {strings["common.objects-plural"](mapShapesRef.current.length)}
        </Typography>
        {edit ? (
          <>
            <Typography>{strings["geometry.input-at-map"]}</Typography>
            <Button
              onClick={() => {
                mapShapesRef.current.forEach((shape) => shape.setMap(null));
                mapShapesRef.current = [];
              }}
            >
              {strings["common.clear"]}
            </Button>
            <Button
              onClick={() => {
                setEdit(false);
                switch (type) {
                  case google.maps.drawing.OverlayType.MARKER: {
                    onSave(
                      mapShapesRef.current.length
                        ? pointsToGeojson(
                            mapShapesRef.current as google.maps.Marker[]
                          )
                        : undefined
                    );
                    break;
                  }
                  case google.maps.drawing.OverlayType.POLYGON: {
                    onSave(
                      mapShapesRef.current.length
                        ? polygonsToGeojson(
                            mapShapesRef.current as google.maps.Polygon[]
                          )
                        : undefined
                    );
                  }
                }
              }}
            >
              {strings["common.save"]}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                //@ts-ignore

                setEdit(true);
              }}
            >
              {strings["common.edit"]}
            </Button>
            <Button
              onClick={() => {
                setShow(!show);
              }}
            >
              {show ? strings["common.hide"] : strings["common.show"]}
            </Button>
          </>
        )}
      </>
    </>
  );
};
