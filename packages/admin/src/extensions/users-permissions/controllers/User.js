const { parseMultipartData } = require("@strapi/utils");

module.exports = {
  async me(ctx) {
    const user = ctx.state.user;
    const result = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      ctx.state.user.id,
      { populate: ["role", "photo", "children"] }
    );
    return result;
  },
  async updateMe(ctx) {
    let user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized();
    }
    user = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      ctx.state.user.id,
      { populate: ["role", "photo", "children"] }
    );
    const body = ctx.request.body;
    const userData = JSON.parse(body.user);
    if (userData.username) {
      userData.email = userData.username + "disabled@wave909.com";
    }
    console.log(body);
    try {
      const { files: { files } = {} } = ctx.request;
      if (user.photo && userData.photo === null) {
        await strapi.plugins.upload.services.upload.remove(user.photo);
      }
      if (ctx.request.files && Object.keys(ctx.request.files).length) {
        if (user.photo) {
          await strapi.plugins.upload.services.upload.remove(user.photo);
        }
        userData.photo = await strapi.plugins.upload.services.upload.upload({
          data: {},
          files,
        });
      }
    } catch (e) {
      console.log(e);
    }

    return await strapi.entityService.update(
      "plugin::users-permissions.user",
      user.id,
      { data: userData, populate: ["photo", "role", "children"] }
    );
  },
};
