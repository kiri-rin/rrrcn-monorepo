import { DatesInputConfig } from "../../common/dates-input";
import {
  DatesConfig,
  getDateIntervals,
} from "@rrrcn/services/dist/src/services/utils/dates";
import {
  DataExtractionInput,
  ScriptInputConfig,
} from "./components/config-form";
import { DataExtractionConfig } from "@rrrcn/services/dist/src/analytics_config_types";

export const mapDatesConfigToRequest = (
  dates: DatesInputConfig
): DatesConfig => {
  return dates.reduce((acc, it) => {
    acc[it.key] = it.dateIntervals.map((interval) => {
      switch (interval.type) {
        case "date": //@ts-ignore
          return [new Date(interval?.date), new Date(interval?.date)];
        case "range": //@ts-ignore
          return interval?.dates.map((it) => new Date(it));
        case "repeated":
          return getDateIntervals(
            interval?.years || [],
            interval.months || [],
            interval.days || [[1, "end"]]
          );
      }
    });
    return acc;
  }, {} as any) as DatesConfig;
};
export const mapConfigToRequest = (
  config: DataExtractionInput
): DataExtractionConfig<File | undefined> => {
  return {
    ...config,
    scripts: config.scripts.map((script) => ({
      ...script,
      dates:
        script.dates &&
        mapDatesConfigToRequest(script.dates as DatesInputConfig),
    })),
  };
};
