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
  ],
};
