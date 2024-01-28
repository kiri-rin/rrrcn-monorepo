import { Strapi } from "@strapi/strapi";
import { Context, Request } from "koa";
import {
  DataExtractionConfig,
  PopulationConfig,
  SurvivalNestConfig,
} from "@rrrcn/services/src/analytics_config_types";
import { extractData } from "@rrrcn/services/src/controllers/extract-data/extract-data";
import scripts from "@rrrcn/services/src/services/ee-data";
import { randomForest } from "@rrrcn/services/src/controllers/random-forest/random-forest";
import { RandomForestConfig } from "@rrrcn/services/src/analytics_config_types";
import { populationEstimation } from "@rrrcn/services/src/controllers/population-estimation";
import { estimateNestSurvival } from "@rrrcn/services/src/controllers/survival/survival-nest-mark";
import { maxent } from "@rrrcn/services/src/controllers/maxent/maxent";
import {
  multipleAreaVulnerabilityController,
  MultipleAreaVulnerabilityRequest,
} from "@rrrcn/services/dist/src/controllers/vulnerability/multiple-area-vulnerability";

const { PassThrough } = require("stream");

export type GetDataBodyType = { type: "data"; config: DataExtractionConfig };
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
export type MaxentBodyType = {
  type: "survival";
  config: SurvivalNestConfig;
};
export type VulnerabilityBodyType = {
  type: "vulnerability";
  config: MultipleAreaVulnerabilityRequest;
};
export type AnalysisBodyType =
  | VulnerabilityBodyType
  | GetDataBodyType
  | RandomForestBodyType
  | PopulationEstimateBodyType
  | SurvivalBodyType
  | MaxentBodyType;

const analysisServices = {
  data: extractData,
  "random-forest": randomForest,
  population: populationEstimation,
  migrations: "",
  survival: estimateNestSurvival,
  maxent: maxent,
  vulnerability: multipleAreaVulnerabilityController,
};
module.exports = ({ strapi }: { strapi: Strapi }) => ({
  async processAnalysis(
    ctx: Context & {
      request: Request & { fullBody: AnalysisBodyType };
    }
  ) {
    console.error(ctx.request.fullBody);
    const resultService = strapi.service("api::result.result");

    const { config, type } = ctx.request.fullBody;
    const { id: resultId, uid: resultUID } = await resultService.create({
      data: {
        status: "processing",
        type,
      },
    });
    ctx.body = [resultUID];
    resultStreams[resultId] = new PassThrough();
    strapi.service("api::analysis.results").processServiceAndStreamResults({
      service: analysisServices[type],
      strapi,
      config,
      stream: resultStreams[resultId],
      ctx,
      resultId,
    });
  },
  async getAvailableScripts(ctx) {
    return Object.keys(scripts);
  },
});
