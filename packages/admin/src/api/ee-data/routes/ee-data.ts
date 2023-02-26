module.exports = {
  routes: [
    {
      method: "POST",
      path: "/ee-data/extract",
      handler: "ee-data.extractData",
      config: {
        policies: [],
        middlewares: ["global::merge-form"],
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/ee-data/loading",
      handler: "ee-data.getLoadingInfo",
      config: {
        policies: [],
        middlewares: ["global::merge-form"],
        prefix: "",
      },
    },
  ],
};
