import {
  generalizeAreaPointsController,
  GeneralizeAreaPointsControllerArgs,
} from "@rrrcn/services/src/controllers/generalize-area-points";
import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  async generalizeAreaPoints(ctx) {
    const args: GeneralizeAreaPointsControllerArgs = ctx.request.body; //TODO validate
    return await generalizeAreaPointsController(args);
  },
});
