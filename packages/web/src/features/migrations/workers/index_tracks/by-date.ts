import { Migration } from "../../types";
import { IndexedMigration } from "../../migrations";

export function indexTracksByDate(migration: Migration): Migration["years"] {
  return migration.geojson.features.reduce((acc, feature, index, array) => {
    const date = feature.properties.date;
    const currentMonth = date.getMonth();
    let currentYear =
      currentMonth === 11 ? date.getFullYear() + 1 : date.getFullYear();

    if (!acc[currentYear]) {
      acc[currentYear] = {};
    }
    switch (currentMonth) {
      case 11:
      case 0:
      case 1: {
        if (!acc[currentYear]?.winter) {
          acc[currentYear].winter = [index, index];
        }
        if (
          ![11, 0, 1].includes(array[index + 1]?.properties.date.getMonth())
        ) {
          acc[currentYear]!.winter![1] = index;
        }
        break;
      }
      case 2:
      case 3:
      case 4: {
        if (!acc[currentYear]?.spring) {
          acc[currentYear].spring = [index, index];
        }
        if (![2, 3, 4].includes(array[index + 1]?.properties.date.getMonth())) {
          acc[currentYear]!.spring![1] = index;
        }
        break;
      }
      case 5:
      case 6:
      case 7: {
        if (!acc[currentYear]?.summer) {
          acc[currentYear].summer = [index, index];
        }
        if (![5, 6, 7].includes(array[index + 1]?.properties.date.getMonth())) {
          acc[currentYear]!.summer![1] = index;
        }
        break;
      }
      case 8:
      case 9:
      case 10: {
        if (!acc[currentYear]?.autumn) {
          acc[currentYear].autumn = [index, index];
        }
        if (
          ![8, 9, 10].includes(array[index + 1]?.properties.date.getMonth())
        ) {
          acc[currentYear]!.autumn![1] = index;
        }
        break;
      }
    }
    return acc;
  }, {} as IndexedMigration["years"]);
}
export function indexTrackByYears(migration: Migration): Migration["years"] {
  return migration.geojson.features.reduce((acc, feature, index, array) => {
    const date = feature.properties.date;
    const currentMonth = date.getMonth();
    let currentYear =
      currentMonth === 11 ? date.getFullYear() + 1 : date.getFullYear();

    if (!acc[currentYear]) {
      acc[currentYear] = {};
    }
    return acc;
  }, {} as IndexedMigration["years"]);
}
