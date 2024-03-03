import Select from "@mui/material/Select";
import type {
  PopulationConfig,
  PopulationDensityType,
  PopulationDistanceConfigType,
  PopulationRandomGenerationConfigType,
} from "@rrrcn/services/src/analytics_config_types";
import { CommonPaper } from "../../components/common/common";
import { useTranslations } from "../../utils/translations";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import { PopulationRandomPointsForm } from "./population-points-generate";
import { FormikContext, useField, useFormik, useFormikContext } from "formik";
import {
  defaultRFConfig,
  RandomForestInputConfig,
} from "../classifications/random-forest/random-forest";
import { PopulationDistanceForm } from "./population-distance";
import { PopulationDensityForm } from "./population-density";
import { useSendAnalysis } from "../common/utils";
import { RandomForestInputSchema } from "../classifications/random-forest/rf-schemas";
import { PopulationSchema } from "./population-schemas";
import { Button } from "@mui/material";
const Components = {
  "random-points": PopulationRandomPointsForm,
  distance: PopulationDistanceForm,
  density: PopulationDensityForm,
};
export type PopulationInputConfig =
  | {
      type: "random-points";
      config: Partial<PopulationRandomGenerationConfigType<File>>;
    }
  | { type: "distance"; config: Partial<PopulationDistanceConfigType<File>> }
  | { type: "density"; config: Partial<PopulationDensityType<File>> };
export const defaultPopulationConfig: PopulationInputConfig = {
  type: "random-points",
  config: {},
};
export const PopulationForm = () => {
  const { onSend } = useSendAnalysis("population");
  const formik = useFormik<Partial<PopulationInputConfig>>({
    initialValues: defaultPopulationConfig,
    validationSchema: PopulationSchema,
    onSubmit: (data) => {
      onSend(data);
    },
  });
  const {
    submitCount,
    touched,
    values: config,
    errors,
    submitForm,
    setFieldValue,
    setValues: setConfig,
  } = formik;
  const strings = useTranslations();

  const Body = Components[config.type || "density"];
  return (
    <FormikContext.Provider value={formik}>
      <CommonPaper>
        <div className={"common__row"}>
          {strings["population.choose-type"]}
          <Select
            size={"small"}
            value={config.type}
            onChange={({ target: { value } }) => {
              value &&
                setConfig({
                  type: value as keyof typeof Components,
                  config: {},
                });
            }}
          >
            <MenuItem value={"random-points"}>
              {strings["population.random-generation"]}
            </MenuItem>
            <MenuItem value={"distance"}>
              {strings["population.distance"]}
            </MenuItem>
            <MenuItem value={"density"}>
              {strings["population.density"]}
            </MenuItem>
          </Select>
        </div>
      </CommonPaper>
      <Body name={`config`} />
      <Button
        onClick={() => {
          submitForm();
        }}
      >
        {strings["data-extraction.get-result"]}
      </Button>
    </FormikContext.Provider>
  );
};
