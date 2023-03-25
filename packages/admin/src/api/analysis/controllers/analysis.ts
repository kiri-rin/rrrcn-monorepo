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

module.exports = ({ strapi }: { strapi: Strapi }) => ({
  async processAnalysis(
    ctx: Context & {
      request: Request & { fullBody: AnalysisBodyType };
    }
  ) {
    const resultService = strapi.service("api::result.result");

    const { config, type } = ctx.request.fullBody;
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
  try {
    const resultService = strapi.service("api::result.result");

    const tempFolderPath = resultService.getResultFolder(resultId);

    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });

    ctx.state.logger = (...args: any[]) => {
      resultStreams[resultId].write(
        //TODO find out how it works in strapi
        "data: " + args.map((it) => it.toString()).join(" ") + "\n\n"
      );
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
  } catch (e) {
    stream.end(`id: error\ndata: ${e} \n\n`);
  }
}
