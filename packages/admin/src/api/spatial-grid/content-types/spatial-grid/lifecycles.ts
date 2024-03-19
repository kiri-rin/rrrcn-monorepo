export default {
  async beforeCreate({ params }) {
    await strapi
      .service("api::spatial-grid.validate")
      .validateSpatialGridCreate(params.data);
  },
  // async beforeUpdate({ params }) {
  //   await strapi
  //     .service("api::spatial-grid.validate")
  //     .validateSpatialGridCreate(params.data);
  // },
  async beforeDelete({ params: { where } }) {
    await strapi.db
      .query("api::spatial-grid-cell.spatial-grid-cell")
      .deleteMany({ where: { spatial_grid: where } });
  },
  async afterCreate({ params, result }) {
    await strapi
      .service("api::spatial-grid-cell.spatial-grid-cell")
      .createGridCells({
        polygon: result.polygon,
        gridId: result.id,
        cell_size: result.cell_size,
      });
  },
};
