import { DatesInputConfig } from "../../components/date-inputs/dates-input";
import {
  DatesConfig,
  getDateIntervals,
} from "@rrrcn/services/dist/src/services/utils/dates";
import { DataExtractionInput, ScriptInputConfig } from "./data-extraction";
import { DataExtractionConfig } from "@rrrcn/services/dist/src/analytics_config_types";

export const mapDatesConfigToRequest = (
  dates: DatesInputConfig
): DatesConfig => {
  return dates.reduce((acc, it) => {
    acc[it.key] = it.dateIntervals.flatMap((interval) => {
      switch (interval.type) {
        case "date": //@ts-ignore
          return [[new Date(interval?.date), new Date(interval?.date)]];
        case "range": //@ts-ignore
          return [interval?.dates.map((it) => new Date(it))];
        case "repeated":
          return getDateIntervals(
            interval?.dates?.years || [],
            interval?.dates?.months || [],
            interval?.dates?.days || [[1, "end"]]
          );
      }
    });
    return acc;
  }, {} as any) as DatesConfig;
};
export const mapScriptsConfigToRequest = (
  config: Partial<DataExtractionInput>
): Partial<DataExtractionConfig<File | undefined>> => {
  return {
    ...config,
    defaultScriptParams: {
      ...config.defaultScriptParams,
      dates: config.defaultScriptParams?.dates
        ? mapDatesConfigToRequest(
            config.defaultScriptParams?.dates as DatesInputConfig
          )
        : undefined,
    },
    scripts: config.scripts?.map((script) => ({
      ...script,
      dates:
        script.dates &&
        mapDatesConfigToRequest(script.dates as DatesInputConfig),
    })),
  };
};
