import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button, LinearProgress, Select, TextField } from "@mui/material";
import {
  GoogleMapObject,
  parseGeojson,
} from "../../../../utils/geometry/map/useDrawGeojson";
import { GeoJSON } from "geojson";
import { Migration, SEASONS } from "../../types";
import { MapDrawingContext } from "../../../../components/map/MapEdit";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "../../../../api";
import { SelectedTracksSeasonsType, useMigrationsContext } from "../../index";
import { FormikContext, useFormik } from "formik";
import { useMigrationSelectedItems } from "../../utils/selected-items-context";
import { useGeneratedTracks } from "./hooks/use-generated-tracks";
import { useGeneratedAreas } from "./hooks/use-generated-areas";
import {
  MigrationGeneratedTracksContainer,
  MigrationGeneratedTracksRow,
  MigrationGeneratedTracksShowButton,
  MigrationGeneratedTracksTitle,
} from "./style";

export const MigrationsChooseAreas = () => {
  const { migrations, selectedSeasons, setSelectedSeasons } =
    useMigrationsContext();
  const [initCount, setInitCount] = useState<number>(10);
  const {
    hideTracks,
    showTracks,
    shown: tracksShown,
    tracks,
  } = useGeneratedTracks();
  const {
    shown: areasShown,
    areas,
    indexedAreas,
    showIndexedAreas,
    hideIndexedAreas,
    hideAreas,
    indexedAreasShown,
    showAreas,
  } = useGeneratedAreas();

  const queryClient = useQueryClient();
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

  const paramsForm = useFormik({
    onSubmit: () => {},
    initialValues: { params: { type: "scripts", scripts: [] } },
  });

  return (
    <FormikContext.Provider value={paramsForm}>
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
            <MigrationGeneratedTracksContainer>
              Generated tracks
              <MigrationGeneratedTracksRow>
                <MigrationGeneratedTracksTitle>
                  tracks: {tracks?.length}
                </MigrationGeneratedTracksTitle>
                <MigrationGeneratedTracksShowButton
                  onClick={() => {
                    tracksShown ? hideTracks() : showTracks();
                  }}
                  show={tracksShown}
                />
              </MigrationGeneratedTracksRow>
              <MigrationGeneratedTracksRow>
                <MigrationGeneratedTracksTitle>
                  areas:{areas?.features.length}
                </MigrationGeneratedTracksTitle>
                <MigrationGeneratedTracksShowButton
                  onClick={() => {
                    areasShown ? hideAreas() : showAreas();
                  }}
                  show={areasShown}
                />
              </MigrationGeneratedTracksRow>
              <MigrationGeneratedTracksRow>
                <MigrationGeneratedTracksTitle>
                  Indexed areas:{Object.values(indexedAreas || {}).length}
                </MigrationGeneratedTracksTitle>
                <MigrationGeneratedTracksShowButton
                  onClick={() => {
                    indexedAreasShown ? hideIndexedAreas() : showIndexedAreas();
                  }}
                  show={indexedAreasShown}
                />
              </MigrationGeneratedTracksRow>
            </MigrationGeneratedTracksContainer>
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
