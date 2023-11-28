import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button, LinearProgress, Select } from "@mui/material";
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
import { FormikContext, useFormik } from "formik";
import { mapScriptsConfigToRequest } from "../../random-forest/utils";

type MigrationMapObjects = {
  mapObjects: GoogleMapObject[];
};
export type MigrationWithMapObjects = Migration & MigrationMapObjects;
export const MigrationsChooseAreas = ({
  migrations,
}: {
  migrations: MigrationWithMapObjects[];
}) => {
  const mapObjectsRef = useRef<GoogleMapObject[]>([]);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const { showMapObjects, hideMapObjects } = useContext(MapDrawingContext);
  const [selectedPolygons, setSelectedPolygons] = useState<Set<number>>(
    new Set()
  );

  const {
    data: migrationSplitAreaState,
    mutateAsync: postSplitArea,
    isLoading,
  } = useMutation(
    "migration-split-area",
    api.migration.postApiMigrationSplitArea,
    {
      onSuccess({ data }) {
        queryClient.setQueriesData("migration-split-area", data);
      },
    }
  );
  const {
    data: generatedMigrations,
    mutateAsync: generateTracks,
    isLoading: isGenerateLoading,
  } = useMutation(
    "migration-generated-tracks",
    api.migration.postApiMigrationGenerateTracks,
    {
      onSuccess({ data }) {
        console.log("SUCCESS");
        queryClient.setQueriesData("migration-generated-tracks", data);
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
  const paramsForm = useFormik({
    onSubmit: () => {},
    initialValues: { params: { type: "scripts", scripts: [] } },
  });

  const queryClient = useQueryClient();

  const seasonsArray: { year: string; season: SEASONS }[] = useMemo(
    () =>
      Object.entries(indexedSeasons)
        .sort(([year1], [year2]) => Number(year1) - Number(year2))
        .flatMap(([year, info]: [string, any]) =>
          Object.values(SEASONS)
            .filter((season) => info[season])
            .map((season) => ({ year, season }))
        ),
    [migrations, selectedSeasons]
  );
  return (
    <FormikContext.Provider value={paramsForm}>
      Choose migrations to process
      <div>
        <Select
          size={"small"}
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
              <Checkbox
                checked={!!selectedSeasons[year]?.[season]}
                onChange={() => {}}
              />
              <ListItemText
                primary={`${year} ${season} (${indexedSeasons[year]?.[season]})`}
              />
            </MenuItem>
          ))}
        </Select>
        <Button
          disabled={isLoading}
          onClick={() => {
            postSplitArea(
              prepareSeasonsRequest(migrations || [], selectedSeasons)
            );
          }}
        >
          Split migration area
        </Button>

        {isLoading ? (
          <LinearProgress />
        ) : (
          migrationSplitAreaState && (
            <div>
              <Button
                disabled={isGenerateLoading}
                onClick={() => {
                  generateTracks(
                    prepareGenerateRequest(
                      migrations || [],
                      selectedSeasons,
                      migrationSplitAreaState?.data.grid,
                      paramsForm.values.params,
                      selectedPolygons
                    )
                  );
                }}
              >
                Generate
              </Button>
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
          )
        )}
        {isGenerateLoading && <LinearProgress />}
        {migrationSplitAreaState && <ParamsImageInput name={"params"} />}
      </div>
    </FormikContext.Provider>
  );
};
const reduceMigrations = (migrations: MigrationWithMapObjects[]) => {
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
  migrations: MigrationWithMapObjects[],
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
  migrations: MigrationWithMapObjects[],
  selectedSeasons: any,
  grid: any,
  params: any,
  selectedPolygons: Set<number>
) => {
  const res = prepareSeasonsRequest(migrations, selectedSeasons);
  //@ts-ignore
  res.allAreas = grid;
  //@ts-ignore
  res.params = mapScriptsConfigToRequest(params);
  //@ts-ignore
  res.selectedAreasIndices = Array.from(selectedPolygons);
  //@ts-ignore
  res.migrations = res.migrations.map((it) => it.geojson);
  return res;
};
