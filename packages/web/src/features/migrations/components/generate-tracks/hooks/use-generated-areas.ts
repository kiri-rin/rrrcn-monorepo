import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  GoogleMapObject,
  parseGeojson,
} from "../../../../../utils/geometry/map/useDrawGeojson";
import { MapDrawingContext } from "../../../../../components/map/MapEdit";
import { useMutation, useQuery } from "react-query";
import { GenerateTracksResponse } from "@rrrcn/services/src/controllers/migrations/types";
import { useMigrationSelectedItems } from "../../../context/selected-items";

export const useGeneratedAreas = () => {
  const mapObjectsRef = useRef<GoogleMapObject[]>([]);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const { showMapObjects, hideMapObjects } = useContext(MapDrawingContext);
  const [shown, setShown] = useState(false);
  const [indexedAreasShown, setIndexedShownAreas] = useState(false);
  const { data: generatedMigrations } = useQuery<GenerateTracksResponse>(
    "migration-generated-tracks"
  );

  const showAreas = useCallback(() => {
    showMapObjects(mapObjectsRef.current);
    setShown(true);
  }, [mapObjectsRef.current]);
  const hideAreas = useCallback(() => {
    hideMapObjects(mapObjectsRef.current);
    setShown(false);
  }, [mapObjectsRef.current]);
  const showIndexedAreas = useCallback(() => {
    mapObjectsRef.current.forEach(
      (it, index) =>
        generatedMigrations?.indexedAreas[index] &&
        it.setOptions({
          fillColor: "blue",
        })
    );
    setIndexedShownAreas(true);
  }, [mapObjectsRef, generatedMigrations]);
  const hideIndexedAreas = useCallback(() => {
    mapObjectsRef.current.forEach((it, index) =>
      it.setOptions({
        fillColor: index === selectedBBox?.index ? "red" : "black",
      })
    );
    setIndexedShownAreas(false);
  }, [mapObjectsRef, generatedMigrations]);
  const { selectedBBox, setSelectedBBox } = useMigrationSelectedItems();

  useEffect(() => {
    selectedBBox !== null &&
      mapObjectsRef.current[selectedBBox.index]?.setOptions({
        fillColor: "red",
      });
    return () => {
      selectedBBox !== null &&
        mapObjectsRef.current[selectedBBox.index]?.setOptions({
          fillColor: "black",
        });
    };
  }, [selectedBBox, mapObjectsRef]);
  useEffect(() => {
    if (generatedMigrations) {
      mapObjectsRef.current = parseGeojson(generatedMigrations.grid);
      mapObjectsRef.current.forEach((polygon, index) => {
        listenersRef.current.push(
          polygon.addListener("click", () => {
            setSelectedBBox((prev) =>
              prev?.index !== index
                ? {
                    ...generatedMigrations.indexedAreas[index],
                    index: index,
                  }
                : null
            );
          })
        );
      });
      showMapObjects(mapObjectsRef.current);
      setShown(true);
      showIndexedAreas();
    }

    return () => {
      setSelectedBBox(null);

      listenersRef.current.forEach((listener) => {
        listener.remove();
      });
      hideMapObjects(mapObjectsRef.current);
      mapObjectsRef.current = [];
    };
  }, [generatedMigrations]);
  return {
    showAreas,
    hideAreas,
    shown,
    indexedAreasShown,
    showIndexedAreas,
    hideIndexedAreas,
    mapObjectsRef,
    areas: generatedMigrations?.grid,
    indexedAreas: generatedMigrations?.indexedAreas,
  };
};

export const useGeneratedIndexedAreas = () => {
  const mapObjectsRef = useRef<GoogleMapObject[]>([]);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const { showMapObjects, hideMapObjects } = useContext(MapDrawingContext);
  const [shown, setShown] = useState(false);
  const { data: generatedMigrations } = useQuery<GenerateTracksResponse>(
    "migration-generated-tracks"
  );
  const showAreas = useCallback(() => {
    showMapObjects(mapObjectsRef.current);
    setShown(true);
  }, [mapObjectsRef]);
  const hideAreas = useCallback(() => {
    hideMapObjects(mapObjectsRef.current);
    setShown(false);
  }, [mapObjectsRef]);
  const { selectedBBox, setSelectedBBox } = useMigrationSelectedItems();

  useEffect(() => {
    selectedBBox !== null &&
      mapObjectsRef.current[selectedBBox.index]?.setOptions({
        fillColor: "red",
      });
    return () => {
      selectedBBox !== null &&
        mapObjectsRef.current[selectedBBox.index]?.setOptions({
          fillColor: "black",
        });
    };
  }, [selectedBBox]);
  useEffect(() => {
    if (generatedMigrations) {
      mapObjectsRef.current = parseGeojson(generatedMigrations.grid);
      mapObjectsRef.current.forEach((polygon, index) => {
        listenersRef.current.push(
          polygon.addListener("click", () => {
            setSelectedBBox(
              selectedBBox?.index !== index
                ? {
                    ...generatedMigrations.indexedAreas[index],
                    index: index,
                  }
                : null
            );
          })
        );
      });
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
  return {
    showAreas,
    hideAreas,
    shown,
    areas: generatedMigrations?.grid,
  };
};
