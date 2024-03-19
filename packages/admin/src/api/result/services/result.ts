/**
 * result service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::result.result",
  ({ strapi }) => ({
    getResultFolder(resultId) {
      return `./public/tmp/${resultId}`;
    },
    getUsersResults(userId, params = {}) {
      return strapi.entityService.findPage("api::result.result", {
        ...params,
        filters: {
          ...(params.filters || {}),
          user: userId,
        },
      });
    },
  })
);
