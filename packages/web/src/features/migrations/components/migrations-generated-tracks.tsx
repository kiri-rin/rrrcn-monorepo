import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Select } from "@mui/material";
import {
  GoogleMapObject,
  parseGeojson,
} from "../../../utils/geometry/map/useDrawGeojson";
import { GeoJSON } from "geojson";
import { Migration, SEASONS } from "../types";
import { MapDrawingContext } from "../../../components/map/MapEdit";
import { ParamsImageInput } from "../../../components/params-image-input";
import { useMutation, useQuery, useQueryClient } from "react-query";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { api } from "../../../api";
import { SelectedSeasonsType } from "../migrations";
import { GeneratedTrack } from "@rrrcn/services/dist/src/controllers/migrations/types";
import {
  getFeaturesPolyline,
  getMigrationPathsPolylines,
} from "../utils/map-objects";

type MigrationMapObjects = {
  mapObjects: GoogleMapObject[];
};
export type IndexedMigration = Migration & MigrationMapObjects;
export const MigrationsGeneratedTracks = () => {
  const mapObjectsRef = useRef<GoogleMapObject[]>([]);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const { showMapObjects, hideMapObjects } = useContext(MapDrawingContext);

  const { data: generatedMigrations } = useQuery("migration-generated-tracks");

  useEffect(() => {
    console.log({ generatedMigrations });
    if (generatedMigrations) {
      mapObjectsRef.current = (
        generatedMigrations as unknown as GeneratedTrack[]
      ).map((it) =>
        getFeaturesPolyline(
          it.points
            .filter((_it) => _it.point)
            .map((_it) => ({
              type: "Feature",
              geometry: _it.point!,
              properties: {},
            }))
        )
      );

      showMapObjects(mapObjectsRef.current);
    }

    return () => {
      listenersRef.current.forEach((listener) => {
        listener.remove();
      });
      hideMapObjects(mapObjectsRef.current);
      mapObjectsRef.current = [];
    };
  }, [generatedMigrations]);

  return (
    <>
      {generatedMigrations && (
        <>
          Generated Tracks
          <div>
            <Button
              onClick={() => {
                showMapObjects(mapObjectsRef.current);
              }}
            >
              Show
            </Button>
            <Button
              onClick={() => {
                hideMapObjects(mapObjectsRef.current);
              }}
            >
              Hide
            </Button>
            <Button
              onClick={() => {
                hideMapObjects(mapObjectsRef.current);
              }}
            >
              Export
            </Button>
          </div>
        </>
      )}
    </>
  );
};
const reduceMigrations = (migrations: IndexedMigration[]) => {
  return migrations.reduce((acc, migr) => {
    Object.entries(migr.years).forEach(([year, yearInfo]) => {
      if (!acc[year]) {
        acc[year] = {};
      }
      Object.values(SEASONS).forEach((season) => {
        if (yearInfo[season]) {
          acc[year][season] = acc[year][season] ? acc[year][season]++ : 1;
        }
      });
    });
    return acc;
  }, {} as any);
};
const prepareSeasonsRequest = (
  migrations: IndexedMigration[],
  seasons: SelectedSeasonsType
) => {
  const res: { migrations: { geojson: GeoJSON.FeatureCollection }[] } = {
    migrations: [],
  };
  Object.entries(seasons).forEach(([year, yearSeasons]) => {
    Object.entries(yearSeasons).forEach(([season, active]) => {
      if (active) {
        migrations.forEach(({ geojson, years }, index) => {
          const currentMigrationSeason = years[year]?.[season as SEASONS];
          if (currentMigrationSeason) {
            if (!res.migrations[index]) {
              res.migrations[index] = {
                geojson: { type: "FeatureCollection", features: [] },
              };
            }
            res.migrations[index].geojson.features.push(
              ...geojson.features.slice(...currentMigrationSeason)
            );
          }
        });
      }
    });
  });
  res.migrations = res.migrations.filter((it) => it);
  return res;
};
export const prepareGenerateRequest = (
  migrations: IndexedMigration[],
  selectedSeasons: any,
  grid: any
) => {
  const res = prepareSeasonsRequest(migrations, selectedSeasons);
  //@ts-ignore
  res.allAreas = grid;
  return res;
};
