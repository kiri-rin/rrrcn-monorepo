import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Select } from "@mui/material";
import {
  GoogleMapObject,
  parseGeojson,
} from "../../../utils/geometry/map/useDrawGeojson";
import { Migration, SEASONS } from "../types";
import { MapDrawingContext } from "../../../components/map/MapEdit";
import { useMutation, useQuery, useQueryClient } from "react-query";
import type { GeneratedTrack } from "@rrrcn/services/src/controllers/migrations/types";
import { getFeaturesPolyline } from "../utils/map-objects";

type MigrationMapObjects = {
  mapObjects: GoogleMapObject[];
};
export type IndexedMigration = Migration & MigrationMapObjects;
export const MigrationsGeneratedTracks = () => {
  const mapObjectsRef = useRef<GoogleMapObject[]>([]);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const { showMapObjects, hideMapObjects } = useContext(MapDrawingContext);

  const { data: generatedMigrations } = useQuery<{
    generatedTracks: GeneratedTrack[];
  }>("migration-generated-tracks");

  useEffect(() => {
    if (generatedMigrations?.generatedTracks) {
      mapObjectsRef.current = (
        generatedMigrations.generatedTracks as unknown as GeneratedTrack[]
      ).map((it) =>
        getFeaturesPolyline(
          it.points
            .filter((_it) => _it.point)
            .map((_it) => ({
              type: "Feature",
              geometry: _it.point!.geometry,
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
      {generatedMigrations?.generatedTracks && (
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
            {/*<Button*/}
            {/*  onClick={() => {*/}
            {/*    hideMapObjects(mapObjectsRef.current);*/}
            {/*  }}*/}
            {/*>*/}
            {/*  Export*/}
            {/*</Button>*/}
          </div>
        </>
      )}
    </>
  );
};
