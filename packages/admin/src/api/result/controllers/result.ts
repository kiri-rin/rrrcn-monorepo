/**
 * result controller
 */

import { factories } from "@strapi/strapi";
const fs = require("fs");

export default factories.createCoreController(
  "api::result.result",
  ({ strapi }) => ({
    async getResultArchive(ctx) {
      const { resultId } = ctx.params;
      //TODO validate previssions
      const resultService = strapi.service("api::result.result");

      const stream = fs.createReadStream(
        resultService.getResultFolder(resultId) + `.zip`
      );
      return stream;
    },
    async getLoadingInfo(ctx) {
      const { resultId } = ctx.params;
      ctx.set({
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      ctx.body = resultStreams[resultId as string];
    },
  })
);
