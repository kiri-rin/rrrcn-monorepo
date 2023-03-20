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
import { ScriptInputConfig } from "./data-extraction";
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
const mapConfigToRequest = (config: RandomForestInputConfig) => {
  if (config.params.type === "scripts") {
    return { ...config, params: mapScriptsConfigToRequest(config.params) };
  } else {
    return config;
  }
};
const defaultConfig: Partial<RandomForestInputConfig> = {
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
export const RandomForestConfigForm = () => {
  const [config, setConfig] =
    useState<Partial<RandomForestInputConfig>>(defaultConfig);
  const queryClient = useQueryClient();
  const { data: randomForestState, mutateAsync: postRandomForest } =
    useMutation(
      "data-extraction-result",
      api.classifiers.postApiClassifiersRandomForest,
      {
        onSuccess(data) {
          queryClient.setQueriesData("data-extraction-result", data);
        },
      }
    );

  const strings = useTranslations();
  const onSend = () => {
    const form = new FormData();
    serializeRequestToForm(
      mapConfigToRequest(config as RandomForestInputConfig),
      form
    );
    postRandomForest(form);
  };
  //TODO VALIDATE
  return (
    <div>
      <Box sx={{ marginY: "10px" }}>Выберите область интереса</Box>
      <GeometryInput
        type={google.maps.drawing.OverlayType.POLYGON}
        value={config.regionOfInterest}
        onChange={(value) =>
          setConfig((prev) => ({ ...prev, regionOfInterest: value }))
        }
      />
      <Divider sx={{ marginY: "10px", backgroundColor: "black" }} />

      <Box sx={{ marginY: "10px" }}>Выберите Точки для обучения</Box>
      <Select
        value={config.trainingPoints?.type}
        onChange={({ target: { value } }) =>
          setConfig((prev) => ({
            ...prev,
            trainingPoints: { type: value as "all-points" | "separate-points" },
          }))
        }
      >
        <MenuItem value={"all-points"}>all-points</MenuItem>
        <MenuItem value={"separate-points"}>separate-points</MenuItem>
      </Select>
      {(() => {
        switch (config.trainingPoints?.type) {
          case "all-points":
            return (
              <>
                <GeometryInput
                  available={["csv", "shp"]}
                  type={google.maps.drawing.OverlayType.MARKER}
                  value={config.trainingPoints?.allPoints?.points}
                  onChange={(value) =>
                    setConfig((prev) => ({
                      ...prev,
                      trainingPoints: {
                        type: "all-points",
                        allPoints: { points: value },
                      },
                    }))
                  }
                />
              </>
            );
          case "separate-points":
            return (
              <>
                <GeometryInput
                  type={google.maps.drawing.OverlayType.MARKER}
                  value={config.trainingPoints.presencePoints}
                  onChange={(value) =>
                    setConfig((prev) => ({
                      ...prev,
                      trainingPoints: {
                        ...(prev.trainingPoints as SeparateTrainingPoints<
                          File | undefined
                        >),
                        presencePoints: value,
                      },
                    }))
                  }
                />
                <GeometryInput
                  type={google.maps.drawing.OverlayType.MARKER}
                  value={config.trainingPoints.absencePoints}
                  onChange={(value) =>
                    setConfig((prev) => ({
                      ...prev,
                      trainingPoints: {
                        ...(prev.trainingPoints as SeparateTrainingPoints<
                          File | undefined
                        >),
                        absencePoints: value,
                      },
                    }))
                  }
                />
              </>
            );
        }
      })()}

      <Divider sx={{ marginY: "10px", backgroundColor: "black" }} />
      <ParamsImageInput
        value={config.params}
        onChange={(params) => setConfig((prev) => ({ ...prev, params }))}
      />
      <Button
        onClick={() => {
          onSend();
        }}
      >
        {strings["data-extraction.get-result"]}
      </Button>
    </div>
  );
};
