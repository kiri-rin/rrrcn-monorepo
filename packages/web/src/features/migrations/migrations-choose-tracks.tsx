import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  Button,
  Input,
  Select,
  Typography,
} from "@mui/material";
import { kml } from "@tmcw/togeojson";
import {
  GoogleMapObject,
  parseGeojson,
  useDrawGeojson,
} from "../../utils/geometry/map/useDrawGeojson";
import { GeoJSON } from "geojson";
import { Migration, SEASONS } from "./types";
import { MapDrawingContext } from "../../common/map/MapEdit";
import { MigrationInfo } from "./components/migration-info";
import { parse } from "date-fns";
import { parseMigrationsKml } from "./utils";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import { useMutation, useQueryClient } from "react-query";
import { api } from "../../api";

type MigrationMapObjects = {
  mapObjects: GoogleMapObject[];
};
export type IndexedMigration = Migration & MigrationMapObjects;
export const MigrationsChooseTracks = () => {
  const [worker, setWorker] = useState<Worker | undefined>();
  const [migrations, setMigrations] = useState<
    IndexedMigration[] | undefined
  >();
  const [currentEdit, setCurrentEdit] = useState<number | null>(null);
  const [selectedSeasons, setSelectedSeasons] = useState<any>({});
  const queryClient = useQueryClient();

  const { data: migrationSplitAreaState, mutateAsync: postSplitArea } =
    useMutation(
      "migration-split-area",
      api.migration.postApiMigrationSplitArea,
      {
        onSuccess(data) {
          queryClient.setQueriesData("migration-split-area", data);
        },
      }
    );
  useEffect(() => {
    setWorker(
      new Worker(new URL("../../workers/index_tracks.ts", import.meta.url))
    );
  }, []);
  const indexedSeasons = reduceMigrations(migrations || []);

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
      <Input
        inputProps={{ multiple: true }}
        size={"small"}
        type={"file"}
        onChange={({
          target: { files },
        }: React.ChangeEvent<HTMLInputElement>) => {
          worker &&
            parseMigrationsKml(worker, files).then((res: any) =>
              setMigrations(
                res.map((it: any) => {
                  it.mapObjects = parseGeojson(it.geojson).map((_it, index) => {
                    _it.set(
                      "title",
                      it.geojson.features[index].properties?.name +
                        " || " +
                        it.geojson.features[index].properties?.date
                    );
                    return _it;
                  });
                  return it;
                })
              )
            );
        }} // TODO add show/hide button
      />
      {migrations?.map((migr, index) => (
        <MigrationInfo
          setIsEdit={(edit) => {
            setCurrentEdit((curEdit) => {
              if (curEdit === index && !edit) {
                return null;
              } else {
                return index;
              }
            });
          }}
          migration={migr}
          isEdit={currentEdit === index}
          onEditEnd={(result) => {
            setMigrations((prev) => {
              if (!prev) {
                prev = [];
              }
              prev[index] = result;
              return prev;
            });
          }}
        />
      ))}
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
      <Button onClick={() => {}}>Send</Button>
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
