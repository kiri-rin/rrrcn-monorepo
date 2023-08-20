import { DataExtractionInput, ScriptInputConfig } from "./data-extraction";
import * as yup from "yup";
import { DatesInputSchema } from "../common/dates-schemas";
import { GeometryInputSchema } from "../common/geometry-validations";

export const ScriptInputSchema: yup.Schema<ScriptInputConfig> = yup.object({
  key: yup.string<ScriptInputConfig["key"]>().min(1).required(),
  dates: DatesInputSchema,
});
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
    points: GeometryInputSchema(),
  });
