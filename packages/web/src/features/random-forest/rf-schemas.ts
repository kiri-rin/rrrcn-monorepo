import * as yup from "yup";
import { lazy } from "yup";
import { RandomForestInputConfig } from "./random-forest";
import type { SeparateTrainingPoints } from "@rrrcn/services/src/analytics_config_types";
import { DefaultScriptParamsSchema, ScriptInputSchema } from "./data-schemas";
import { GeometryInputSchema } from "../common/geometry-validations";

export const TrainingPointsSchema = lazy(
  (value: RandomForestInputConfig["trainingPoints"]) => {
    switch (value.type) {
      case "all-points": {
        return yup.object({
          type: yup.string().required() as yup.Schema<"all-points">,
          allPoints: yup.object({
            points: GeometryInputSchema(),
            presenceProperty: yup.string(),
          }),
        });
      }
      default:
      case "separate-points": {
        return yup.object({
          type: yup.string().required() as yup.Schema<"separate-points">,
          absencePoints: GeometryInputSchema(),
          presencePoints: GeometryInputSchema(),
        }) as yup.Schema<SeparateTrainingPoints<File>>;
      }
    }
  }
) as unknown as yup.Schema<RandomForestInputConfig["trainingPoints"]>;
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
    regionOfInterest: GeometryInputSchema(),
    trainingPoints: TrainingPointsSchema,
    outputMode: yup.string().required() as yup.Schema<
      RandomForestInputConfig["outputMode"]
    >,
    classificationSplits: yup.array(),
    buffersPerAreaPoint: yup.array(),
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
            points: TrainingPointsSchema,
          });
        }
      }
    }) as unknown as yup.Schema<RandomForestInputConfig["validation"]>,
  });
