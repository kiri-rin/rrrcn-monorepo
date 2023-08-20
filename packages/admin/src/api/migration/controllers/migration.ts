import { Strapi } from "@strapi/strapi";
import { Context, Request } from "koa";
import {
  SplitMigrationAreaConfigType,
  SplitMigrationsArea,
} from "@rrrcn/services/dist/src/controllers/migrations/split-area";
import {
  GeneratedTrack,
  MigrationGenerationConfigType,
} from "@rrrcn/services/dist/src/controllers/migrations/types";
import { generateMigrationTracks } from "@rrrcn/services/dist/src/controllers/migrations/generate-tracks";
module.exports = ({ strapi }: { strapi: Strapi }) => ({
  async splitArea(
    ctx: Context & {
      request: Request & { body: SplitMigrationAreaConfigType };
    }
  ) {
    return SplitMigrationsArea(ctx.request.body);
  },
  async generateTracks(
    ctx: Context & {
      request: Request & { body: MigrationGenerationConfigType };
    }
  ) {
    return generateMigrationTracks(ctx.request.body);
  },
});
