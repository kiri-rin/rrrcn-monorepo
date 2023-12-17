import { Migration, SEASONS } from "../../types";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { IndexedMigration } from "../../migrations";
import { parseGeojson } from "../../../../utils/geometry/map/useDrawGeojson";
import { MapDrawingContext } from "../../../../components/map/MapEdit";
import {
  getMigrationPathsPolylines,
  getMigrationPolyline,
} from "../../utils/map-objects";
import { object } from "yup";
import { useMigrationSelectedItems } from "../../utils/selected-items-context";
export type MigrationTrackWithMap = {};
export function useMapTrack(migration: Migration) {
  const colorRef = useRef(getRandomColor());

  const { map, showMapObjects, hideMapObjects } = useContext(MapDrawingContext);
  const [shown, setShown] = useState(true);
  const [isInspect, setIsInspect] = useState(false);
  const [shownSeasonsMigrations, setShownSeasonsMigrations] = useState(
    new Set<string>()
  );
  const [shownSeasonsMigrationsPoints, setShownSeasonsMigrationsPoints] =
    useState(new Set<string>());
  const [mapObjects, setMapObjects] = useState(getMigrationMarkers(migration));
  const [polyline, setPolyline] = useState(
    getMigrationPolyline(migration, colorRef.current)
  );
  const pointsClickEventsListenerRef = useRef<google.maps.MapsEventListener[]>(
    []
  );
  const hideAllMarkers = useCallback(() => {
    setIsInspect(false);
    hideMapObjects(mapObjects);
  }, [hideMapObjects]);
  const showAllMarkers = useCallback(() => {
    setIsInspect(true);
    showMapObjects(mapObjects);
  }, [showMapObjects]);
  const hideTrack = useCallback(() => {
    setIsInspect(false);
    setShown(false);
    hideMapObjects([polyline]);
    hideAllMarkers();
  }, [hideMapObjects]);
  const showTrack = useCallback(() => {
    setShown(true);
    showMapObjects([polyline]);
  }, [showMapObjects]);
  const { setSelectedPoint, selectedPoint } = useMigrationSelectedItems();
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(
    null
  );
  const prevSelectedPointOpacity = useRef<number | null>(null);
  const showSeasonMigration = useCallback(
    (season: { year: string; season: SEASONS }) => {
      const seasonIndices = migration.years[season.year]?.[season.season];
      if (seasonIndices) {
        setShownSeasonsMigrations((prev) => {
          const newState = new Set(prev);
          newState.add(serializeMigrationSeason(season));
          return newState;
        });
        showMapObjects(mapObjects.slice(...seasonIndices));

        // showMapObjects(getMigrationPathsPolylines(migration, [seasonIndices]));
      }
    },
    [migration, showMapObjects]
  );
  const showSeasonMigrationPoints = useCallback(
    (season: { year: string; season: SEASONS }) => {
      const seasonIndices = migration.years[season.year]?.[season.season];
      if (seasonIndices) {
        setShownSeasonsMigrations((prev) => {
          const newState = new Set(prev);
          newState.add(serializeMigrationSeason(season));
          return newState;
        });
        showMapObjects(mapObjects.slice(...seasonIndices));
      }
    },
    [migration, showMapObjects]
  );
  const hideSeasonMigration = useCallback(
    (season: { year: string; season: SEASONS }) => {
      const seasonIndices = migration.years[season.year]?.[season.season];
      if (seasonIndices) {
        setShownSeasonsMigrations((prev) => {
          const newState = new Set(prev);
          newState.delete(serializeMigrationSeason(season));
          return newState;
        });
        hideMapObjects(mapObjects.slice(...seasonIndices));
      }
    },
    [migration, showMapObjects]
  );
  useEffect(() => {
    if (shown) {
      showTrack();
      setShownSeasonsMigrations(
        new Set(
          Object.entries(migration.years).flatMap(([year, yearInfo]) =>
            Object.keys(yearInfo).map((it) =>
              serializeMigrationSeason({ year, season: it as SEASONS })
            )
          )
        )
      );
    }
    if (showAllMarkers) {
      showAllMarkers();
      setShownSeasonsMigrationsPoints(
        new Set(
          Object.entries(migration.years).flatMap(([year, yearInfo]) =>
            Object.keys(yearInfo).map((it) =>
              serializeMigrationSeason({ year, season: it as SEASONS })
            )
          )
        )
      );
    }
    mapObjects.map((it, index) => {
      setShown(false);
      setShownSeasonsMigrations(new Set());
      it.setOpacity(0.5);
      pointsClickEventsListenerRef.current.push(
        it.addListener("click", () => {
          setSelectedPoint(
            selectedPointIndex === index
              ? null
              : migration.geojson.features[index]
          );
          setSelectedPointIndex((prev) => (prev === index ? null : index));
        })
      );
    });
    return () => {
      pointsClickEventsListenerRef.current.forEach((it) => it.remove());
      pointsClickEventsListenerRef.current = [];
      hideTrack();
      setShownSeasonsMigrations(new Set());
      setShownSeasonsMigrationsPoints(new Set());
    };
  }, [mapObjects]);

  useEffect(() => {
    if (selectedPointIndex) {
      prevSelectedPointOpacity.current =
        mapObjects[selectedPointIndex].getOpacity() || null;
      mapObjects[selectedPointIndex].setOpacity(1);
      return () => {
        if (selectedPointIndex) {
          mapObjects[selectedPointIndex]?.setOpacity(
            prevSelectedPointOpacity.current || 0.5
          );
        }
      };
    }
  }, [selectedPointIndex]);

  return {
    hideAllMarkers,
    showAllMarkers,
    hideTrack,
    showTrack,
    isTrackShown: shown,
    isTrackMarkersShown: isInspect,
    shownSeasonsMigrations,
    shownSeasonsMigrationsPoints,
    showSeasonMigration,
    showSeasonMigrationPoints,
    hideSeasonMigration,
  };
}

export const serializeMigrationSeason = (season: {
  year: string;
  season: SEASONS;
}) => `${season.year}_${season.season}`;
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
export const getMigrationMarkers = (
  migration: Migration
): google.maps.Marker[] => {
  return parseGeojson(migration.geojson).map((_it, index) => {
    (_it as google.maps.Marker).setTitle(
      String(migration.geojson.features[index].properties?.date)
    );
    return _it;
  }) as google.maps.Marker[];
};
