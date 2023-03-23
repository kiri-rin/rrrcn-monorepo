import { DataExtractionInput, ScriptInputConfig } from "./data-extraction";
import * as yup from "yup";
import { lazy } from "yup";
import {
  DateIntervalsInputConfig,
  DatesInputConfig,
} from "../../../common/date-inputs/dates-input";
import { DatesConfig } from "@rrrcn/services/dist/src/services/utils/dates";
export const DatesInputSchema: yup.Schema<DatesInputConfig | undefined> =
  yup.array(
    yup.object({
      key: yup.string().required(),
      dateIntervals: yup.array<DateIntervalsInputConfig>().min(1).required(),
    })
  );
export const ScriptInputSchema: yup.Schema<ScriptInputConfig> = yup.object({
  key: yup.string<ScriptInputConfig["key"]>().min(1).required(),
  dates: DatesInputSchema,
});
export const DataExtractionValidationSchema: yup.Schema<DataExtractionInput> =
  yup.object({
    defaultScriptParams: yup.object({
      dates: DatesInputSchema,
      buffer: yup.number(),
      outputs: yup.string(),
      mode: yup.string<"MEAN" | "SUM">(),
      scale: yup.number(),
    }),
    scripts: yup.array(ScriptInputSchema).min(1).required(),
    points: lazy((value: DataExtractionInput["points"]) => {
      switch (value?.type) {
        case "geojson": {
          return yup.object({
            type: yup.string().required(),
            json: yup.object().required(),
          });
        }
        default:
        case "csv":
        case "shp": {
          return yup.object({
            type: yup.string().required(),
            path: yup.mixed().required(),
          });
        }
      }
    }) as unknown as yup.Schema<DataExtractionInput["points"]>,
  });
