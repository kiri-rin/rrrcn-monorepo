import { extractData } from "@rrrcn/services/src/controllers/extract-data/extract-data";
import { Strapi } from "@strapi/strapi";
import fs from "fs";
import util from "util";
const archiver = require("archiver");

module.exports = ({ strapi }: { strapi: Strapi }) => ({
  async processServiceAndStreamResults<
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
            await this.completeProcessingAnalysisRequest({
              resultId,
              analysis_data: res,
              logs,
            });
          });

          archive.pipe(output);
          archive.directory(tempFolderPath, false);
          archive.finalize();
          return res;
        })
        .catch(async (e) => {
          console.log(e);
          logs += e;
          await this.errorProcessingAnalysisRequest({
            resultId,
            logs,
          });
          stream.end(`id: error\ndata: ${e} \n\n`);
        });
    } catch (e) {
      fs.rmSync(tempFolderPath, { recursive: true });
      logs += e;
      await this.errorProcessingAnalysisRequest({
        resultId,
        logs,
      });
      stream.end(`id: error\ndata: ${e} \n\n`);
    }
  },
  async startProcessingAnalysisRequest({ userId, type }) {
    const resultService = strapi.service("api::result.result");

    return await resultService.create({
      data: {
        status: "processing",
        type,
        user: userId,
      },
    });
  },
  async completeProcessingAnalysisRequest({ resultId, analysis_data, logs }) {
    const resultService = strapi.service("api::result.result");
    const finishedResultService = strapi.service(
      "api::analysis-result.analysis-result"
    );

    const { type } = await resultService.update(resultId, {
      data: {
        status: "error",
        finished_at: new Date().toISOString(),
        logs,
      },
    });
    await finishedResultService.create({
      data: {
        finished_at: new Date().toISOString(),
        analysis_data,
        type,
        users_result: resultId,
        spatial_grid_cell: analysis_data?.meta?.spatial_grid_cell,
      },
    });
  },
  async errorProcessingAnalysisRequest({ resultId, logs }) {
    const resultService = strapi.service("api::result.result");

    await resultService.update(resultId, {
      data: {
        status: "error",
        finished_at: new Date().toISOString(),
        logs,
      },
    });
  },
});
