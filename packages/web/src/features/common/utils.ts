import { useMutation, useQueryClient } from "react-query";
import { api } from "../../api";
import { mapScriptsConfigToRequest } from "../random-forest/utils";
import { DataExtractionInput } from "../random-forest/data-extraction";
import {
  mapRFConfigToRequest,
  RandomForestInputConfig,
} from "../random-forest/random-forest";
import { serializeRequestToForm } from "../../utils/request";
import { FormType } from "../../navigation/main-page/left-panel";
import { useCallback } from "react";

import {
  DataExtractionConfig,
  PopulationConfig,
  RandomForestConfig,
} from "@rrrcn/services/dist/src/analytics_config_types";

export type GetDataBodyType = { type: "data"; config: DataExtractionConfig };
export type RandomForestBodyType = {
  type: "random-forest";
  config: RandomForestConfig;
};
export type PopulationEstimateBodyType = {
  type: "population";
  config: PopulationConfig;
};
export type AnalysisBodyType =
  | GetDataBodyType
  | RandomForestBodyType
  | PopulationEstimateBodyType;

export const useSendAnalysis = (analysisType: AnalysisBodyType["type"]) => {
  const queryClient = useQueryClient();
  const { data: analysisState, mutateAsync: postAnalysis } = useMutation(
    "analysis-results",
    api.analysis.postApiAnalysisProcess,
    {
      onSuccess(data) {
        queryClient.setQueriesData("analysis-results", data);
      },
    }
  );
  const onSend = useCallback(
    (
      data: FormType["data"] | FormType["randomForest"] | FormType["population"]
    ) => {
      let config: AnalysisBodyType | undefined;
      switch (analysisType) {
        case "data": {
          config = {
            type: analysisType,
            config: mapScriptsConfigToRequest(data as DataExtractionInput),
          } as GetDataBodyType;
          break;
        }
        case "population": {
          config = {
            type: "population",
            config: data,
          } as PopulationEstimateBodyType;
          break;
        }
        case "random-forest": {
          config = {
            type: "random-forest",
            config: mapRFConfigToRequest(data as RandomForestInputConfig),
          } as RandomForestBodyType;
          break;
        }
      }
      if (config) {
        const form = new FormData();
        serializeRequestToForm(config, form);
        postAnalysis(form);
      }
    },
    [analysisType, postAnalysis]
  );
  return { analysisState, postAnalysis, onSend };
};
