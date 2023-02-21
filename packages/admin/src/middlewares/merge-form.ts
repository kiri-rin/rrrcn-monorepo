const objectPath = require("object-path");
module.exports = (config, { strapi }) => {
  return (context, next) => {
    context.request.fullBody = {};
    if (context.request.body) {
      for (let [key, value] of Object.entries(context.request.body)) {
        objectPath.set(context.request.fullBody, key, value);
      }
    }
    if (context.request.files) {
      for (let [key, value] of Object.entries(
        context.request.files as { [p: string]: { path: string } }
      )) {
        objectPath.set(context.request.fullBody, key, value.path);
      }
    }
    next();
  };
};
