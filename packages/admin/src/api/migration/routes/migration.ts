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
    {
      method: "POST",
      path: "/migration/generate-tracks",
      handler: "migration.generateTracks",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
