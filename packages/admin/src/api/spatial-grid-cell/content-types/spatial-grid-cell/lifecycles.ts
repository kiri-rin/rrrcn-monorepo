export default {
  async beforeCreate({ params }) {
    await strapi
      .service("api::spatial-grid.validate")
      .validateSpatialGridCreate(params.data);
  },
  async beforeUpdate({ params }) {
    // await strapi
    //   .service("api::spatial-grid.validate")
    //   .validateSpatialGridCreate(params.data);
  },
};
