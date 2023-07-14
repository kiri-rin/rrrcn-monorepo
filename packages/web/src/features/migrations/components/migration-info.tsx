import { IndexedMigration } from "../migrations";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { MigrationYear, SEASONS } from "../types";
import { MapDrawingContext } from "../../../common/map/MapEdit";
import { BirdMigrationYear } from "./migration-year";
import { BirdMigrationSelectSeasonModal } from "./migration-select-season";

export const MigrationInfo = ({
  migration,

  onEditEnd,
  isEdit,
  setIsEdit,
}: {
  migration: IndexedMigration;
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
  const { map, showMapObjects, hideMapObjects } = useContext(MapDrawingContext);

  const freeMarkers = useMemo(
    () =>
      migration.mapObjects.filter((it, index) => {
        return Object.entries(migration.years).every(([year, yearInfo]) =>
          Object.values(SEASONS).every((season) => {
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
        if (prev[0] > index) {
          return prev;
        }
        return prev[0] !== index ? [prev[0], index] : undefined;
      }
    });
  };
  const cancelEdit = () => {
    setNewSeasonMigration(undefined);
    setShowSeasonModal(false);
    setIsEdit(false);
  };
  const finishEdit = (year: number, season: SEASONS) => {
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
    setIsEdit(false);
  };

  const setSelectedMarkersOpacity = (path?: [number, number | null]) => {
    if (!path) {
      freeMarkers.forEach((it) => it.setOpacity(isEdit ? 0.5 : 1));
    } else {
      if (!path[1]) {
        console.log(path[0], "PATH0");
        freeMarkers[path[0]].setOpacity(1);
        freeMarkers.slice(0, path[0]).forEach((it) => it.setOpacity(0));
      } else {
        freeMarkers
          .slice(...(path as [number, number]))
          .forEach((marker) => marker.setOpacity(1));
      }
    }
  };
  useEffect(() => {
    if (isEdit) {
      hideMapObjects(migration.mapObjects);
      showMapObjects(freeMarkers);
      freeMarkers.forEach((shape, index) => {
        const clickHandler = shape.addListener("click", () =>
          selectMarker(index)
        );
        clickListenersRef.current.push(clickHandler);
      });
    } else {
      showMapObjects(migration.mapObjects);
    }
    return () => {
      clickListenersRef.current.forEach((listener) => {
        listener.remove();
      });
      clickListenersRef.current = [];
    };
  }, [isEdit, migration]);
  useEffect(() => {
    return () => {
      hideMapObjects(migration.mapObjects);
    };
  }, [migration]);

  useEffect(() => {
    if (isEdit) {
      freeMarkers.forEach((marker, index) => {
        const overListener = marker.addListener("mouseover", () => {
          setSelectedMarkersOpacity(
            newSeasonMigration && [newSeasonMigration[0], index]
          );
        });
        const outListener = marker.addListener("mouseout", () => {
          if (newSeasonMigration?.[0]) {
            freeMarkers
              .slice(...([newSeasonMigration?.[0], index] as [number, number]))
              .forEach((marker) => marker.setOpacity(0.5));
          }
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
                  onClick={() => {
                    showMapObjects(migration.mapObjects);
                  }}
                >
                  Show
                </Button>
                <Button
                  onClick={() => {
                    hideMapObjects(migration.mapObjects);
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
            <BirdMigrationYear migration={migration} year={Number(year)} />
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
