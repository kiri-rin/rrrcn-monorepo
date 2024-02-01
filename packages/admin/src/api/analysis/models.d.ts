import { MaxentConfig } from "@rrrcn/services/src/analytics_config_types";

export type MaxentBodyType = {
  type: "maxent";
  config: MaxentConfig;
};
