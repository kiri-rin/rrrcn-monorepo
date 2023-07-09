import { GeoJSON, GeoJsonProperties, Geometry } from "geojson";
export type MigrationYear = {
  meta?: any;
  title?: string;
  summer?: [number, number];
  autumn?: [number, number];
  winter?: [number, number];
  spring?: [number, number];
};
export type Migration = {
  meta?: {};
  title: string;
  geojson: GeoJSON.FeatureCollection<Geometry, { date: Date }>;
  years: { [year: number]: MigrationYear };
};
