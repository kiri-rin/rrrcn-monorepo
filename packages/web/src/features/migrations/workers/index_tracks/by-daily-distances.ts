import { Migration, MigrationPointProperties, SEASONS } from "../../types";
import { indexTracksByDate } from "./by-date";
import { Point } from "geojson";

const autumnStartPeriod = [];
const springStartPeriod = [];
export function indexTracksByDailyDistances(
  migration: Migration
): Migration["years"] {
  const indexedByDate = indexTracksByDate(migration);
  const years: Migration["years"] = {};
  Object.entries(indexedByDate).forEach(([year, yearInfo]) => {
    const autumnStartPeriod = [
      yearInfo[SEASONS.SUMMER]?.[0] || yearInfo[SEASONS.AUTUMN]?.[0],
      yearInfo[SEASONS.AUTUMN]?.[1],
    ].filter((it) => it !== undefined) as number[];
    years[year] = {};
    if ((autumnStartPeriod.length = 2)) {
      const autumnStart = findAutumnMigrationStart(
        migration,
        autumnStartPeriod as [number, number]
      );
      const autumnEnd = findAutumnMigrationEnd(migration, autumnStart);
      years[year][SEASONS.AUTUMN] = [autumnStart, autumnEnd];
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
  migration: Migration,
  autumnStartPeriod: [number, number]
): number {
  const features = migration.geojson.features.slice(...autumnStartPeriod);
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
  return resultIndex + autumnStartPeriod[0];
}
function findAutumnMigrationEnd(
  migration: Migration,
  autumnStartIndex: number
): number {
  const features = migration.geojson.features.slice(autumnStartIndex);
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
  return resultIndex + autumnStartIndex;
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
