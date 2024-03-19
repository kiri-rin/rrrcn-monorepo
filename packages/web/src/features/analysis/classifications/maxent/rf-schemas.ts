import * as yup from "yup";
import { lazy } from "yup";
import { SeparateTrainingPoints } from "@rrrcn/services/src/analytics_config_types";
import {
  DefaultScriptParamsSchema,
  ScriptInputSchema,
} from "../random-forest/data-schemas";
import { GeometryInputSchema } from "../../common/geometry-validations";
import { MaxentInputConfig } from "./maxent";

export const TrainingPointsSchema = lazy(
  (value: MaxentInputConfig["trainingPoints"]) => {
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
      case "separate-points": {
        return value.absencePoints
          ? (yup.object({
              type: yup.string().required() as yup.Schema<"separate-points">,
              absencePoints: GeometryInputSchema(),
              presencePoints: GeometryInputSchema(),
            }) as yup.Schema<SeparateTrainingPoints<File>>)
          : (yup.object({
              type: yup.string().required() as yup.Schema<"separate-points">,
              presencePoints: GeometryInputSchema(),
            }) as yup.Schema<SeparateTrainingPoints<File>>);
      }
      default:
        return yup.object({
          type: yup.string().required() as yup.Schema<"all-points">,
          allPoints: yup.object({
            points: GeometryInputSchema(),
            presenceProperty: yup.string(),
          }),
        });
    }
  }
) as unknown as yup.Schema<MaxentInputConfig["trainingPoints"]>;

export const MaxentInputSchema: yup.Schema<MaxentInputConfig> = yup.object({
  params: lazy((value: MaxentInputConfig["params"]) => {
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
  }) as unknown as yup.Schema<MaxentInputConfig["params"]>,
  regionOfInterest: GeometryInputSchema(),
  trainingPoints: TrainingPointsSchema,
  backgroundCount: yup.number(),
  validation: lazy((value: MaxentInputConfig["validation"]) => {
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
  }) as unknown as yup.Schema<MaxentInputConfig["validation"]>,
});
