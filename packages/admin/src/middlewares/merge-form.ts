import { isNumber } from "util";

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
  return async (context, next) => {
    context.request.fullBody = {};
    if (context.request.body) {
      for (let [key, value] of Object.entries(context.request.body)) {
        const newValue = isISOString(value)
          ? new Date(value as string)
          : Number.isFinite(Number(value))
          ? Number(value)
          : value;
        objectPath.set(context.request.fullBody, key, newValue);
      }
    }
    if (context.request.files) {
      for (let [key, value] of Object.entries(
        context.request.files as { [p: string]: { path: string } }
      )) {
        objectPath.set(context.request.fullBody, key, value.path);
      }
    }
    await next();
  };
};
