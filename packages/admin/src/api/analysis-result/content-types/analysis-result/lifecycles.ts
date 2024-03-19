import { inspect } from "util";

export default {
  async beforeCreate({ params }) {
    await strapi
      .service("api::spatial-grid.validate")
      .validateSpatialGridCreate(params.data);
  },
  async beforeUpdate({ params: { where, data } }) {
    const entity = await strapi.db
      .query("api::analysis-result.analysis-result")
      .findOne({ where, populate: ["spatial_grid", "species"] });
    const spatialGridId =
      data.spatial_grid?.connect?.[0]?.id ?? entity.spatial_grid?.id;
    if (
      !entity.published &&
      data.published &&
      entity.analysis_type === "vulnerability"
    ) {
      console.log({ spatialGridId });
      const spatialGridCells = await strapi.db
        .query("api::spatial-grid-cell.spatial-grid-cell")
        .findMany({
          where: {
            $and: [
              {
                spatial_grid: spatialGridId,
              },
              {
                bbox_left: {
                  $gte: data.bbox_left || entity.bbox_left,
                },
              },
              {
                bbox_right: {
                  $lte: data.bbox_right || entity.bbox_right,
                },
              },
              {
                bbox_top: {
                  $lte: data.bbox_top || entity.bbox_top,
                },
              },
              {
                bbox_bottom: {
                  $gte: data.bbox_bottom || entity.bbox_bottom,
                },
              },
            ],
          },
        });
      for (let cell of spatialGridCells) {
        console.log(cell, entity.id, entity.species.id);
        await strapi
          .service("api::vulnerability-info.vulnerability-info")
          .create({
            data: {
              spatial_grid_cell: cell.id,
              analysis_results: entity.id, //TODO unpublish logic
              species: entity.species.id,
              type: "wind",
              vulnerability: 3, //TODO  extract actual vulnerability from result
            },
          });
      }
    }
  },
};
