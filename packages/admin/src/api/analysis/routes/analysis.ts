module.exports = {
  routes: [
    {
      method: "POST",
      path: "/analysis/process",
      handler: "analysis.processAnalysis",
      config: {
        policies: [],
        middlewares: ["global::merge-form"],
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/analysis/scripts",
      handler: "analysis.getAvailableScripts",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
