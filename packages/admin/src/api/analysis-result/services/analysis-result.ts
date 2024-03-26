/**
 * analysis-result service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService<{ publishResult: any }>(
  "api::analysis-result.analysis-result",
  ({ strapi }) => ({
    publishResult(resultId) {},
  })
);
