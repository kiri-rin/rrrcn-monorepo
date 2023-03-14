import { Strapi } from "@strapi/strapi";
import { Context, Request } from "koa";
import { DataExtractionConfig } from "@rrrcn/services/src/analytics_config_types";

import fs from "fs";
import { extractData } from "@rrrcn/services/dist/src/controllers/extract-data/extract-data";
import scripts from "@rrrcn/services/dist/src/services/ee-data";
import util from "util";
const archiver = require("archiver");
const { PassThrough } = require("stream");
module.exports = ({ strapi }: { strapi: Strapi }) => ({
  async extractData(
    ctx: Context & { request: Request & { fullBody: DataExtractionConfig } }
  ) {
    const resultService = strapi.service("api::result.result");

    const { id: resultId } = await resultService.create({
      data: {
        status: "processing",
        type: "data",
      },
    });
    ctx.body = resultId;

    const tempFolderPath = resultService.getResultFolder(resultId);
    const output = fs.createWriteStream(tempFolderPath + `.zip`);

    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });
    const stream = new PassThrough();
    resultStreams[resultId] = stream;
    ctx.state.logger = (...args: any[]) => {
      resultStreams[resultId].write(
        "data: " + args.map((it) => it.toString()).join(" ") + "\n\n"
      );
    };
    output.on("close", function () {
      stream.end("id: success\ndata: success \n\n");
    });
    extractData({
      ...ctx.request.fullBody,
      outputs: tempFolderPath,
    })
      .then(() => {
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
      })
      .catch((e) => {
        stream.end("id: error\ndata: Error \n\n");
      });
  },
  async getAvailableScripts(ctx) {
    return Object.keys(scripts);
  },
});
