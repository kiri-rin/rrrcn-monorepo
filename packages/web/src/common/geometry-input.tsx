import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { GeometriesImportConfig } from "@rrrcn/services/dist/src/analytics_config_types";
import { Button, Input, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useEffectNoOnMount } from "../utils/hooks";
import { MapDrawingContext, MapDrawingShape } from "./map/MapEdit";
import { pointsToGeojson } from "../utils/map/map-geojson-utils";
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
}: {
  value?: GeometryInputConfig;
  onChange?: (config: GeometryInputConfig) => any;
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
        {inputModes.map((it) => (
          <MenuItem key={it} value={it}>
            {it}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
export const MapGeometryInput = ({
  onSave,
}: {
  onSave: (json: GeoJSON.FeatureCollection) => any;
}) => {
  const { onShapeReady, drawing, setDrawing, setOnShapeReady, map } =
    useContext(MapDrawingContext);
  const [show, setShow] = useState(true);
  const [edit, setEdit] = useState(true);
  const mapShapesRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (edit) {
      const _onShapeReady = (shape: MapDrawingShape) => {
        if (shape.type === "marker") {
          mapShapesRef.current.push(shape.shape);
        }
      };
      setOnShapeReady(() => _onShapeReady);
    }
    setDrawing(edit ? google.maps.drawing.OverlayType.MARKER : false);
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
                onSave(pointsToGeojson(mapShapesRef.current));
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
