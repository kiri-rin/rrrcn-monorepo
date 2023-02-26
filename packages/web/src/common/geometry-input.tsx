import React, { useEffect, useState } from "react";
import { GeometriesImportConfig } from "@rrrcn/services/dist/src/analytics_config_types";
import { Input, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useEffectNoOnMount } from "../utils/hooks";
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
