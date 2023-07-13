import { Strapi } from "@strapi/strapi";
import { Context, Request } from "koa";
import {
  SplitMigrationAreaConfigType,
  SplitMigrationsArea,
} from "@rrrcn/services/dist/src/controllers/migrations/split-area";
module.exports = ({ strapi }: { strapi: Strapi }) => ({
  async splitArea(
    ctx: Context & {
      request: Request & { body: SplitMigrationAreaConfigType };
    }
  ) {
    return SplitMigrationsArea(ctx.request.body);
  },
});
