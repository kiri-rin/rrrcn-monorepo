import * as yup from "yup";
import { SurvivalNestConfig } from "@rrrcn/services/dist/src/analytics_config_types";

export const SurvivalValidationSchema: yup.Schema<SurvivalNestConfig<any>> =
  yup.object({
    survivalFile: yup.mixed().required(),
  });
