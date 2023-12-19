import { IndexedMigration } from "../migrations";
import { SEASONS } from "../types";
import { Feature, FeatureCollection, Point } from "geojson";

export const getMigrationPolyline = (
  migration: IndexedMigration,
  color?: string
) =>
  getFeaturesPolyline(
    migration.geojson.features as Feature<Point, any>[],
    color
  );
export const getMigrationFreePaths = (migration: IndexedMigration) => {
  const pathsToHide = Object.entries(migration.years).flatMap(
    ([year, info]: [string, any]) =>
      Object.values(SEASONS)
        .map((season) => info[season])
        .filter((it) => it)
        .sort(([start1, end1], [start2, end2]) => start2 - start1)
  );
  return pathsToHide.length
    ? pathsToHide.reduce((acc, path, index, array) => {
        if (!index) {
          if (path[0] !== 0) {
            acc.push([0, path[0] - 1]);
          }
        }
        if (array[index + 1]) {
          acc.push([path[1], array[index + 1][0]]);
        } else {
          acc.push([path[1], migration.geojson.features.length - 1]);
        }
        return acc;
      }, [] as [number, number][])
    : [[0, migration.geojson.features.length - 1]];
};
export const getMigrationFreePathsPolylines = (migration: IndexedMigration) =>
  getMigrationPathsPolylines(migration, getMigrationFreePaths(migration));
export const getMigrationPathsMarkers = (
  migration: IndexedMigration,
  paths: [number, number][]
) => {};
export const getMigrationPathsPolylines = (
  migration: IndexedMigration,
  paths: [number, number][]
) => {
  return paths.map((path: [number, number]) =>
    getFeaturesPolyline(
      migration.geojson.features.slice(...path) as Feature<Point, any>[]
    )
  );
};
export const getFeaturesPolyline = (
  features: Feature<Point, any>[],
  color?: string
) =>
  new google.maps.Polyline({
    strokeColor: color,
    path: features.map((feature) => {
      const coord = (feature as Feature<Point>).geometry.coordinates;
      return {
        lat: coord[1],
        lng: coord[0],
      };
    }),
  });
