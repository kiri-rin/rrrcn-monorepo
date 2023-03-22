import React, { useState } from "react";
import { Button, MenuItem, Select } from "@mui/material";
import {
  AssetImportConfig,
  CommonScriptParams,
  ComputedObjectImportConfig,
  RandomForestConfig,
  SeparateTrainingPoints,
} from "@rrrcn/services/dist/src/analytics_config_types";
import { GeometryInput } from "../../../common/geometry-input";
import { DatesInputConfig } from "../../../common/date-inputs/dates-input";
import { useTranslations } from "../../../utils/translations";
import { serializeRequestToForm } from "../../../utils/request";
import { mapScriptsConfigToRequest } from "./utils";
import { useMutation, useQueryClient } from "react-query";
import { api } from "../../../api";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { DataExtractionInput, ScriptInputConfig } from "./data-extraction";
import { ParamsImageInput } from "../../../common/params-image-input";

export interface RandomForestInputConfig
  extends Omit<
    RandomForestConfig<File | undefined>,
    "params" | "trainingPoints"
  > {
  trainingPoints: Partial<
    RandomForestConfig<File | undefined>["trainingPoints"]
  >;
  params:
    | AssetImportConfig
    | ComputedObjectImportConfig
    | {
        type: "scripts";
        defaultScriptParams?: Omit<CommonScriptParams, "dates"> & {
          dates: DatesInputConfig;
        };
        scripts: ScriptInputConfig[];
      };
}
export const mapRFConfigToRequest = (config: RandomForestInputConfig) => {
  if (config.params.type === "scripts") {
    return { ...config, params: mapScriptsConfigToRequest(config.params) };
  } else {
    return config;
  }
};
export const defaultRFConfig: Partial<RandomForestInputConfig> = {
  params: { type: "scripts", scripts: [] },
  trainingPoints: {
    type: "all-points",
    allPoints: {
      points: { type: "csv", path: undefined },
    },
  },
  validation: { type: "split", split: 0.2 },
  regionOfInterest: { type: "csv", path: undefined },
  outputMode: "PROBABILITY",
};
export const RandomForestConfigForm = ({
  value: config,
  onChange: setConfig,
  errors,
}: {
  value: Partial<RandomForestInputConfig>;
  onChange: (val: Partial<RandomForestInputConfig>) => any;
  errors?: Partial<RandomForestInputConfig>;
}) => {
  const strings = useTranslations();
  //TODO VALIDATE
  return (
    <div>
      <Box sx={{ marginY: "10px" }}>
        {strings["random-forest.choose-region"]}
      </Box>
      <GeometryInput
        type={"polygon" as google.maps.drawing.OverlayType.POLYGON}
        value={config.regionOfInterest}
        onChange={(value) => setConfig({ regionOfInterest: value })}
      />
      <Divider sx={{ marginY: "10px", backgroundColor: "black" }} />

      <Box sx={{ marginY: "10px" }}>
        {strings["random-forest.choose-training-points"]}
      </Box>
      <Select
        value={config.trainingPoints?.type}
        onChange={({ target: { value } }) =>
          setConfig({
            trainingPoints: { type: value as "all-points" | "separate-points" },
          })
        }
      >
        <MenuItem value={"all-points"}>
          {strings["random-forest.all-training-points"]}
        </MenuItem>
        <MenuItem value={"separate-points"}>
          {strings["random-forest.separate-training-points"]}
        </MenuItem>
      </Select>
      {(() => {
        switch (config.trainingPoints?.type) {
          case "all-points":
            return (
              <>
                <GeometryInput
                  available={["csv", "shp"]}
                  type={"marker" as google.maps.drawing.OverlayType.MARKER}
                  value={config.trainingPoints?.allPoints?.points}
                  onChange={(value) =>
                    setConfig({
                      trainingPoints: {
                        type: "all-points",
                        allPoints: { points: value },
                      },
                    })
                  }
                />
              </>
            );
          case "separate-points":
            return (
              <>
                <GeometryInput
                  type={"marker" as google.maps.drawing.OverlayType.MARKER}
                  value={config.trainingPoints.presencePoints}
                  onChange={(geometryConfig) =>
                    setConfig({
                      trainingPoints: {
                        ...(config.trainingPoints as SeparateTrainingPoints<
                          File | undefined
                        >),
                        presencePoints: geometryConfig,
                      },
                    })
                  }
                />
                <GeometryInput
                  type={"marker" as google.maps.drawing.OverlayType.MARKER}
                  value={config.trainingPoints.absencePoints}
                  onChange={(geometryConfig) =>
                    setConfig({
                      trainingPoints: {
                        ...(config.trainingPoints as SeparateTrainingPoints<
                          File | undefined
                        >),
                        absencePoints: geometryConfig,
                      },
                    })
                  }
                />
              </>
            );
        }
      })()}

      <Divider sx={{ marginY: "10px", backgroundColor: "black" }} />
      <ParamsImageInput
        value={config.params}
        onChange={(params) => setConfig({ params })}
      />
    </div>
  );
};
