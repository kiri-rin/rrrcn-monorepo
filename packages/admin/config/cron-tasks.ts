// path: ./config/cron-tasks.js
import fs from "fs/promises";
const tickMinutes = 1; // Checking interval in minutes should be from 1 to 59

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

const cronLogic = async (strapi, fireDate) => {
  const currentDate = addMinutes(new Date(), -600);
  const expiredResults = await strapi.db.query("api::result.result").findMany({
    where: {
      status: "completed",
      finished_at: { $lt: currentDate.toISOString() },
    },
  });
  for (let { id } of expiredResults) {
    const folder = strapi.service("api::result.result").getResultFolder(id);
    try {
      fs.rm(folder, { recursive: true });
    } catch (e) {
      console.error(e);
    }
    try {
      fs.rm(folder + ".zip", { recursive: true });
    } catch (e) {
      console.error(e);
    }
  }
  await strapi.db.query("api::result.result").deleteMany({
    where: {
      status: "completed",

      finished_at: { $lt: currentDate.toISOString() },
    },
  });
};

module.exports = {
  /**
   * Cron job with timezone example.
   * Every tickMinutes for Asia/Novosibirsk timezone.
   * List of valid timezones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List
   */

  //Fix to every tickMinute
  myJob: {
    task: async ({ strapi }, fireDate) => {
      await cronLogic(strapi, fireDate); /* Add your own logic here */
    },
    options: {
      rule: `*/${tickMinutes} * * * *`,
      tz: "Asia/Novosibirsk",
    },
  },
};

/**
Cron format:

 *    *    *    *    *    *
 ┬    ┬    ┬    ┬    ┬    ┬
 │    │    │    │    │    |
 │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
 │    │    │    │    └───── month (1 - 12)
 │    │    │    └────────── day of month (1 - 31)
 │    │    └─────────────── hour (0 - 23)
 │    └──────────────────── minute (0 - 59)
 └───────────────────────── second (0 - 59, OPTIONAL)

 */
