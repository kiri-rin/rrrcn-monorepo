import { Migration, MigrationPointProperties, SEASONS } from "../../types";
import { indexTracksByDate } from "./by-date";
import { Point } from "geojson";
import { distance } from "@turf/turf";

const autumnStartPeriod = [];
const springStartPeriod = [];
export function indexTracksByDailyDistances(
  migration: Migration
): Migration["years"] {
  const indexedByDate = indexTracksByDate(migration);
  const years: Migration["years"] = {};
  Object.entries(indexedByDate)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .forEach(([year, yearInfo], index) => {
      const autumnStartPeriod = [
        yearInfo[SEASONS.SUMMER]?.[0] ?? yearInfo[SEASONS.AUTUMN]?.[0],
        yearInfo[SEASONS.AUTUMN]?.[1],
      ].filter((it) => it !== undefined && String(it) !== "NaN") as number[];
      const springStartPeriod = [
        yearInfo[SEASONS.WINTER]?.[0] ?? yearInfo[SEASONS.SPRING]?.[0],
        yearInfo[SEASONS.SPRING]?.[1],
      ].filter((it) => it !== undefined && String(it) !== "NaN") as number[];
      const summerEnd = yearInfo[SEASONS.SUMMER]?.[1];
      const winterEnd = years[String(Number(year) + 1)]?.[SEASONS.WINTER]?.[1];
      years[year] = {};
      if (!index) {
      }

      if ((springStartPeriod.length = 2)) {
        let migrationFeatures = migration.geojson.features.slice(
          ...springStartPeriod
        );
        let end = false;
        let prevEnd = 0;
        let totalSpringStart: number | undefined;
        while (!end) {
          const springStart =
            findAutumnMigrationStart(migrationFeatures) +
            (prevEnd || springStartPeriod[0]);
          if (typeof totalSpringStart === "undefined") {
            totalSpringStart = springStart;
          }

          let springEnd = findAutumnMigrationEnd(
            migration.geojson.features.slice(springStart, summerEnd)
          );
          if (!springEnd && prevEnd) {
            break;
          } else {
            springEnd = springEnd
              ? springEnd + springStart
              : summerEnd || migration.geojson.features.length - 1;
          }
          if (String(springStart) === "NaN" || String(springEnd) === "NaN") {
            break;
          }
          if (springEnd >= springStartPeriod[1]) {
            prevEnd = springEnd;
            break;
          } else {
            const farthestDistance = migration.geojson.features
              .slice(springStart, springEnd)
              .reduce((acc, it) => {
                return Math.max(
                  distance(
                    it.geometry,
                    migration.geojson.features[springStart!].geometry
                  ),
                  acc
                );
              }, 0);
            const startEndDistance = distance(
              migration.geojson.features[springEnd!].geometry,
              migration.geojson.features[springStart!].geometry
            );
            if (farthestDistance && startEndDistance / farthestDistance > 0.5) {
            } else {
              totalSpringStart = undefined;
            }
            migrationFeatures = migration.geojson.features.slice(
              springEnd,
              springStartPeriod[1]
            );
            prevEnd = springEnd;
          }
        }
        if (totalSpringStart && prevEnd) {
          years[year][SEASONS.SPRING] = [totalSpringStart!, prevEnd];
        }
      }

      if ((autumnStartPeriod.length = 2)) {
        let migrationFeatures = migration.geojson.features.slice(
          ...autumnStartPeriod
        );
        let end = false;
        let prevEnd = 0;
        let totalAutumnStart: number | undefined;
        while (!end) {
          const autumnStart =
            findAutumnMigrationStart(migrationFeatures) +
            (prevEnd || autumnStartPeriod[0]);
          if (typeof totalAutumnStart === "undefined") {
            totalAutumnStart = autumnStart;
          }
          let autumnEnd = findAutumnMigrationEnd(
            migration.geojson.features.slice(autumnStart, winterEnd)
          );
          if (!autumnEnd && prevEnd) {
            break;
          } else {
            autumnEnd = autumnEnd
              ? autumnEnd + autumnStart
              : winterEnd || migration.geojson.features.length - 1;
          }
          if (String(autumnStart) === "NaN" || String(autumnEnd) === "NaN") {
            break;
          }
          if (autumnEnd >= autumnStartPeriod[1]) {
            prevEnd = autumnEnd;
            break;
          } else {
            const farthestDistance = migration.geojson.features
              .slice(autumnStart, autumnEnd)
              .reduce((acc, it) => {
                return Math.max(
                  distance(
                    it.geometry,
                    migration.geojson.features[autumnStart!].geometry
                  ),
                  acc
                );
              }, 0);
            const startEndDistance = distance(
              migration.geojson.features[autumnEnd!].geometry,
              migration.geojson.features[autumnStart!].geometry
            );
            if (farthestDistance && startEndDistance / farthestDistance > 0.5) {
            } else {
              totalAutumnStart = undefined;
            }
            prevEnd = autumnEnd;

            migrationFeatures = migration.geojson.features.slice(
              prevEnd,
              autumnStartPeriod[1]
            );
          }
        }
        if (totalAutumnStart && prevEnd) {
          years[year][SEASONS.AUTUMN] = [totalAutumnStart!, prevEnd];
        }
      }

      if (years[year][SEASONS.AUTUMN] && years[year][SEASONS.SPRING]) {
        years[year][SEASONS.SUMMER] = [
          years[year][SEASONS.SPRING]![1],
          years[year][SEASONS.AUTUMN]![0],
        ];
      }
      if (
        years[String(Number(year) - 1)]?.[SEASONS.AUTUMN] &&
        years[year][SEASONS.SPRING]
      ) {
        years[year][SEASONS.WINTER] = [
          years[String(Number(year) - 1)][SEASONS.AUTUMN]![1],
          years[year][SEASONS.SPRING]![0],
        ];
      }

      // const springStartPeriod = [
      //   yearInfo[SEASONS.WINTER]?.[0] || yearInfo[SEASONS.SPRING]?.[0],
      //   yearInfo[SEASONS.SPRING]?.[1],
      // ].filter((it) => it);
      // if ((autumnStartPeriod.length = 2)) {
      //   return;
      // }
    });
  return years;
}
function findAutumnMigrationStart(
  migration: Migration["geojson"]["features"]
): number {
  const features = migration;
  let averageDistances: number | undefined;
  let resultIndex = 0;

  for (let i = 1; i < features.length; i++) {
    let currentAverageDistances = 0;
    let prevDayFeatureIndex: number = i;
    let daysCount = 0;
    for (let j = 0; j < 5; j++) {
      const [nextDayFeature, nextDateDifferenceInDays] =
        findNextDayFeatureIndex(features, prevDayFeatureIndex) || [];
      if (nextDayFeature) {
        daysCount += nextDateDifferenceInDays;
        currentAverageDistances += distanceBetweenPoints(
          features[prevDayFeatureIndex].geometry,
          features[nextDayFeature].geometry
        );
        prevDayFeatureIndex = nextDayFeature;
      } else {
        break;
      }
    }
    if (daysCount) {
      currentAverageDistances = currentAverageDistances / daysCount;
    } else {
      break;
    }
    if (averageDistances !== undefined) {
      if (currentAverageDistances > averageDistances * 8) {
        resultIndex = i;
        break;
      }
    }
    averageDistances = currentAverageDistances;
    i = prevDayFeatureIndex;
  }
  return resultIndex;
}
function findAutumnMigrationEnd(
  migration: Migration["geojson"]["features"]
): number {
  const features = migration;
  let averageDistances: number | undefined;
  let resultIndex = 0;
  for (let i = 0; i < features.length; ) {
    let currentAverageDistances = 0;
    let prevDayFeatureIndex: number = i;
    let daysCount = 0;
    for (let j = 0; j < 5; j++) {
      const [nextDayFeature, nextDateDifferenceInDays] =
        findNextDayFeatureIndex(features, prevDayFeatureIndex) || [];
      if (nextDayFeature) {
        daysCount += nextDateDifferenceInDays;
        currentAverageDistances += distanceBetweenPoints(
          features[prevDayFeatureIndex].geometry,
          features[nextDayFeature].geometry
        );
        prevDayFeatureIndex = nextDayFeature;
      } else {
        break;
      }
    }
    if (daysCount) {
      currentAverageDistances = currentAverageDistances / daysCount;
    } else {
      break;
    }
    if (averageDistances !== undefined) {
      if (currentAverageDistances * 3 < averageDistances) {
        resultIndex = i;
        break;
      }
    }
    averageDistances = currentAverageDistances;
    i = prevDayFeatureIndex;
  }

  return resultIndex;
}
const distanceBetweenPoints = (a: GeoJSON.Point, b: GeoJSON.Point) => {
  const x =
    a.coordinates[0] * a.coordinates[0] - b.coordinates[0] * b.coordinates[0];
  const y =
    a.coordinates[1] * a.coordinates[1] - b.coordinates[1] * b.coordinates[1];
  return Math.sqrt(x * x + y * y);
};
function findNextDayFeatureIndex(
  features: GeoJSON.Feature<GeoJSON.Point, MigrationPointProperties>[],
  index: number = 0
) {
  let prevDayFeature: GeoJSON.Feature<GeoJSON.Point, MigrationPointProperties> =
    features[index];
  for (let i = index + 1; i < features.length; i++) {
    const dateDifferenceInDays =
      (features[i].properties.date.getTime() -
        prevDayFeature.properties.date.getTime()) /
      (1000 * 60 * 60 * 24);
    if (dateDifferenceInDays > 1) {
      return [i, dateDifferenceInDays];
    }
  }
}
