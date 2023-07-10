import { IndexedMigration } from "../migrations";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, {
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GoogleMapObject } from "../../../utils/geometry/map/useDrawGeojson";
import Modal from "@mui/material/Modal";
import { Offset } from "../../../App";
import { MigrationYear } from "../types";
const seasons: ["spring", "summer", "autumn", "winter"] = [
  "spring",
  "summer",
  "autumn",
  "winter",
];
export const BirdMigrationInfo = ({
  migration,
  showOnMap,
  hideOnMap,
  onEditEnd,
  isEdit,
  setIsEdit,
}: {
  migration: IndexedMigration;
  showOnMap: (shapes: GoogleMapObject[]) => any;
  hideOnMap: (shapes: GoogleMapObject[]) => any;
  onEditEnd: (migration: IndexedMigration) => any;
  isEdit?: boolean;
  setIsEdit: (arg: boolean) => any;
}) => {
  const [newSeasonMigration, setNewSeasonMigration] = useState<
    [number, number | null] | undefined
  >();
  const clickListenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const mouseoverListenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const [showSeasonModal, setShowSeasonModal] = useState(false);

  const freeMarkers = useMemo(
    () =>
      migration.mapObjects.filter((it, index) => {
        return Object.entries(migration.years).every(([year, yearInfo]) =>
          seasons.every((season) => {
            const seasonInfo = yearInfo[season];
            return (
              !seasonInfo || seasonInfo[0] > index || seasonInfo[1] < index
            );
          })
        );
      }) as google.maps.Marker[],
    [migration]
  );
  const selectMarker = (index: number) => {
    setNewSeasonMigration((prev) => {
      if (!prev) {
        return [index, null];
      } else {
        return prev[0] !== index ? [prev[0], index] : undefined;
      }
    });
  };
  const cancelEdit = () => {
    setNewSeasonMigration(undefined);
    setShowSeasonModal(false);
    setIsEdit(false);
  };
  const finishEdit = (
    year: number,
    season: "spring" | "summer" | "autumn" | "winter"
  ) => {
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
  };

  const setSelectedMarkersOpacity = (path?: [number, number | null]) => {
    if (!path) {
      freeMarkers.forEach((it) => it.setOpacity(isEdit ? 0.5 : 1));
    } else {
      if (!path[1]) {
        console.log(path[0], "PATH0");
        freeMarkers[path[0]].setOpacity(1);
      } else {
        freeMarkers
          .slice(...(path as [number, number]))
          .forEach((marker) => marker.setOpacity(1));
      }
    }
  };
  useEffect(() => {
    if (isEdit) {
      hideOnMap(migration.mapObjects);
      showOnMap(freeMarkers);
      freeMarkers.forEach((shape, index) => {
        const clickHandler = shape.addListener("click", () =>
          selectMarker(index)
        );
        clickListenersRef.current.push(clickHandler);
      });
    } else {
      showOnMap(migration.mapObjects);
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
            newSeasonMigration && [newSeasonMigration[0], index]
          );
        });
        const outListener = marker.addListener("mouseout", () => {
          setSelectedMarkersOpacity(newSeasonMigration);
        });
        mouseoverListenersRef.current.push(overListener, outListener);
      });
    }
    setSelectedMarkersOpacity(newSeasonMigration);
    return () => {
      mouseoverListenersRef.current.forEach((it) => it.remove());
      mouseoverListenersRef.current = [];
    };
  }, [isEdit, newSeasonMigration, migration]);

  useEffect(() => {
    if (newSeasonMigration?.filter((it) => it !== null).length === 2) {
      setShowSeasonModal(true);
    }
  }, [newSeasonMigration]);

  const selectedYears = useMemo(() => {
    if (!newSeasonMigration?.every((it) => it !== null)) {
      return [];
    }
    const [startIndex, endIndex] = newSeasonMigration as [number, number];
    const startYear =
      migration.geojson.features[startIndex].properties.date.getFullYear();
    const endYear =
      migration.geojson.features[endIndex].properties.date.getFullYear();

    return new Array(startYear - endYear)
      .fill(0)
      .map((it, index) => startYear + index);
  }, [newSeasonMigration]);

  return (
    <>
      <Accordion defaultExpanded={false} sx={{ boxShadow: "none" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            boxShadow:
              "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
          }}
          className={`common__card common__card_blue`}
        >
          <Typography>{migration.title}</Typography>

          <Button
            onClick={() => {
              showOnMap(migration.mapObjects);
            }}
          >
            Show
          </Button>
          <Button
            onClick={() => {
              hideOnMap(migration.mapObjects);
            }}
          >
            Hide
          </Button>
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(migration.years).map(([year, yearInfo]) => (
            <>
              <div>{year}</div>
              {seasons
                .filter((season) => yearInfo[season])
                .map((season) => {
                  const [startIndex, endIndex] = yearInfo[season] as [
                    number,
                    number
                  ];
                  const title = `
                    ${migration.geojson.features[
                      startIndex
                    ]?.properties?.date.toISOString()}
                    -
                    ${migration.geojson.features[
                      endIndex
                    ]?.properties?.date.toISOString()}`;
                  return (
                    <div
                      style={{ textOverflow: "ellipsis" }}
                      key={season + year}
                      title={title}
                    >
                      {title}
                      <Button
                        onClick={() => {
                          showOnMap(
                            migration.mapObjects.slice(startIndex, endIndex)
                          );
                        }}
                      >
                        Show
                      </Button>
                      <Button
                        onClick={() => {
                          hideOnMap(
                            migration.mapObjects.slice(startIndex, endIndex)
                          );
                        }}
                      >
                        Hide
                      </Button>
                    </div>
                  );
                })}
            </>
          ))}
          {!isEdit ? (
            <Button
              onClick={() => {
                setIsEdit(true);
              }}
            >
              Add migration
            </Button>
          ) : (
            <Button onClick={cancelEdit}>Cancel</Button>
          )}
        </AccordionDetails>
      </Accordion>
      {showSeasonModal && (
        <Modal open={true}>
          <>
            <Offset />
            <Box
              className={"common-modal__body"}
              style={{ backgroundColor: "white" }}
            >
              {selectedYears.map((year) => {
                const migrationInfo = migration.years[year] || {};
                return seasons
                  .filter((season) => !migrationInfo[season])
                  .map((season) => (
                    <Button
                      key={season + year}
                      onClick={() => {
                        finishEdit(year, season);
                      }}
                    >
                      Add {season} {year}
                    </Button>
                  ));
              })}
              <Button onClick={cancelEdit}>Cancel</Button>
            </Box>
          </>
        </Modal>
      )}
    </>
  );
};
const BirdMigrationYear = () => {};
const BirdMigrationSeason = () => {
  return <></>;
};
const BirdMigrationSelectSeasonModal = () => {};
