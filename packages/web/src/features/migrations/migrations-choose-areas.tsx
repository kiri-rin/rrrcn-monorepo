import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Select } from "@mui/material";
import {
  GoogleMapObject,
  parseGeojson,
} from "../../utils/geometry/map/useDrawGeojson";
import { GeoJSON } from "geojson";
import { Migration, SEASONS } from "./types";
import { MapDrawingContext } from "../../common/map/MapEdit";
import { ParamsImageInput } from "../../common/params-image-input";
import { useMutation, useQuery, useQueryClient } from "react-query";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { api } from "../../api";
import { SelectedSeasonsType } from "./migrations";

type MigrationMapObjects = {
  mapObjects: GoogleMapObject[];
};
export type IndexedMigration = Migration & MigrationMapObjects;
export const MigrationsChooseAreas = ({
  migrations,
}: {
  migrations: IndexedMigration[];
}) => {
  const mapObjectsRef = useRef<GoogleMapObject[]>([]);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const { showMapObjects, hideMapObjects } = useContext(MapDrawingContext);
  const [selectedPolygons, setSelectedPolygons] = useState<Set<number>>(
    new Set()
  );

  const { data: migrationSplitAreaState, mutateAsync: postSplitArea } =
    useMutation(
      "migration-split-area",
      api.migration.postApiMigrationSplitArea,
      {
        onSuccess({ data }) {
          queryClient.setQueriesData("migration-split-area", data);
        },
      }
    );
  useEffect(() => {
    selectedPolygons.forEach((value) => {
      mapObjectsRef.current[value]?.setOptions({ fillColor: "red" });
    });
    return () => {
      selectedPolygons.forEach((value) => {
        mapObjectsRef.current[value]?.setOptions({ fillColor: "black" });
      });
    };
  }, [selectedPolygons]);
  useEffect(() => {
    if (migrationSplitAreaState) {
      mapObjectsRef.current = parseGeojson(
        (
          migrationSplitAreaState as unknown as {
            data: { grid: GeoJSON.FeatureCollection };
          }
        ).data.grid
      );
      setSelectedPolygons(
        new Set(
          (
            migrationSplitAreaState as unknown as {
              data: { intersections: number[] };
            }
          ).data.intersections.reduce((acc, it, index) => {
            if (it) {
              acc.push(index);
            }
            return acc;
          }, [] as number[])
        )
      );

      mapObjectsRef.current.forEach((polygon, index) => {
        listenersRef.current.push(
          polygon.addListener("click", () => {
            setSelectedPolygons((prev) => {
              const newState = new Set(prev);
              if (newState.has(index)) {
                newState.delete(index);
              } else {
                newState.add(index);
              }
              return newState;
            });
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
  }, [migrationSplitAreaState]);
  const [selectedSeasons, setSelectedSeasons] = useState<SelectedSeasonsType>(
    {}
  );
  const indexedSeasons = reduceMigrations(migrations || []);

  const queryClient = useQueryClient();

  const seasonsArray: { year: string; season: SEASONS }[] = Object.entries(
    indexedSeasons
  )
    .sort(([year1], [year2]) => Number(year1) - Number(year2))
    .flatMap(([year, info]: [string, any]) =>
      Object.values(SEASONS)
        .filter((season) => info[season])
        .map((season) => ({ year, season }))
    );
  return (
    <>
      <Select
        multiple={true}
        onChange={({ target: { value } }) => {
          setSelectedSeasons((prev: any) => {
            const newState: any = {};
            (value as string[]).forEach((val: any) => {
              const [year, season] = val.split(" ");
              if (!newState[year]) {
                newState[year] = {};
              }
              newState[year][season] = true;
            });
            return newState;
          });
        }}
        renderValue={(selected) => selected.join(", ")}
        value={seasonsArray
          .filter(({ year, season }) => selectedSeasons[year]?.[season])
          .map(({ year, season }) => `${year} ${season}`)}
      >
        {seasonsArray.map(({ year, season }) => (
          <MenuItem key={`${year} ${season}`} value={`${year} ${season}`}>
            <Checkbox checked={selectedSeasons[year]?.[season]} />
            <ListItemText
              primary={`${year} ${season} (${indexedSeasons[year]?.[season]})`}
            />
          </MenuItem>
        ))}
      </Select>
      <Button
        onClick={() => {
          postSplitArea(
            prepareSeasonsRequest(migrations || [], selectedSeasons)
          );
        }}
      >
        Send
      </Button>
      {migrationSplitAreaState && (
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
              setSelectedPolygons(new Set());
            }}
          >
            Clear selection
          </Button>
        </div>
      )}
      <ParamsImageInput name={"params"} />
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
  return res;
};
