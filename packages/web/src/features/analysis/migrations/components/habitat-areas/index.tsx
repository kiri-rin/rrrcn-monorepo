import { useFormikContext } from "formik";
import { useCallback, useState } from "react";
import {
  GeometryInput,
  GeometryInputConfig,
  GeometryInputProps,
} from "@/components/geometry-inputs/geometry-input";
import { GoogleMapObject } from "@/utils/geometry/map/useDrawGeojson";
import {
  MigrationHabitatAreaGeneralizeButton,
  MigrationHabitatAreasAddButton,
  MigrationsHabitatAreaContainer,
  MigrationsHabitatAreaDistanceInput,
} from "./style";
import * as turf from "@turf/turf";
import { useGeneralizeAreaPointsMutation } from "@/store/spatial-services";
import { GeojsonImportConfig } from "@rrrcn/services/dist/src/analytics_config_types";
import { useMigrationsContext } from "@/features/analysis/migrations/context/migrations";
type MigrationHabitatAreaStateType = {
  geometryConfig: GeometryInputConfig;
  mapObject: GoogleMapObject;
};
export const MigrationsHabitatAreas = () => {
  const [areas, setAreas] = useState<GeometryInputConfig[]>([]);
  const onAreaChange = useCallback(
    (newArea: GeometryInputConfig, index: number) => {
      setAreas((prevAreas) => {
        prevAreas[index] = newArea;
        return [...prevAreas];
      });
    },
    []
  );
  const onAreaAdd = useCallback(() => {
    setAreas((prevAreas) => {
      return [...prevAreas, { type: "shp", path: undefined }];
    });
  }, []);
  return (
    <>
      {areas.map((it, index) => (
        <MigrationsHabitatArea
          onChange={(newArea) => onAreaChange(newArea, index)}
          value={it}
          type={google.maps.drawing.OverlayType.POLYGON}
        />
      ))}
      <MigrationHabitatAreasAddButton onClick={onAreaAdd}>
        Добавить области обитания
      </MigrationHabitatAreasAddButton>
    </>
  );
};
export const MigrationsHabitatArea = (props: GeometryInputProps) => {
  const [distance, setDistance] = useState<string | null>(null);
  const [trigger, { isLoading, data }] = useGeneralizeAreaPointsMutation();
  const { migrations } = useMigrationsContext();
  console.log(props.value);
  return (
    <MigrationsHabitatAreaContainer>
      <GeometryInput {...props} />
      <MigrationsHabitatAreaDistanceInput
        size={"small"}
        value={distance}
        onChange={({ target: { value } }) => setDistance(value)}
        label={"Минимальная дистанция для генерализации"}
      />
      <MigrationHabitatAreaGeneralizeButton
        onClick={() => {
          trigger({
            area: (props.value as GeojsonImportConfig)?.json.features[0],
            points: migrations?.flatMap((it) => it.geojson.features),
            cellSide: distance,
          }); //TODO validate
        }}
      >
        Генерализовать точки треков
      </MigrationHabitatAreaGeneralizeButton>
    </MigrationsHabitatAreaContainer>
  );
};
