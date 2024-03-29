const eekey = require("../../ee-key.json");
declare global {
  let strapiLogger: (...log: any) => any | undefined;
}
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
          console.log("REJECT IN AUTH GEE");
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
  bootstrap(/*{ strapi }*/) {
    const globalLog = console.log;
    //@ts-ignore
    globalThis.strapiLogger = (...args: any[]) => {
      try {
        //@ts-ignore
        const ctx = strapi.requestContext.get();

        const logger = ctx?.state?.logger;
        logger?.(...args);
      } catch (e) {
        console.log(e);
      }
    };

    //@ts-ignore
    // console.globalLog = globalLog;
    // console.log =
  },
};
declare global {
  //@ts-ignore
  let ee: any;
  let resultStreams: { [resultId: string]: WritableStreamDefaultWriter }; //TODO check types
}
const ee = require("@google/earthengine");
//@ts-ignore
globalThis.ee = ee;
//@ts-ignore
globalThis.resultStreams = {};
