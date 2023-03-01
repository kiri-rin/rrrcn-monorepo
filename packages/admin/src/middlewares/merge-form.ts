const objectPath = require("object-path");
const isISOString = (input: any) => {
  //TODO refactor
  try {
    return new Date(input).toISOString() === input;
  } catch (e) {
    return false;
  }
};
module.exports = (config, { strapi }) => {
  return (context, next) => {
    context.request.fullBody = {};
    if (context.request.body) {
      for (let [key, value] of Object.entries(context.request.body)) {
        objectPath.set(
          context.request.fullBody,
          key,
          isISOString(value) ? new Date(value as string) : value
        );
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
