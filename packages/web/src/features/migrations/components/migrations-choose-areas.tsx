import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button, LinearProgress, Select, TextField } from "@mui/material";
import {
  GoogleMapObject,
  parseGeojson,
} from "../../../utils/geometry/map/useDrawGeojson";
import { GeoJSON } from "geojson";
import { Migration, SEASONS } from "../types";
import { MapDrawingContext } from "../../../components/map/MapEdit";
import { useMutation, useQuery, useQueryClient } from "react-query";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { api } from "../../../api";
import {
  SelectedSeasonsType,
  SelectedTracksSeasonsType,
  useMigrationsContext,
} from "../index";
import { FormikContext, useFormik } from "formik";
import { useMigrationSelectedItems } from "../utils/selected-items-context";

export const MigrationsChooseAreas = () => {
  const { migrations, selectedSeasons, setSelectedSeasons } =
    useMigrationsContext();
  const mapObjectsRef = useRef<GoogleMapObject[]>([]);
  const listenersRef = useRef<google.maps.MapsEventListener[]>([]);
  const { showMapObjects, hideMapObjects } = useContext(MapDrawingContext);
  const [initCount, setInitCount] = useState<number>(10);

  const {
    data: generatedMigrations,
    mutateAsync: generateTracks,
    isLoading: isGenerateLoading,
  } = useMutation(
    "migration-generated-tracks",
    api.migration.postApiMigrationGenerateTracks,
    {
      onSuccess({ data }) {
        queryClient.setQueriesData("migration-generated-tracks", data);
      },
    }
  );
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
      mapObjectsRef.current = parseGeojson(
        (
          generatedMigrations as unknown as {
            data: { grid: GeoJSON.FeatureCollection };
          }
        ).data.grid
      );
      mapObjectsRef.current.forEach((polygon, index) => {
        listenersRef.current.push(
          polygon.addListener("click", () => {
            setSelectedBBox(
              selectedBBox?.index !== index
                ? {
                    index: index,
                    probabilities: (
                      generatedMigrations as unknown as {
                        data: { indexedAreas: any };
                      }
                    ).data.indexedAreas[index]?.probabilities,
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
        Selected migrations:{" "}
        {Object.values(selectedSeasons)
          .flatMap((trackSelected) =>
            Object.values(trackSelected).map(
              (trackSelectedSeasons) =>
                Object.values(trackSelectedSeasons).filter((it) => it).length
            )
          )
          .reduce((a, b) => a + b, 0)}
        {/*<Select*/}
        {/*  size={"small"}*/}
        {/*  multiple={true}*/}
        {/*  onChange={({ target: { value } }) => {*/}
        {/*    setSelectedSeasons((prev: any) => {*/}
        {/*      const newState: any = {};*/}
        {/*      (value as string[]).forEach((val: any) => {*/}
        {/*        const [year, season] = val.split(" ");*/}
        {/*        if (!newState[year]) {*/}
        {/*          newState[year] = {};*/}
        {/*        }*/}
        {/*        newState[year][season] = true;*/}
        {/*      });*/}
        {/*      return newState;*/}
        {/*    });*/}
        {/*  }}*/}
        {/*  renderValue={(selected) => selected.join(", ")}*/}
        {/*  value={seasonsArray*/}
        {/*    .filter(({ year, season }) => selectedSeasons[year]?.[season])*/}
        {/*    .map(({ year, season }) => `${year} ${season}`)}*/}
        {/*>*/}
        {/*  {seasonsArray.map(({ year, season }) => (*/}
        {/*    <MenuItem key={`${year} ${season}`} value={`${year} ${season}`}>*/}
        {/*      <Checkbox*/}
        {/*        checked={!!selectedSeasons[year]?.[season]}*/}
        {/*        onChange={() => {}}*/}
        {/*      />*/}
        {/*      <ListItemText*/}
        {/*        primary={`${year} ${season} (${indexedSeasons[year]?.[season]})`}*/}
        {/*      />*/}
        {/*    </MenuItem>*/}
        {/*  ))}*/}
        {/*</Select>*/}
        <div>
          <TextField
            size={"small"}
            type={"number"}
            value={initCount}
            onChange={({ target: { value } }) => setInitCount(Number(value))}
          />
          <div>
            <Button
              disabled={isGenerateLoading}
              onClick={() => {
                generateTracks(
                  prepareGenerateRequest(
                    migrations || [],
                    selectedSeasons,
                    initCount
                  )
                );
              }}
            >
              Generate
            </Button>
          </div>
        </div>
        {isGenerateLoading ? (
          <LinearProgress />
        ) : (
          generatedMigrations && (
            <div>
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
              </div>
            </div>
          )
        )}
        {/*{migrationSplitAreaState && <ParamsImageInput name={"params"} />}*/}
      </div>
    </FormikContext.Provider>
  );
};
const reduceMigrations = (migrations: Migration[]) => {
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
  migrations: Migration[],
  seasons: SelectedTracksSeasonsType
) => {
  const res: { migrations: { geojson: GeoJSON.FeatureCollection }[] } = {
    migrations: [],
  };

  migrations.forEach(({ geojson, years, id: trackId }, index) => {
    Object.entries(years).forEach(([year, yearSeasons]) => {
      Object.entries(yearSeasons).forEach(([season, seasonIndices]) => {
        const currentMigrationSeason =
          seasons[trackId]?.[year]?.[season as SEASONS];
        if (currentMigrationSeason) {
          res.migrations.push({
            geojson: {
              type: "FeatureCollection",
              features: geojson.features.slice(...seasonIndices).map((it) => ({
                ...it,
                properties: { ...it.properties, description: undefined },
              })),
            },
          });
        }
      });
    });
  });

  res.migrations = res.migrations.filter((it) => it?.geojson?.features?.length);
  return res;
};
export const prepareGenerateRequest = (
  migrations: Migration[],
  selectedSeasons: any,
  initCount: number
) => {
  const res = prepareSeasonsRequest(migrations, selectedSeasons);
  //@ts-ignore
  res.migrations = res.migrations.map((it) => it.geojson);
  //@ts-ignore
  res.initCount = initCount;
  return res;
};
