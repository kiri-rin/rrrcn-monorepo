import * as yup from "yup";
import type { SurvivalNestConfig } from "@rrrcn/services/src/analytics_config_types";

export const SurvivalValidationSchema: yup.Schema<SurvivalNestConfig<any>> =
  yup.object({
    survivalFile: yup.mixed().required(),
    nocc: yup.number().required(),
  });
