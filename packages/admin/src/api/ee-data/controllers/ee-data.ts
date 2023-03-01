import { Strapi } from "@strapi/strapi";
import { Context, Request } from "koa";
import { DataExtractionConfig } from "@rrrcn/services/src/analytics_config_types";
import { exportFeatureCollectionsToCsv } from "@rrrcn/services/src/services/utils/points";
import { evaluateScriptResultsToFeaturesArray } from "@rrrcn/services/src/services/utils/ee-image";
import fsPromises from "fs/promises";
import fs from "fs";
import { extractData } from "@rrrcn/services/dist/src/controllers/extract-data/extract-data";
const archiver = require("archiver");
const util = require("util");
const { PassThrough } = require("stream");
const streams = {};
module.exports = ({ strapi }: { strapi: Strapi }) => ({
  async extractData(
    ctx: Context & { request: Request & { fullBody: DataExtractionConfig } }
  ) {
    const timestamp = new Date().getTime();
    const tempFolderPath = `./public/tmp/${new Date().getTime()}`;
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });

    const stream = new PassThrough();
    streams[timestamp] = stream;
    ctx.state.logger = (...args: any[]) => {
      streams[timestamp].write(
        "data: " + args.map((it) => it.toString()).join(" ") + "\n\n"
      );
    };
    console.error(util.inspect(ctx.request.fullBody, false, null, true));

    ctx.body = timestamp;
    extractData({
      ...ctx.request.fullBody,
      outputs: tempFolderPath,
    }).then(() => {
      stream.end();
      // archive.pipe(stream);
      // archive.on("end", () => {
      //   console.log("removing temp files");
      //   fs.rmdirSync(tempFolderPath, { recursive: true });
      // });
      // archive.directory(tempFolderPath);
      // archive.finalize().then(() => {
      //   console.log("removing temp files");
      //   fs.rmdirSync(tempFolderPath, { recursive: true });
      // });
    });

    // ctx.set({
    //   "Content-Type": "multipart/form-data",
    //   "Cache-Control": "no-cache",
    //   Connection: "keep-alive",
    // });
    // ctx.body = archive;

    // tar
    //   .c(
    //     // or tar.create
    //     {
    //       gzip: true,
    //     },
    //     [tempFolderPath]
    //   )
    //   .pipe(tempFolderPath + ".zip");
  },
  async getLoadingInfo(ctx) {
    const { timestamp } = ctx.query;
    ctx.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    ctx.body = streams[timestamp];
  },
});
