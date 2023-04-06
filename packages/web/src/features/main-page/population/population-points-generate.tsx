import {
  PopulationDensityType,
  PopulationDistanceConfigType,
  PopulationRandomGenerationConfigType,
} from "@rrrcn/services/dist/src/analytics_config_types";
import { CommonPaper } from "../../../common/common";
import { GeometryInput } from "../../../common/geometry-input";
import { Checkbox, Typography } from "@mui/material";
import { useTranslations } from "../../../utils/translations";
import { useField, useFormikContext } from "formik";
import {
  defaultRFConfig,
  RandomForestInputConfig,
} from "../left-panel/random-forest";

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
        <Checkbox
          checked={config.presenceArea?.type === "computedObject"}
          onChange={() => {
            if (config.presenceArea?.type === "computedObject") {
              setFieldValue(`${name}.presenceArea`, { type: "csv" });
            } else {
              setFieldValue(`${name}.presenceArea`, { type: "computedObject" });
            }
          }}
        />
        {strings["population.use-random-forest"]}

        {config.presenceArea?.type !== "computedObject" && (
          <GeometryInput
            onChange={(value) => setFieldValue(`${name}.presenceArea`, value)}
            value={config.presenceArea}
          />
        )}
      </CommonPaper>
    </>
  );
};
