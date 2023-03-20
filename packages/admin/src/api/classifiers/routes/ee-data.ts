module.exports = {
  routes: [
    {
      method: "POST",
      path: "/classifiers/randomForest",
      handler: "classifiers.randomForest",
      config: {
        policies: [],
        middlewares: ["global::merge-form"],
        prefix: "",
      },
    },
  ],
};
