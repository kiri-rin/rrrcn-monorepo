import { Strapi } from "@strapi/strapi";
import { Context, Request } from "koa";
import {
  SplitMigrationAreaConfigType,
  SplitMigrationsArea,
} from "@rrrcn/services/src/controllers/migrations/split-area";
import {
  GeneratedTrack,
  MigrationGenerationConfigType,
} from "@rrrcn/services/src/controllers/migrations/types";
import { generateMigrationTracks } from "@rrrcn/services/src/controllers/migrations/generate-tracks";

const { PassThrough } = require("stream");

module.exports = ({ strapi }: { strapi: Strapi }) => ({
  async splitArea(
    ctx: Context & {
      request: Request & { body: SplitMigrationAreaConfigType };
    }
  ) {
    const { grid } = await SplitMigrationsArea(ctx.request.body);
  },
  async generateTracks(
    ctx: Context & {
      request: Request & { body: MigrationGenerationConfigType };
    }
  ) {
    const resultService = strapi.service("api::result.result");
    const { grid } = await SplitMigrationsArea(ctx.request.body);

    const config = ctx.request.body;
    const { id: resultId, uid: resultUID } = await resultService.create({
      data: {
        status: "processing",
        type: "migrations",
      },
    });
    resultStreams[resultId] = new PassThrough();
    return strapi
      .service("api::analysis.results")
      .processServiceAndStreamResults({
        service: generateMigrationTracks,
        strapi,
        config,
        stream: resultStreams[resultId],
        ctx,
        resultId,
      });
  },
});
