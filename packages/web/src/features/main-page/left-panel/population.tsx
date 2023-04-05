import Select from "@mui/material/Select";
import {
  PopulationDensityType,
  PopulationDistanceConfigType,
  PopulationRandomGenerationConfigType,
} from "@rrrcn/services/dist/src/analytics_config_types";
import { CommonPaper } from "../../../common/common";
import { useTranslations } from "../../../utils/translations";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import { PopulationRandomPointsForm } from "../population/population-points-generate";
import { useField, useFormikContext } from "formik";
import { defaultRFConfig } from "./random-forest";
import { PopulationDistanceForm } from "../population/population-distance";
const Components = {
  "random-points": PopulationRandomPointsForm,
  distance: PopulationDistanceForm,
  density: ({ name }: { name: string }) => <></>,
};
export type PopulationInputConfig =
  | {
      type: "random-points";
      config: Partial<PopulationRandomGenerationConfigType<File>>;
    }
  | { type: "distance"; config: Partial<PopulationDistanceConfigType<File>> }
  | { type: "density"; config: Partial<PopulationDensityType<File>> };
export const PopulationForm = ({ name }: { name: string }) => {
  const strings = useTranslations();
  const { setFieldValue, touched, submitCount, errors } =
    useFormikContext<any>();
  const [{ value: config }, fieldMeta, { setValue: setConfig }] =
    useField<Partial<PopulationInputConfig>>(name);
  const Body = Components[config.type || "density"];
  console.log({ errors });
  return (
    <>
      <CommonPaper>
        {strings["population.choose-type"]}
        <Select
          value={config.type}
          onChange={({ target: { value } }) => {
            value &&
              setConfig({ type: value as keyof typeof Components, config: {} });
          }}
        >
          <MenuItem value={"random-points"}>
            {strings["population.random-generation"]}
          </MenuItem>
          <MenuItem value={"distance"}>
            {strings["population.distance"]}
          </MenuItem>
          <MenuItem value={"density"}>{strings["population.density"]}</MenuItem>
        </Select>
      </CommonPaper>
      <Body name={`${name}.config`} />
    </>
  );
};
