import { Strapi } from "@strapi/strapi";
import { Context, Request } from "koa";
import {
  DataExtractionConfig,
  PopulationConfig,
  PopulationRandomGenerationConfigType,
} from "@rrrcn/services/src/analytics_config_types";

import fs from "fs";
import { extractData } from "@rrrcn/services/dist/src/controllers/extract-data/extract-data";
import scripts from "@rrrcn/services/dist/src/services/ee-data";
import util from "util";
import { randomForest } from "@rrrcn/services/dist/src/controllers/random-forest/random-forest";
import { RandomForestConfig } from "@rrrcn/services/dist/src/analytics_config_types";
import { populationEstimation } from "@rrrcn/services/dist/src/controllers/population-estimation";
import { evaluatePromisify } from "@rrrcn/services/dist/src/services/utils/ee-image";
const archiver = require("archiver");
const { PassThrough } = require("stream");
type GetDataBodyType = { type: "data"; config: DataExtractionConfig };
type RandomForestBodyType = {
  type: "random-forest";
  config: RandomForestConfig;
};
type PopulationEstimateBodyType = {
  type: "population";
  config: PopulationConfig;
};
type AnalysisBodyType =
  | GetDataBodyType
  | RandomForestBodyType
  | PopulationEstimateBodyType
  | [
      RandomForestBodyType,
      {
        type: "population";
        config: {
          type: "random-points";
          config: PopulationRandomGenerationConfigType;
        };
      }
    ];
const analysisServices = {
  data: extractData,
  "random-forest": randomForest,
  population: populationEstimation,
};
module.exports = ({ strapi }: { strapi: Strapi }) => ({
  async processAnalysis(
    ctx: Context & {
      request: Request & { fullBody: AnalysisBodyType };
    }
  ) {
    console.error(ctx.request.fullBody);
    const resultService = strapi.service("api::result.result");

    if (Array.isArray(ctx.request.fullBody)) {
      const [randomForestConfigBody, estimatePopulationConfigBody] =
        ctx.request.fullBody;
      const { id: rfResultId, uid: rfResultUID } = await resultService.create({
        data: {
          status: "processing",
          type: "random-forest",
        },
      });
      const { id: populationResultId, uid: populationResultUID } =
        await resultService.create({
          data: {
            status: "processing",
            type: "population",
          },
        });
      resultStreams[rfResultId] = new PassThrough();
      resultStreams[populationResultId] = new PassThrough();
      resultStreams[populationResultId].write(
        "data: waiting for random forest \n\n"
      );
      ctx.body = [rfResultUID, populationResultUID];
      console.error(
        analysisServices["random-forest"],
        analysisServices["population"]
      );

      processServiceAndStreamResults({
        service: analysisServices["random-forest"],
        strapi,
        config: randomForestConfigBody.config,
        stream: resultStreams[rfResultId],
        ctx,
        resultId: rfResultId,
      }).then(async (res) => {
        const region = res.classified_image.gte(50).reduceToVectors({
          scale: 500,
          geometry: res.regionOfInterest,
          geometryType: "polygon",
        });

        estimatePopulationConfigBody.config.config.presenceArea = {
          type: "computedObject",
          object: res.classified_image
            .gte(50)
            .selfMask()
            .reduceToVectors({
              scale: 500,
              geometry: res.regionOfInterest,
            })
            .geometry(1),
        };
        processServiceAndStreamResults({
          service: analysisServices["population"],
          strapi,
          config: estimatePopulationConfigBody.config,
          stream: resultStreams[populationResultId],
          ctx,
          resultId: populationResultId,
        });
      });
    } else {
      const { config, type } = ctx.request.fullBody;
      const { id: resultId, uid: resultUID } = await resultService.create({
        data: {
          status: "processing",
          type,
        },
      });
      ctx.body = [resultUID];
      resultStreams[resultId] = new PassThrough();
      processServiceAndStreamResults({
        service: analysisServices[type],
        strapi,
        config,
        stream: resultStreams[resultId],
        ctx,
        resultId,
      });
    }
  },
  async getAvailableScripts(ctx) {
    return Object.keys(scripts);
  },
});
async function processServiceAndStreamResults<
  T extends (...args) => any = typeof extractData
>({
  service,
  strapi,
  resultId,
  config,
  ctx,
  stream,
}: {
  strapi: Strapi;
  ctx;
  service: T;
  config: Parameters<T>[0];
  resultId: string;
  stream;
}): Promise<Awaited<ReturnType<T>>> {
  const resultService = strapi.service("api::result.result");
  let logs = "";
  const tempFolderPath = resultService.getResultFolder(resultId);

  try {
    const logsFileStream = fs.createWriteStream(tempFolderPath + "/logs.txt");
    stream.pipe(logsFileStream);
    fs.mkdirSync(tempFolderPath, { recursive: true });
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });

    ctx.state.logger = (...args: any[]) => {
      resultStreams[resultId].write(
        //TODO find out how it works in strapi
        "data: " + args.map((it) => it.toString()).join(" ") + "\n\n"
      );
      logs += args.map((it) => it.toString()).join(" ") + "\n\n";
    };
    return await service({
      ...config,
      outputs: tempFolderPath,
    })
      .then((res) => {
        const output = fs.createWriteStream(tempFolderPath + `.zip`);
        output.on("close", function () {
          stream.end("id: success\ndata: success \n\n");
        });
        archive.on("error", function (err) {
          console.error({ err });
          throw err;
        });
        archive.on("end", async () => {
          fs.rmSync(tempFolderPath, { recursive: true });
          const updated = await resultService.update(resultId, {
            data: {
              status: "completed",
              finished_at: new Date().toISOString(),
            },
          });
          console.error({ updated });
        });

        archive.pipe(output);
        archive.directory(tempFolderPath);
        archive.finalize();
        return res;
      })
      .catch(async (e) => {
        console.log(e);
        logs += e;
        const updated = await resultService.update(resultId, {
          data: {
            status: "error",
            finished_at: new Date().toISOString(),
            logs,
          },
        });
        stream.end(`id: error\ndata: ${e} \n\n`);
      });
  } catch (e) {
    fs.rmSync(tempFolderPath, { recursive: true });
    logs += e;
    await resultService.update(resultId, {
      data: {
        status: "error",
        finished_at: new Date().toISOString(),
        logs,
      },
    });
    stream.end(`id: error\ndata: ${e} \n\n`);
  }
}
