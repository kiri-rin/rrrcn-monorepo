import React, { useState } from "react";
import { Button, MenuItem, Paper, Select, TextField } from "@mui/material";
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
import { FormikErrors, useField, useFormikContext } from "formik";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import Typography from "@mui/material/Typography";
import { CommonPaper } from "../../../common/common";

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
  name,
}: {
  value: Partial<RandomForestInputConfig>;
  onChange: (val: Partial<RandomForestInputConfig>) => any;
  name: string;
}) => {
  const { setFieldValue } = useFormikContext();
  const [
    { value: config = defaultRFConfig },
    fieldMeta,
    { setValue: setConfig },
  ] = useField<Partial<RandomForestInputConfig>>(name);
  const errors = fieldMeta.error as any;

  const strings = useTranslations();
  //TODO VALIDATE
  return (
    <div>
      <CommonPaper>
        <Typography sx={{ marginY: "10px" }}>
          {strings["random-forest.choose-region"]}
        </Typography>
        <GeometryInput
          error={errors?.regionOfInterest}
          type={"polygon" as google.maps.drawing.OverlayType.POLYGON}
          value={config.regionOfInterest}
          onChange={(value) =>
            setConfig({ ...config, regionOfInterest: value })
          }
        />
      </CommonPaper>
      <Divider sx={{ marginY: "10px", backgroundColor: "black" }} />
      <CommonPaper
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ marginY: "10px" }}>
          {strings["random-forest.choose-training-points"]}
        </Typography>
        <Select
          size={"small"}
          value={config.trainingPoints?.type}
          onChange={({ target: { value } }) =>
            setConfig({
              ...config,
              trainingPoints: {
                type: value as "all-points" | "separate-points",
              },
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
      </CommonPaper>
      {(() => {
        switch (config.trainingPoints?.type) {
          case "all-points":
            return (
              <CommonPaper>
                <Typography sx={{ marginY: "10px" }}>
                  {strings["random-forest.choose-all-training-points"]}
                </Typography>
                <GeometryInput
                  error={errors?.trainingPoints?.allPoints?.points}
                  available={["csv", "shp"]}
                  type={"marker" as google.maps.drawing.OverlayType.MARKER}
                  value={config.trainingPoints?.allPoints?.points}
                  onChange={(value) =>
                    setConfig({
                      ...config,
                      trainingPoints: {
                        type: "all-points",
                        allPoints: { points: value },
                      },
                    })
                  }
                />
                <TextField
                  size={"small"}
                  value={config.trainingPoints?.allPoints?.presenceProperty}
                  onChange={({ target: { value } }) =>
                    setFieldValue(
                      `${name}.trainingPoints.allPoints.presenceProperty`,
                      value
                    )
                  }
                  label={"presence key"}
                />
              </CommonPaper>
            );
          case "separate-points":
            return (
              <>
                <CommonPaper>
                  <Typography sx={{ marginY: "10px" }}>
                    {strings["random-forest.choose-presence"]}
                  </Typography>
                  <GeometryInput
                    error={errors?.trainingPoints?.presencePoints}
                    type={"marker" as google.maps.drawing.OverlayType.MARKER}
                    value={config.trainingPoints.presencePoints}
                    onChange={(geometryConfig) =>
                      setConfig({
                        ...config,
                        trainingPoints: {
                          ...(config.trainingPoints as SeparateTrainingPoints<
                            File | undefined
                          >),
                          presencePoints: geometryConfig,
                        },
                      })
                    }
                  />
                </CommonPaper>
                <CommonPaper>
                  <Typography sx={{ marginY: "10px" }}>
                    {strings["random-forest.choose-absence"]}
                  </Typography>
                  <GeometryInput
                    error={errors?.trainingPoints?.absencePoints}
                    type={"marker" as google.maps.drawing.OverlayType.MARKER}
                    value={config.trainingPoints.absencePoints}
                    onChange={(geometryConfig) =>
                      setConfig({
                        ...config,
                        trainingPoints: {
                          ...(config.trainingPoints as SeparateTrainingPoints<
                            File | undefined
                          >),
                          absencePoints: geometryConfig,
                        },
                      })
                    }
                  />
                </CommonPaper>
              </>
            );
        }
      })()}
      <Divider sx={{ marginY: "10px", backgroundColor: "black" }} />
      <ParamsImageInput name={`${name}.params`} />
    </div>
  );
};
