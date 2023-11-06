module.exports = {
  routes: [
    {
      method: "GET",
      path: "/result/download/:resultId",
      handler: "result.getResultArchive",
      config: {
        policies: [],
        prefix: "",
      },
    },
    {
      method: "GET",
      path: "/result/loading/:resultId",
      handler: "result.getLoadingInfo",
      config: {
        policies: [],
        prefix: "",
      },
    },
  ],
};
