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
type InputModesType = "csv" | "geojson" | "geojson_file" | "shp";

const inputModes: InputModesType[] = ["csv", "geojson", "geojson_file", "shp"];
const inputTypesPlaceholders = {
  csv: "Загруззите csv файл",
  shp: "Загруззите shp файл",
  asset: "Загруззите shp файл",
  geojson: "",
  map: "Выберите точки на карте",
};
export type GeometryInputConfig = GeometriesImportConfig<File | undefined>;
export const GeometryInput = ({
  value,
  onChange,
  available = inputModes,
  type = "marker" as google.maps.drawing.OverlayType.MARKER,
}: {
  value?: GeometryInputConfig;
  available?: InputModesType[];
  onChange?: (config: GeometryInputConfig) => any;
  type?: google.maps.drawing.OverlayType;
}) => {
  const [geometryConfig, setGeometryConfig] = useState<GeometryInputConfig>(
    value || {
      type: "csv",
      path: undefined,
    }
  );
  useEffectNoOnMount(() => {
    onChange?.(geometryConfig);
  }, [geometryConfig]);
  useEffectNoOnMount(() => {
    value && setGeometryConfig(value);
  }, [value]);

  return (
    <>
      <div>
        {geometryConfig.type !== "geojson" ? (
          <Input
            size={"small"}
            type={"file"}
            onChange={({
              target: { files, form },
            }: React.ChangeEvent<HTMLInputElement>) =>
              setGeometryConfig((prev) =>
                prev.type !== "computedObject" &&
                prev.type !== "asset" &&
                files?.[0]
                  ? { ...prev, path: files?.[0] }
                  : prev
              )
            }
          />
        ) : (
          <MapGeometryInput
            type={type}
            onSave={(json) => {
              setGeometryConfig({ type: "geojson", json });
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
              {it}
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
            value={geometryConfig.longitude_key}
          />
          <TextField
            sx={{ marginTop: "2px" }}
            size={"small"}
            label={"longitude_key"}
            onChange={({ target: { value } }) => {
              setGeometryConfig({ ...geometryConfig, longitude_key: value });
            }}
            value={geometryConfig.latitude_key}
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
  onSave: (json: GeoJSON.FeatureCollection) => any;
}) => {
  const { onShapeReady, drawing, setDrawing, setOnShapeReady, map } =
    useContext(MapDrawingContext);
  const [show, setShow] = useState(true);
  const [edit, setEdit] = useState(true);
  const mapShapesRef = useRef<MapDrawingShape["shape"][]>([]);

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
        {edit ? (
          <>
            <Button
              onClick={() => {
                mapShapesRef.current.forEach((shape) => shape.setMap(null));
              }}
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                setEdit(false);
                switch (type) {
                  case google.maps.drawing.OverlayType.MARKER: {
                    onSave(
                      pointsToGeojson(
                        mapShapesRef.current as google.maps.Marker[]
                      )
                    );
                    break;
                  }
                  case google.maps.drawing.OverlayType.POLYGON: {
                    onSave(
                      polygonsToGeojson(
                        mapShapesRef.current as google.maps.Polygon[]
                      )
                    );
                  }
                }
              }}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            {mapShapesRef.current.length} точек
            <Button
              onClick={() => {
                //@ts-ignore

                setEdit(true);
              }}
            >
              Edit
            </Button>
          </>
        )}

        <Button
          onClick={() => {
            setShow(!show);
          }}
        >
          {show ? "hide" : "show"}
        </Button>
      </>
    </>
  );
};
