const eekey = require("../../ee-key.json");
export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  async register({ strapi }) {
    await new Promise((resolve, reject) => {
      ee.data.authenticateViaPrivateKey(
        eekey,
        async () => {
          ee.initialize(null, null, async () => {
            resolve(true);
          });
        },
        (r: string) => {
          reject(r);
        }
      );
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
declare global {
  //@ts-ignore
  let ee: any;
}
const ee = require("@google/earthengine");
//@ts-ignore
globalThis.ee = ee;
