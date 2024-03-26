module.exports = {
  routes: [
    {
      method: "POST",
      path: "/spatial-services/generalize-area-points",
      handler: "spatial-services.generalizeAreaPoints",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
