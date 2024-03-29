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

import type {
  DataExtractionConfig,
  PopulationConfig,
  RandomForestConfig,
  SurvivalNestConfig,
} from "@rrrcn/services/src/analytics_config_types";
import { MaxentBodyType } from "admin/src/api/analysis/models";
import { MultipleAreaVulnerabilityRequest } from "@rrrcn/services/dist/src/controllers/vulnerability/multiple-area-vulnerability";

export type GetDataBodyType = { type: "data"; config: DataExtractionConfig };
export type VulnerabilityBodyType = {
  type: "vulnerability";
  config: MultipleAreaVulnerabilityRequest;
};
export type RandomForestBodyType = {
  type: "random-forest";
  config: RandomForestConfig;
};
export type PopulationEstimateBodyType = {
  type: "population";
  config: PopulationConfig;
};
export type SurvivalBodyType = {
  type: "survival";
  config: SurvivalNestConfig;
};
export type AnalysisBodyType =
  | VulnerabilityBodyType
  | GetDataBodyType
  | RandomForestBodyType
  | PopulationEstimateBodyType
  | SurvivalBodyType
  | MaxentBodyType;

export const useSendAnalysis = (analysisType: AnalysisBodyType["type"]) => {
  const queryClient = useQueryClient();
  const {
    data: analysisState,
    mutateAsync: postAnalysis,
    ...mutationProps
  } = useMutation("analysis-results", api.analysis.postApiAnalysisProcess, {
    onSuccess(data) {
      queryClient.setQueriesData("analysis-results", data);
    },
  });
  const onSend = useCallback(
    //TODO refactor
    (
      data:
        | FormType["data"]
        | FormType["randomForest"]
        | FormType["population"]
        | Partial<SurvivalNestConfig>
        | MultipleAreaVulnerabilityRequest
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
        case "maxent": {
          config = {
            type: "maxent",
            config: mapRFConfigToRequest(data as RandomForestInputConfig),
          } as MaxentBodyType;
          break;
        }
        case "survival": {
          config = {
            type: "survival",
            config: data,
          } as SurvivalBodyType;
          break;
        }
        default: {
          config = {
            type: analysisType,
            config: data,
          } as VulnerabilityBodyType;
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
  return { analysisState, postAnalysis, onSend, ...mutationProps };
};
