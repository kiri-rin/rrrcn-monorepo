/**
 * spatial-grid controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::spatial-grid.spatial-grid",
  ({ strapi }) => ({
    async find(ctx) {
      const data = await strapi
        .service("api::spatial-grid.spatial-grid")
        .find(ctx.query);
      return data;
    },
  })
);
