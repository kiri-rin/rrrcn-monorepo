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
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GoogleMapObject } from "../../../utils/geometry/map/useDrawGeojson";
const seasons: ["spring", "summer", "autumn", "winter"] = [
  "spring",
  "summer",
  "autumn",
  "winter",
];
export const BirdMigrationInfo = ({
  migration,
  onShowOnMap,
  onHideOnMap,
  onEditEnd,
  isEdit,
  setIsEdit,
}: {
  migration: IndexedMigration;
  onShowOnMap: (shapes: GoogleMapObject[]) => any;
  onHideOnMap: (shapes: GoogleMapObject[]) => any;
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
            const seasinInfo = yearInfo[season];
            return (
              !seasinInfo || seasinInfo[0] > index || seasinInfo[1] < index
            );
          })
        );
      }) as google.maps.Marker[],
    [migration]
  );
  useEffect(() => {
    if (isEdit) {
      freeMarkers.forEach((shape, index) => {
        (shape as google.maps.Marker).setOpacity(0.5);
        const clickHandler = shape.addListener("click", () => {
          setNewSeasonMigration((prev) => {
            if (!prev) {
              return [index, null];
            } else {
              return [prev[0], index];
            }
          });
        });
        clickListenersRef.current.push(clickHandler);
      });
    }
    return () => {
      clickListenersRef.current.forEach((listener) => {
        listener.remove();
      });
      freeMarkers.forEach((marker) => {
        marker.setOpacity(1);
      });
      clickListenersRef.current = [];
    };
  }, [isEdit, migration]);
  useEffect(() => {
    if (isEdit) {
      freeMarkers.forEach((marker, index) => {
        const overListener = marker.addListener("mouseover", () => {
          if (!newSeasonMigration) {
            marker.setOpacity(1);
          } else {
            freeMarkers
              .slice(newSeasonMigration[0], index)
              .forEach((it) => it.setOpacity(1));
          }
        });
        const outListener = marker.addListener("mouseout", () => {
          if (!newSeasonMigration) {
            marker.setOpacity(0.5);
          } else {
            freeMarkers
              .slice(newSeasonMigration[0], index)
              .forEach((it) => it.setOpacity(0.5));
          }
        });
        mouseoverListenersRef.current.push(overListener, outListener);
      });
    }
    if (!newSeasonMigration) {
      freeMarkers.forEach((it) => it.setOpacity(0.5));
    } else {
      if (!newSeasonMigration[1]) {
        freeMarkers[newSeasonMigration[0]].setOpacity(1);
      } else {
        freeMarkers
          .slice(...(newSeasonMigration as [number, number]))
          .forEach((marker) => marker.setOpacity(1));
      }
    }
    return () => {
      freeMarkers.forEach((marker) => marker.setOpacity(1));
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
            onShowOnMap(migration.mapObjects);
          }}
        >
          Show
        </Button>
        <Button
          onClick={() => {
            onHideOnMap(migration.mapObjects);
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
              .map((season) => (
                <div key={season + year}>
                  {`
                    ${
                      migration.geojson.features[yearInfo[season]?.[0] || 0]
                        ?.properties?.date
                    }
                    -
                    ${
                      migration.geojson.features[yearInfo[season]?.[1] || 0]
                        ?.properties?.date
                    }`}
                </div>
              ))}
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
          <Button
            onClick={() => {
              setIsEdit(false);
            }}
          >
            Cancel
          </Button>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
