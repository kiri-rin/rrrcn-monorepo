import {
  PopulationDensityType,
  PopulationDistanceConfigType,
  PopulationRandomGenerationConfigType,
} from "@rrrcn/services/dist/src/analytics_config_types";
import { CommonPaper } from "../../components/common";
import { GeometryInput } from "../../components/geometry-input";
import { Checkbox, Input, MenuItem, Select, Typography } from "@mui/material";
import { useTranslations } from "../../utils/translations";
import { useField, useFormikContext } from "formik";
import {
  defaultRFConfig,
  RandomForestInputConfig,
} from "../random-forest/random-forest";
import React from "react";

type PopulationRandomGenerationInputType =
  PopulationRandomGenerationConfigType<File>;

export const PopulationDistanceForm = ({ name }: { name: string }) => {
  const strings = useTranslations();
  const { setFieldValue, touched, submitCount } = useFormikContext<any>();
  const [{ value: config }, fieldMeta, { setValue: setConfig }] =
    useField<Partial<PopulationDistanceConfigType>>(name);
  const errors = fieldMeta.error as any;

  return (
    <>
      <CommonPaper
        error={
          (touched[`${name}.distanceFile`] ||
            touched[`${name}.totalArea`] ||
            submitCount) &&
          errors
        }
      >
        <Typography sx={{ marginY: "10px" }}>
          {strings["population.distance-file"]}
        </Typography>
        <Input
          error={
            (touched[`${name}.distanceFile`] || submitCount) &&
            errors?.distanceFile
          }
          size={"small"}
          type={"file"}
          inputProps={{ accept: "text/csv" }}
          onChange={({
            target: { files, form },
          }: React.ChangeEvent<HTMLInputElement>) => {
            files?.[0] && setFieldValue(`${name}.distanceFile`, files[0]);
          }}
        />

        <Typography sx={{ marginY: "10px" }}>
          {strings["population.distance-function"]}
        </Typography>
        <Select
          size={"small"}
          error={
            (touched[`${name}.densityFunction`] || submitCount) &&
            errors?.distanceFunction
          }
          onChange={({ target: { value } }) =>
            setFieldValue(`${name}.densityFunction`, value)
          }
          value={config.densityFunction || "hn"}
        >
          <MenuItem value={"hn"}>half-normal</MenuItem>
          <MenuItem value={"hr"}>hazard-rate</MenuItem>
        </Select>
      </CommonPaper>
    </>
  );
};
