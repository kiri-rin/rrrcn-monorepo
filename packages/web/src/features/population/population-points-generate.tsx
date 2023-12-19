import { PopulationRandomGenerationConfigType } from "@rrrcn/services/dist/src/analytics_config_types";
import { CommonPaper } from "../../components/common";
import { GeometryInput } from "../../components/geometry-input";
import { Checkbox, Input, Typography } from "@mui/material";
import { useTranslations } from "../../utils/translations";
import { useField, useFormikContext } from "formik";
import React from "react";

type PopulationRandomGenerationInputType =
  PopulationRandomGenerationConfigType<File>;

export const PopulationRandomPointsForm = ({ name }: { name: string }) => {
  const strings = useTranslations();
  const { setFieldValue, touched, submitCount } = useFormikContext<any>();
  const [{ value: config }, fieldMeta, { setValue: setConfig }] =
    useField<Partial<PopulationRandomGenerationInputType>>(name);
  const errors = fieldMeta.error as any;

  return (
    <>
      <CommonPaper
        error={(touched[`${name}.areas`] || submitCount) && errors?.areas}
      >
        <Typography sx={{ marginY: "10px" }}>
          {strings["population.observed-areas"]}
        </Typography>
        <GeometryInput
          type={"polygon" as google.maps.drawing.OverlayType.POLYGON}
          onChange={(value) => setFieldValue(`${name}.areas`, value)}
          value={config.areas}
        />
      </CommonPaper>
      <CommonPaper
        error={(touched[`${name}.points`] || submitCount) && errors?.points}
      >
        <Typography sx={{ marginY: "10px" }}>
          {strings["population.presence-points"]}
        </Typography>
        <GeometryInput
          onChange={(value) => setFieldValue(`${name}.points`, value)}
          value={config.points}
        />
      </CommonPaper>
      <CommonPaper
        error={
          (touched[`${name}.presenceArea`] || submitCount) &&
          errors?.presenceArea
        }
      >
        <Typography sx={{ marginY: "10px" }}>
          {strings["population.presence-area"]}
        </Typography>
        <GeometryInput
          type={"polygon" as google.maps.drawing.OverlayType.POLYGON}
          onChange={(value) => setFieldValue(`${name}.presenceArea`, value)}
          value={config.presenceArea}
        />
      </CommonPaper>
      <CommonPaper>
        <Typography sx={{ marginY: "10px" }}>
          {strings["population.cross-validation"]}
        </Typography>
        <Input
          placeholder={strings["population.cross-validation"]}
          error={
            (touched[`${name}.crossValidation`] || submitCount) &&
            errors?.crossValidation
          }
          onChange={({ target: { value } }) =>
            setFieldValue(`${name}.crossValidation`, value || undefined)
          }
          value={config.crossValidation || ""}
        />
        <Typography sx={{ marginY: "10px" }}>
          {strings["population.seed"]}
        </Typography>
        <Input
          placeholder={strings["population.seed"]}
          error={(touched[`${name}.seed`] || submitCount) && errors?.seed}
          onChange={({ target: { value } }) =>
            setFieldValue(`${name}.seed`, value || undefined)
          }
          value={config.seed || ""}
        />
      </CommonPaper>
    </>
  );
};
