import { DataExtractionInput, ScriptInputConfig } from "./data-extraction";
import * as yup from "yup";
import { lazy } from "yup";
import {
  DateIntervalsInputConfig,
  DatesInputConfig,
} from "../../../common/date-inputs/dates-input";
import { DatesConfig } from "@rrrcn/services/dist/src/services/utils/dates";
import { RandomForestInputConfig } from "./random-forest";
import { GeometryInputConfig } from "../../../common/geometry-input";
import { SeparateTrainingPoints } from "@rrrcn/services/dist/src/analytics_config_types";
export const DateIntervalsSchema = lazy((value: DateIntervalsInputConfig) => {
  switch (value.type) {
    case "range": {
      return yup.object({
        type: yup.string().required(),
        dates: yup.array(yup.string().required()).required().min(2).max(2),
      });
    }
    case "repeated": {
      return yup.object({
        type: yup.string().required(),
        dates: yup.object({
          years: yup
            .array(yup.array(yup.string().required()).length(2))
            .required()
            .min(1),
          months: yup.array(yup.string().required()).required().max(12).min(1),
          days: yup.array(yup.array(yup.string().required()).length(2)),
        }),
      });
    }
    default:
    case "date":
      return yup.object({
        type: yup.string().required(),
        date: yup.string().required(),
      });
  }
});
export const DatesInputItemSchema = yup.object({
  key: yup.string().required(),
  dateIntervals: yup
    .array<DateIntervalsInputConfig>(
      DateIntervalsSchema as unknown as yup.Schema<DateIntervalsInputConfig>
    )
    .min(1)
    .required(),
});
export const DatesInputSchema: yup.Schema<DatesInputConfig | undefined> =
  yup.array(DatesInputItemSchema);

export const ScriptInputSchema: yup.Schema<ScriptInputConfig> = yup.object({
  key: yup.string<ScriptInputConfig["key"]>().min(1).required(),
  dates: DatesInputSchema,
});
export const GeometryInputSchema: yup.Schema<GeometryInputConfig> = lazy(
  (value: DataExtractionInput["points"]) => {
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
  }
) as unknown as yup.Schema<GeometryInputConfig>;
export const DefaultScriptParamsSchema = yup.object({
  dates: DatesInputSchema,
  buffer: yup.number(),
  outputs: yup.string(),
  mode: yup.string<"MEAN" | "SUM">(),
  scale: yup.number(),
});
export const DataExtractionValidationSchema: yup.Schema<DataExtractionInput> =
  yup.object({
    defaultScriptParams: DefaultScriptParamsSchema,
    scripts: yup.array(ScriptInputSchema).min(1).required(),
    points: GeometryInputSchema,
  });
export const RandomForestInputSchema: yup.Schema<RandomForestInputConfig> =
  yup.object({
    params: lazy((value: RandomForestInputConfig["params"]) => {
      switch (value.type) {
        case "asset": {
          return yup.object({
            type: yup.string().required() as yup.Schema<"asset">,
            path: yup.string().required(),
          });
        }
        default:
        case "scripts": {
          return yup.object({
            defaultScriptParams: DefaultScriptParamsSchema,
            type: yup.string().required() as yup.Schema<"scripts">,
            scripts: yup.array(ScriptInputSchema).required().min(1),
          });
        }
      }
    }) as unknown as yup.Schema<RandomForestInputConfig["params"]>,
    regionOfInterest: GeometryInputSchema,
    trainingPoints: lazy((value: RandomForestInputConfig["trainingPoints"]) => {
      switch (value.type) {
        case "all-points": {
          return yup.object({
            type: yup.string().required() as yup.Schema<"all-points">,
            allPoints: yup.object({
              points: GeometryInputSchema,
              presenceProperty: yup.string(),
            }),
          });
        }
        default:
        case "separate-points": {
          return yup.object({
            type: yup.string().required() as yup.Schema<"separate-points">,
            absencePoints: GeometryInputSchema,
            presencePoints: GeometryInputSchema,
          }) as yup.Schema<SeparateTrainingPoints<File>>;
        }
      }
    }) as unknown as yup.Schema<RandomForestInputConfig["trainingPoints"]>,
    outputMode: yup.string().required() as yup.Schema<
      RandomForestInputConfig["outputMode"]
    >,
    validation: lazy((value: RandomForestInputConfig["validation"]) => {
      switch (value.type) {
        case "split": {
          return yup.object({
            type: yup.string() as yup.Schema<"split">,
            split: yup.number().required(),
            seed: yup.number(),
          });
        }
        default: {
          return yup.object({
            type: yup.string() as yup.Schema<"external">,
            points: GeometryInputSchema,
          });
        }
      }
    }) as unknown as yup.Schema<RandomForestInputConfig["validation"]>,
  });

export const getFormSchema = ({
  data,
  randomForest,
}: {
  data: boolean;
  randomForest: boolean;
}) =>
  yup.object({
    ...(data && { data: DataExtractionValidationSchema }),
    ...(randomForest && { randomForest: RandomForestInputSchema }),
  });
