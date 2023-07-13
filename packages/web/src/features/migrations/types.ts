import { GeoJSON, Geometry } from "geojson";
export enum SEASONS {
  SPRING = "spring",
  SUMMER = "summer",
  AUTUMN = "autumn",
  WINTER = "winter",
}

export type MigrationYear = {
  meta?: any;
  title?: string;

  [SEASONS.SUMMER]?: [number, number];
  [SEASONS.AUTUMN]?: [number, number];
  [SEASONS.WINTER]?: [number, number];
  [SEASONS.SPRING]?: [number, number];
};
export type Migration = {
  meta?: {};
  title: string;
  geojson: GeoJSON.FeatureCollection<Geometry, { date: Date }>;
  years: { [year: number]: MigrationYear };
};
