import { IndexedMigration } from "../migrations";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Migration, MigrationYear, SEASONS } from "../types";
import { MapDrawingContext } from "../../../components/map/MapEdit";
import { BirdMigrationYear } from "./migration-year";
import { BirdMigrationSelectSeasonModal } from "./migration-select-season";
import {
  getMigrationFreePaths,
  getMigrationPathsPolylines,
  getMigrationPolyline,
} from "../utils/map-objects";
import { useMutation } from "react-query";
import { indexTracksWithWorker } from "../utils";
import { IndexTracksWorkerContext } from "../workers/context";
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export const TrackInfo = ({
  migration,
  onEditEnd,
  isEdit,
  filteredMigration,
  onChangeEditState,
}: {
  filteredMigration: IndexedMigration;
  migration: IndexedMigration;
  onEditEnd: (migration: IndexedMigration) => any;
  isEdit?: boolean;
  onChangeEditState: (arg: boolean) => any;
}) => {
  const [newSeasonMigration, setNewSeasonMigration] = useState<
    [number, number | null] | undefined
  >();
  const colorRef = useRef(getRandomColor());
  const clickListenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const mouseoverListenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const { map, showMapObjects, hideMapObjects } = useContext(MapDrawingContext);
  const fullPathRef = useRef<google.maps.Polyline | undefined>();
  const selectedPathRef = useRef<google.maps.Polyline | undefined>();
  const freePolylinesRef = useRef<google.maps.Polyline[]>([]);

  const pathsToShow = useMemo(
    () => getMigrationFreePaths(migration),
    [migration]
  );
  const [freePointsIndices, freeMarkers]: [number[], google.maps.Marker[]] =
    useMemo(() => {
      const freePointsIndices = pathsToShow.flatMap((path: [number, number]) =>
        migration.geojson.features
          .slice(...path)
          .map(({ properties: { index } }) => index as number)
      );
      return [
        freePointsIndices,
        freePointsIndices.map((it: number) => migration.mapObjects[it]),
      ];
    }, [migration]);

  useEffect(() => {
    freePolylinesRef.current = getMigrationPathsPolylines(
      migration,
      pathsToShow
    );
    fullPathRef.current = getMigrationPolyline(migration);
    return () => {
      fullPathRef.current && hideMapObjects([fullPathRef.current]);
      fullPathRef.current = undefined;
      hideMapObjects(migration.mapObjects);
      hideMapObjects(freePolylinesRef.current);
    };
  }, [migration]);

  const selectMarker = useCallback((markerIndex: number) => {
    setNewSeasonMigration((prev) => {
      if (!prev) {
        return [markerIndex, null];
      } else {
        if (prev[0] > markerIndex) {
          return prev;
        }
        return prev[0] !== markerIndex ? [prev[0], markerIndex] : undefined;
      }
    });
  }, []);
  const cancelEdit = useCallback(() => {
    setNewSeasonMigration(undefined);
    setShowSeasonModal(false);
    onChangeEditState(false);
  }, []);
  const finishEdit = useCallback(
    (year: number, season: SEASONS) => {
      const newMigration = { ...migration };
      if (!newMigration.years[year]) {
        newMigration.years[year] = {} as MigrationYear;
      }
      newMigration.years[year][season] = [
        ...(newSeasonMigration as [number, number]),
      ];
      onEditEnd(newMigration);
      setShowSeasonModal(false);
      setNewSeasonMigration(undefined);
      onChangeEditState(false);
    },
    [migration, onEditEnd, onChangeEditState, newSeasonMigration]
  );
  const onDeleteMigration = (year: number, season: SEASONS) => {
    const newMigration = { ...migration };
    newMigration.years = { ...newMigration.years };
    newMigration.years[year] = { ...newMigration.years[year] };
    delete newMigration.years[year][season];

    onEditEnd(newMigration);
  };

  const setSelectedMarkersOpacity = useCallback(
    (path?: [number, number | null]) => {
      selectedPathRef.current?.setMap(null);
      selectedPathRef.current = undefined;

      if (!path) {
        freeMarkers.forEach((it) => it.setOpacity(isEdit ? 0.5 : 1));
      } else {
        if (!path[1]) {
          migration.mapObjects[path[0]].setOpacity(1);
          migration.mapObjects
            .slice(0, path[0])
            .forEach((it) => it.setOpacity(0));
        } else {
          migration.mapObjects
            .slice(...(path as [number, number]))
            .forEach((it) => it.setOpacity(1));

          const [selectedPathPolyline] = getMigrationPathsPolylines(migration, [
            path as [number, number],
          ]);
          selectedPathPolyline.setOptions({ strokeColor: "red", zIndex: 1000 });
          selectedPathPolyline.setMap(map || null);
          selectedPathRef.current = selectedPathPolyline;
        }
      }
    },
    [migration]
  );
  const addMarkersClickListeners = useCallback(
    (markers: google.maps.Marker[], pointsIndices: number[]) => {
      markers.forEach((shape, index) => {
        const clickHandler = shape.addListener("click", () =>
          selectMarker(pointsIndices[index])
        );
        clickListenersRef.current.push(clickHandler);
      });
    },
    []
  );
  useEffect(() => {
    if (isEdit) {
      showMapObjects(freePolylinesRef.current);
      // showFreePaths()
      fullPathRef.current && hideMapObjects([fullPathRef.current]);
      showMapObjects(freeMarkers);
      addMarkersClickListeners(freeMarkers, freePointsIndices);
    } else {
      hideMapObjects(freeMarkers);
      hideMapObjects(freePolylinesRef.current);

      fullPathRef.current && showMapObjects([fullPathRef.current]);
      // showMapObjects(migration.mapObjects);
    }
    return () => {
      clickListenersRef.current.forEach((listener) => {
        listener.remove();
      });
      clickListenersRef.current = [];
    };
  }, [isEdit, migration]);

  useEffect(() => {
    if (isEdit) {
      freeMarkers.forEach((marker, index) => {
        const overListener = marker.addListener("mouseover", () => {
          setSelectedMarkersOpacity(
            newSeasonMigration && [
              newSeasonMigration[0],
              freePointsIndices[index],
            ]
          );
        });
        const outListener = marker.addListener("mouseout", () => {
          if (newSeasonMigration?.[0]) {
            migration.mapObjects[freePointsIndices[index]].setOpacity(0);
            selectedPathRef.current?.setMap(null);
          }
        });
        mouseoverListenersRef.current.push(overListener, outListener);
      });
    } else {
      // migration.mapObjects.forEach((marker, index) => {
      //   marker.setOpacity(0);
      //   const overListener = marker.addListener("mouseover", () => {
      //     marker.setOpacity(1);
      //   });
      //   const outListener = marker.addListener("mouseout", () => {
      //     marker.setOpacity(0);
      //   });
      //   mouseoverListenersRef.current.push(overListener, outListener);
      // });
    }
    setSelectedMarkersOpacity(newSeasonMigration);
    return () => {
      mouseoverListenersRef.current.forEach((it) => it.remove());
      mouseoverListenersRef.current = [];
    };
  }, [isEdit, newSeasonMigration, migration]);
  const { worker } = useContext(IndexTracksWorkerContext);
  const indexTracks = () =>
    indexTracksWithWorker(worker, {
      ...migration,
      mapObjects: undefined,
    } as Migration);
  const {
    isLoading,
    mutate: indexTracksMutation,
    variables,
  } = useMutation<Migration | undefined, any, void>("parseFiles", indexTracks, {
    onError: (error, variables) => {
      // setLoadingFilesNumber((prev) =>
      //     Math.max(prev - (variables?.length || 0), 0)
      // );
    },
    onSuccess: (res, variables) => {
      // setLoadingFilesNumber((prev) =>
      //     Math.max(prev - (variables?.length || 0), 0)
      // );
      if (res) {
        onEditEnd({ ...res, mapObjects: migration.mapObjects });
      }
    },
  });
  useEffect(() => {
    if (newSeasonMigration?.filter((it) => it !== null).length === 2) {
      setShowSeasonModal(true);
    }
  }, [newSeasonMigration]);

  return (
    <>
      <Accordion
        className={`common__card common__card_blue`}
        defaultExpanded={false}
      >
        <AccordionSummary
          style={{ width: "100%" }}
          className={"common__accordion-row-summary"}
          expandIcon={<ExpandMoreIcon />}
        >
          <div className={"common__row"}>
            <Typography
              className={"common__ellipsis-text"}
              title={migration.title}
            >
              {migration.title}
            </Typography>
            {!isEdit && (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    fullPathRef.current &&
                      showMapObjects([fullPathRef.current]);
                  }}
                >
                  Show
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    hideMapObjects(migration.mapObjects);
                    fullPathRef.current &&
                      hideMapObjects([fullPathRef.current]);
                  }}
                >
                  Hide
                </Button>
              </>
            )}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(migration.years).map(([year, yearInfo]) => (
            <BirdMigrationYear
              migration={migration}
              year={Number(year)}
              onDeleteMigration={onDeleteMigration}
            />
          ))}
          {!isEdit ? (
            <>
              <Button
                onClick={() => {
                  onChangeEditState(true);
                }}
              >
                Add migration
              </Button>
              <Button
                onClick={() => {
                  indexTracksMutation();
                }}
              >
                Auto find migrations
              </Button>
            </>
          ) : (
            <Button onClick={cancelEdit}>Cancel</Button>
          )}
        </AccordionDetails>
      </Accordion>

      {showSeasonModal && (
        <BirdMigrationSelectSeasonModal
          migration={migration}
          onCancel={cancelEdit}
          onFinish={finishEdit}
          selectedMigration={newSeasonMigration}
        />
      )}
    </>
  );
};
