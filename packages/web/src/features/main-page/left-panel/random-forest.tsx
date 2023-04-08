import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
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

import Divider from "@mui/material/Divider";
import { DataExtractionInput, ScriptInputConfig } from "./data-extraction";
import { ParamsImageInput } from "../../../common/params-image-input";
import { FormikErrors, useField, useFormikContext } from "formik";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;
import Typography from "@mui/material/Typography";
import { CommonPaper } from "../../../common/common";
import { scriptKey } from "@rrrcn/services/dist/src/services/ee-data";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
export const RandomForestConfigForm = ({ name }: { name: string }) => {
  const { setFieldValue, touched, submitCount } = useFormikContext<any>();
  const [
    { value: config = defaultRFConfig },
    fieldMeta,
    { setValue: setConfig },
  ] = useField<Partial<RandomForestInputConfig>>(name);
  const errors = fieldMeta.error as any;

  const strings = useTranslations();
  //TODO VALIDATE
  return (
    <div style={{ paddingBottom: 20 }}>
      <CommonPaper
        error={
          (touched[`${name}.outputMode`] || submitCount) && errors?.outputMode
        }
      >
        <div className={"common__row"}>
          <Typography sx={{ marginY: "10px" }}>
            {strings["random-forest.choose-output-mode"]}
          </Typography>
          <Select
            size={"small"}
            onChange={({ target: { value } }) => {
              setFieldValue(`${name}.outputMode`, value);
            }}
            value={config.outputMode || "PROBABILITY"}
          >
            <MenuItem value={"PROBABILITY"}>PROBABILITY</MenuItem>
            <MenuItem value={"REGRESSION"}>REGRESSION</MenuItem>
            <MenuItem value={"CLASSIFICATION"}> CLASSIFICATION</MenuItem>
          </Select>
        </div>
      </CommonPaper>
      <CommonPaper
        error={
          (touched[`${name}.regionOfInterest`] || submitCount) &&
          errors?.regionOfInterest
        }
      >
        <Typography sx={{ marginY: "10px" }}>
          {strings["random-forest.choose-region"]}
        </Typography>
        <GeometryInput
          type={"polygon" as google.maps.drawing.OverlayType.POLYGON}
          value={config.regionOfInterest}
          onChange={(value) =>
            setConfig({ ...config, regionOfInterest: value })
          }
        />
      </CommonPaper>
      <Divider sx={{ marginY: "10px", backgroundColor: "black" }} />

      <TrainingPointsInput name={`${name}.trainingPoints`} />
      <Accordion defaultExpanded={false} sx={{ boxShadow: "none" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            boxShadow:
              "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
          }}
          className={`common__card common__card_${
            (touched[`${name}.validation`] || submitCount) && errors?.validation
              ? "error"
              : "blue"
          }`}
        >
          <div className={"common__row"}>
            <Typography>{strings["random-forest.validation"]}</Typography>
            <Select
              value={config?.validation?.type}
              onChange={({ target: { value: _value } }) => {
                setFieldValue(`${name}.validation`, {
                  type: _value,
                  ...(_value === "external" && {
                    points: defaultRFConfig["trainingPoints"],
                  }),
                });
              }}
              size={"small"}
            >
              <MenuItem value={"split"}>
                {strings["random-forest.validation.split-points"]}
              </MenuItem>
              <MenuItem value={"external"}>
                {strings["random-forest.validation.external"]}
              </MenuItem>
            </Select>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{}}>
          {(() => {
            switch (config.validation?.type) {
              case "external": {
                return (
                  <>
                    <TrainingPointsInput
                      title={strings["random-forest.choose-validation-points"]}
                      name={`${name}.validation.points`}
                    />
                  </>
                );
              }
              case "split":
                return (
                  <CommonPaper
                    error={
                      !!(
                        touched[`${name}.validation.split`] ||
                        touched[`${name}.validation.seed`] ||
                        submitCount
                      ) &&
                      (errors?.validation?.split || errors?.validation?.seed)
                    }
                  >
                    <TextField
                      margin={"dense"}
                      size={"small"}
                      label={strings["random-forest.validation.split"]}
                      value={config.validation?.split}
                      onChange={({ target: { value } }) =>
                        setFieldValue(`${name}.validation.split`, value)
                      }
                    />
                    <TextField
                      margin={"dense"}
                      size={"small"}
                      label={strings["random-forest.validation.seed"]}
                      value={config.validation?.seed}
                      onChange={({ target: { value } }) =>
                        setFieldValue(`${name}.validation.seed`, value)
                      }
                    />
                    <TextField
                      margin={"dense"}
                      size={"small"}
                      label={
                        strings["random-forest.validation.cross_validation"]
                      }
                      value={config.validation?.cross_validation}
                      onChange={({ target: { value } }) =>
                        setFieldValue(
                          `${name}.validation.cross_validation`,
                          value
                        )
                      }
                    />
                    {config.validation?.cross_validation && (
                      <div>
                        <div
                          onClick={() => {
                            if (config.validation?.type === "split") {
                              setFieldValue(
                                `${name}.validation.render_mean`,
                                !(config.validation.render_mean !== undefined
                                  ? config.validation.render_mean
                                  : true)
                              );
                            }
                          }}
                          className={"common__row"}
                          style={{ width: "fit-content", cursor: "pointer" }}
                        >
                          <Checkbox
                            checked={
                              config.validation.render_mean !== undefined
                                ? config.validation.render_mean
                                : true
                            }
                          />
                          <Typography>
                            {strings["random-forest.validation.render_mean"]}
                          </Typography>
                        </div>
                        <div
                          onClick={() => {
                            if (config.validation?.type === "split") {
                              setFieldValue(
                                `${name}.validation.render_best`,
                                config.validation.render_best !== undefined
                                  ? !config.validation.render_best
                                  : false
                              );
                            }
                          }}
                          className={"common__row"}
                          style={{ width: "fit-content", cursor: "pointer" }}
                        >
                          <Checkbox
                            checked={
                              config.validation.render_best !== undefined
                                ? config.validation.render_best
                                : true
                            }
                          />
                          <Typography>
                            {strings["random-forest.validation.render_best"]}
                          </Typography>
                        </div>
                        <div className={"common__row"}>
                          <Typography>
                            {strings["random-forest.validation.use-by-default"]}
                          </Typography>
                          <Select
                            onChange={({ target: { value } }) =>
                              setFieldValue(
                                `${name}.validation.return_default`,
                                value
                              )
                            }
                            size={"small"}
                            value={config.validation.return_default || "best"}
                          >
                            <MenuItem value={"best"}>
                              {strings["random-forest.validation.best"]}
                            </MenuItem>

                            <MenuItem value={"mean"}>
                              {strings["random-forest.validation.mean"]}
                            </MenuItem>
                          </Select>
                        </div>
                      </div>
                    )}
                  </CommonPaper>
                );
              default:
                return <></>;
            }
          })()}
        </AccordionDetails>
      </Accordion>
      <Divider sx={{ marginY: "10px", backgroundColor: "black" }} />
      <ParamsImageInput name={`${name}.params`} />
    </div>
  );
};
const TrainingPointsInput = ({
  name,
  title,
}: {
  name: string;
  title?: string;
}) => {
  const { setFieldValue, touched, submitCount } = useFormikContext<any>();
  const [{ value: config }, fieldMeta, { setValue: setConfig }] =
    useField<Partial<RandomForestInputConfig["trainingPoints"]>>(name);
  const errors = fieldMeta.error as any;
  const strings = useTranslations();

  return (
    <Accordion defaultExpanded={true} sx={{ boxShadow: "none" }}>
      <AccordionSummary
        sx={{
          boxShadow:
            "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
        }}
        className={`common__card common__card_${
          (touched[name] || submitCount) && errors ? "error" : "blue"
        }`}
        expandIcon={<ExpandMoreIcon />}
      >
        <div className={"common__row"}>
          <Typography sx={{ marginY: "10px" }}>
            {title || strings["random-forest.choose-training-points"]}
          </Typography>
          <Select
            onClick={(e) => e.stopPropagation()}
            size={"small"}
            value={config?.type}
            onChange={({ target: { value } }) =>
              setConfig({
                ...config,

                type: value as "all-points" | "separate-points",
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
        </div>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        {(() => {
          switch (config.type) {
            case "all-points":
              return (
                <CommonPaper
                  error={
                    (touched[`${name}.allPoints.points`] || submitCount) &&
                    errors?.allPoints?.points
                  }
                >
                  <Typography sx={{ marginY: "10px" }}>
                    {strings["random-forest.choose-all-training-points"]}
                  </Typography>
                  <GeometryInput
                    available={["csv", "shp"]}
                    type={"marker" as google.maps.drawing.OverlayType.MARKER}
                    value={config?.allPoints?.points}
                    onChange={(value) =>
                      setConfig({
                        ...config,
                        type: "all-points",
                        allPoints: { points: value },
                      })
                    }
                  />
                  <TextField
                    margin={"dense"}
                    size={"small"}
                    value={config?.allPoints?.presenceProperty}
                    onChange={({ target: { value } }) =>
                      setFieldValue(`${name}.allPoints.presenceProperty`, value)
                    }
                    label={"presence key"}
                  />
                </CommonPaper>
              );
            case "separate-points":
              return (
                <>
                  <CommonPaper
                    error={
                      (touched[`${name}.presencePoints`] || submitCount) &&
                      errors?.presencePoints
                    }
                  >
                    <Typography sx={{ marginY: "10px" }}>
                      {strings["random-forest.choose-presence"]}
                    </Typography>
                    <GeometryInput
                      type={"marker" as google.maps.drawing.OverlayType.MARKER}
                      value={config?.presencePoints}
                      onChange={(geometryConfig) =>
                        setConfig({
                          ...config,

                          presencePoints: geometryConfig,
                        })
                      }
                    />
                  </CommonPaper>
                  <CommonPaper
                    error={
                      (touched[`${name}.absencePoints`] || submitCount) &&
                      errors?.absencePoints
                    }
                  >
                    <Typography sx={{ marginY: "10px" }}>
                      {strings["random-forest.choose-absence"]}
                    </Typography>
                    <GeometryInput
                      type={"marker" as google.maps.drawing.OverlayType.MARKER}
                      value={config?.absencePoints}
                      onChange={(geometryConfig) =>
                        setConfig({
                          ...config,

                          absencePoints: geometryConfig,
                        })
                      }
                    />
                  </CommonPaper>
                </>
              );
            default:
              return <></>;
          }
        })()}
      </AccordionDetails>
    </Accordion>
  );
};
