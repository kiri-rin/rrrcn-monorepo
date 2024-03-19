/**
 * spatial-grid-cell controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::spatial-grid-cell.spatial-grid-cell",
  ({ strapi }) => ({
    async find(ctx) {
      const data = await strapi
        .service("api::spatial-grid-cell.spatial-grid-cell")
        .find(ctx.query);
      return data;
    },
  })
);
