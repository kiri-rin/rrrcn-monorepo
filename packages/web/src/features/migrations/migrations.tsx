import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@mui/material";
import {
  GoogleMapObject,
  parseGeojson,
} from "../../utils/geometry/map/useDrawGeojson";
import { Migration, SEASONS } from "./types";
import { MigrationInfo } from "./components/migration-info";
import { parseMigrationsKml } from "./utils";
import { MigrationsChooseAreas } from "./migrations-choose-areas";

type MigrationMapObjects = {
  mapObjects: GoogleMapObject[];
};
export type SelectedSeasonsType = {
  [year: string]: { [season in SEASONS]: boolean };
};
export type IndexedMigration = Migration & MigrationMapObjects;
export const MigrationsForm = () => {
  const [worker, setWorker] = useState<Worker | undefined>();
  const [migrations, setMigrations] = useState<
    IndexedMigration[] | undefined
  >();
  const [currentEdit, setCurrentEdit] = useState<number | null>(null);

  useEffect(() => {
    setWorker(
      new Worker(new URL("./workers/index_tracks.ts", import.meta.url))
    );
  }, []);

  return (
    <div>
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
      <MigrationsChooseAreas migrations={migrations || []} />
    </div>
  );
};
