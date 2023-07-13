module.exports = {
  routes: [
    {
      method: "POST",
      path: "/migration/split-area",
      handler: "migration.splitArea",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
