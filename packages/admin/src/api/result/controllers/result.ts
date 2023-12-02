/**
 * result controller
 */

import { factories } from "@strapi/strapi";
const fs = require("fs");

export default factories.createCoreController(
  "api::result.result",
  ({ strapi }) => ({
    async getResultArchive(ctx) {
      const { resultId: resultUID } = ctx.params;
      console.log(resultUID);
      //TODO validate previssions
      const { id: resultId, ...result } = await strapi.db
        .query("api::result.result")
        .findOne({ where: { uid: resultUID } });
      console.log(resultId);
      if (result.status === "error") {
        console.log("This is error", result);
        return result.logs;
      }
      if (result.status !== "completed") {
        return "Loading";
      }
      const resultService = strapi.service("api::result.result");

      const stream = fs.createReadStream(
        resultService.getResultFolder(resultId) + `.zip`
      );
      ctx.set("Content-disposition", "attachment; filename=result.zip");
      ctx.body = stream;
    },
    async getLoadingInfo(ctx) {
      const { resultId: resultUID } = ctx.params;
      const { id: resultId } = await strapi.db
        .query("api::result.result")
        .findOne({ where: { uid: resultUID } });
      ctx.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      ctx.body = resultStreams[resultId as string];
    },
  })
);
