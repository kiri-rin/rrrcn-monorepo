import { Strapi } from "@strapi/strapi";
import { Context, Request } from "koa";
import { RandomForestConfig } from "@rrrcn/services/dist/src/analytics_config_types";
import fs from "fs";
import { extractData } from "@rrrcn/services/dist/src/controllers/extract-data/extract-data";
import { randomForest } from "@rrrcn/services/dist/src/controllers/random-forest/random-forest";
const archiver = require("archiver");
const { PassThrough } = require("stream");
module.exports = ({ strapi }: { strapi: Strapi }) => ({
  async randomForest(
    ctx: Context & { request: Request & { fullBody: RandomForestConfig } }
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
    // ctx.state.logger = (...args: any[]) => {
    //   console.error(...args);
    //
    //   resultStreams[resultId].write(
    //     "data: " + args.map((it) => it.toString()).join(" ") + "\n\n"
    //   );
    // };
    output.on("close", function () {
      stream.end("id: success\ndata: success \n\n");
    });
    randomForest({
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
        console.error(e);
        stream.end(`id: error\ndata: ${e} \n\n`);
      });
  },
});
