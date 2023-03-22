import { Strapi } from "@strapi/strapi";
import { Context, Request } from "koa";
import { DataExtractionConfig } from "@rrrcn/services/src/analytics_config_types";

import fs from "fs";
import { extractData } from "@rrrcn/services/dist/src/controllers/extract-data/extract-data";
import scripts from "@rrrcn/services/dist/src/services/ee-data";
import util from "util";
import { randomForest } from "@rrrcn/services/dist/src/controllers/random-forest/random-forest";
import { RandomForestConfig } from "@rrrcn/services/dist/src/analytics_config_types";
const archiver = require("archiver");
const { PassThrough } = require("stream");
type GetDataBodyType = { type: "data"; config: DataExtractionConfig };
type RandomForestBodyType = {
  type: "random-forest";
  config: RandomForestConfig;
};
type AnalysisBodyType = GetDataBodyType | RandomForestBodyType;
type AnalysisConfigsArray =
  | [AnalysisBodyType]
  | [GetDataBodyType, RandomForestBodyType];

module.exports = ({ strapi }: { strapi: Strapi }) => ({
  async processAnalysis(
    ctx: Context & {
      request: Request & { fullBody: { configs: AnalysisConfigsArray } };
    }
  ) {
    const resultService = strapi.service("api::result.result");

    const { configs } = ctx.request.fullBody;
    console.log(configs);
    if (configs.length === 2) {
      const [dataConfig, rfConfig] = configs;

      const { id: dataResultId } = await resultService.create({
        data: {
          status: "processing",
          type: "data",
        },
      });

      const { id: rfResultId } = await resultService.create({
        data: {
          status: "processing",
          type: "data",
        },
      });
      ctx.body = [dataResultId, rfResultId];
      resultStreams[dataResultId] = new PassThrough();
      resultStreams[rfResultId] = new PassThrough();
      processServiceAndStreamResults({
        service: extractData,
        strapi,
        config: dataConfig.config,
        ctx,
        stream: resultStreams[dataResultId],
        resultId: dataResultId,
      }).then((res) => {
        processServiceAndStreamResults({
          service: (config: RandomForestConfig) =>
            randomForest({
              ...config,
              params: { type: "computedObject", object: res },
            }),
          ctx,
          stream: resultStreams[rfResultId],

          config: rfConfig.config,
          resultId: rfResultId,
          strapi,
        });
      });
    } else {
      const [{ config, type }] = configs;
      const { id: resultId } = await resultService.create({
        data: {
          status: "processing",
          type,
        },
      });
      ctx.body = [resultId];

      resultStreams[resultId] = new PassThrough();

      processServiceAndStreamResults({
        service: type === "data" ? extractData : randomForest,
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
}) {
  const resultService = strapi.service("api::result.result");

  const tempFolderPath = resultService.getResultFolder(resultId);
  const output = fs.createWriteStream(tempFolderPath + `.zip`);

  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });

  ctx.state.logger = (...args: any[]) => {
    resultStreams[resultId].write(
      //TODO find out how it works in strapi
      "data: " + args.map((it) => it.toString()).join(" ") + "\n\n"
    );
  };
  output.on("close", function () {
    stream.end("id: success\ndata: success \n\n");
  });
  return await service({
    ...config,
    outputs: tempFolderPath,
  })
    .then((res) => {
      archive.on("error", function (err) {
        throw err;
      });
      archive.on("end", async () => {
        fs.rmSync(tempFolderPath, { recursive: true });
        await resultService.update(resultId, {
          data: {
            status: "completed",
            finished_at: new Date().toISOString(),
          },
        });
      });

      archive.pipe(output);
      archive.directory(tempFolderPath);
      archive.finalize();
      return res;
    })
    .catch((e) => {
      stream.end(`id: error\ndata: ${e} \n\n`);
    });
}
