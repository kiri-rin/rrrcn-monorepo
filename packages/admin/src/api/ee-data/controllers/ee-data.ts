import { Strapi } from "@strapi/strapi";
import { Context, Request } from "koa";
import { DataExtractionConfig } from "@rrrcn/services/src/analytics_config_types";
import { exportFeatureCollectionsToCsv } from "@rrrcn/services/src/services/utils/points";
import { evaluateScriptResultsToFeaturesArray } from "@rrrcn/services/src/services/utils/ee-image";
import fsPromises from "fs/promises";
import fs from "fs";
import { extractData } from "@rrrcn/services/dist/src/controllers/extract-data/extract-data";
const archiver = require("archiver");
module.exports = ({ strapi }: { strapi: Strapi }) => ({
  async extractData(
    ctx: Context & { request: Request & { fullBody: DataExtractionConfig } }
  ) {
    const tempFolderPath = `./public/tmp/${new Date().getTime()}`;
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Sets the compression level.
    });
    ctx.body = archive;
    await extractData({
      ...ctx.request.fullBody,
      outputs: tempFolderPath,
    });
    console.log("Forming response");

    archive.on("close", () => {
      console.log("removing temp files");
      fs.rmdirSync(tempFolderPath, { recursive: true });
    });

    archive.directory(tempFolderPath);
    archive.finalize();
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
});
