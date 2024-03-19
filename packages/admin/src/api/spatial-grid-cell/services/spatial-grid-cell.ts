/**
 * spatial-grid-cell service
 */
import * as turf from "@turf/turf";

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::spatial-grid-cell.spatial-grid-cell",
  ({ strapi }) => ({
    async createGridCells({ polygon, gridId, cell_size }) {
      const _polygon = turf.polygon(polygon);
      const bbox = turf.bbox(_polygon);
      const cellsFC = turf.squareGrid(bbox, cell_size, { mask: _polygon });
      for (let cell of cellsFC.features) {
        const cellBbox = turf.bbox(cell);
        strapi.service("api::spatial-grid-cell.spatial-grid-cell").create({
          data: {
            bbox_left: cellBbox[0],
            bbox_bottom: cellBbox[1],
            bbox_right: cellBbox[2],
            bbox_top: cellBbox[3],
            polygon: cell.geometry,
            spatial_grid: gridId,
          },
        });
      }
    },
    async recalculateVulnerability(id) {
      const vulnerabilities = await strapi.db
        .query("api::vulnerability-info.vulnerability-info")
        .findMany({
          where: { spatial_grid_cell: id },
          populate: ["spatial_grid_cell"],
        });
      const total_vulnerability =
        vulnerabilities.reduce((acc, it) => acc + it.vulnerability, 0) /
        (vulnerabilities.length || 1); //TODO actual algorithmn
      await strapi
        .service("api::spatial-grid-cell.spatial-grid-cell")
        .update(id, { data: { total_vulnerability } });
    },
  })
);
