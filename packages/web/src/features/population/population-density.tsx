import {
  PopulationDensityType,
  PopulationDistanceConfigType,
  PopulationRandomGenerationConfigType,
} from "@rrrcn/services/dist/src/analytics_config_types";
import { CommonPaper } from "../../common/common";
import { GeometryInput } from "../../common/geometry-input";
import { Checkbox, Input, MenuItem, Select, Typography } from "@mui/material";
import { useTranslations } from "../../utils/translations";
import { useField, useFormikContext } from "formik";
import {
  defaultRFConfig,
  RandomForestInputConfig,
} from "../random-forest/random-forest";
import React from "react";

export const PopulationDensityForm = ({ name }: { name: string }) => {
  const strings = useTranslations();
  const { setFieldValue, touched, submitCount } = useFormikContext<any>();
  const [{ value: config }, fieldMeta, { setValue: setConfig }] =
    useField<Partial<PopulationDensityType>>(name);
  const errors = fieldMeta.error as any;

  return (
    <>
      <CommonPaper
        error={
          (touched[`${name}.densityFile`] ||
            touched[`${name}.totalArea`] ||
            submitCount) &&
          errors
        }
      >
        <Typography sx={{ marginY: "10px" }}>
          {strings["population.density-file"]}
        </Typography>
        <Input
          error={
            (touched[`${name}.densityFile`] || submitCount) &&
            errors?.densityFile
          }
          size={"small"}
          type={"file"}
          inputProps={{ accept: "text/csv" }}
          onChange={({
            target: { files, form },
          }: React.ChangeEvent<HTMLInputElement>) => {
            files?.[0] && setFieldValue(`${name}.densityFile`, files[0]);
          }}
        />

        <Typography sx={{ marginY: "10px" }}>
          {strings["population.distance-total-area"]}
        </Typography>
        <Input
          error={
            (touched[`${name}.totalArea`] || submitCount) && errors?.totalArea
          }
          onChange={({ target: { value } }) =>
            setFieldValue(`${name}.totalArea`, value)
          }
          value={config.totalArea}
        />
      </CommonPaper>
    </>
  );
};
