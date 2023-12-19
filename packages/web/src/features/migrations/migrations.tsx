import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Migration, SEASONS } from "./types";
import { MigrationsChooseAreas } from "./components/migrations-choose-areas";
import { MigrationsGeneratedTracks } from "./components/migrations-generated-tracks";
import { MigrationsFilesInput } from "./components/migrations-files";
import { DatePicker } from "@mui/x-date-pickers";
import { Point } from "geojson";
import { MigrationsDateFilterContainer } from "./style";
import {
  IndexTracksWorkerContext,
  useIndexTracksWorker,
} from "./workers/context";
import { MigrationRightPanel } from "./components/migration-right-panel";
import { MigrationSelectedItemsProvider } from "./utils/selected-items-context";

export type SelectedSeasonsType = {
  [year: string]: { [season in SEASONS]: boolean };
};
export type IndexedMigration = Migration;
export const MigrationsForm = () => {
  const [migrations, setMigrations] = useState<
    IndexedMigration[] | undefined
  >();
  const [dateFilter, setDateFilter] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const worker = useIndexTracksWorker();
  // const filteredMigrations = useMemo(
  //   () =>
  //     migrations?.map((migration) => {
  //       const newMigration = { ...migration };
  //       newMigration.geojson = { ...newMigration.geojson };
  //       const { newDeatures, newObjects } =
  //         newMigration.geojson.features.reduce(
  //           (acc, it, index) => {
  //             if (
  //               (!dateFilter[0] || it.properties.date >= dateFilter[0]) &&
  //               (!dateFilter[1] || it.properties.date <= dateFilter[1])
  //             ) {
  //               acc.newDeatures.push(it);
  //               acc.newObjects.push(newMigration.mapObjects[index]);
  //             }
  //             return acc;
  //           },
  //           {
  //             newDeatures: [] as GeoJSON.Feature<Point, { date: Date }>[],
  //             newObjects: [] as google.maps.Marker[],
  //           }
  //         );
  //       newMigration.geojson.features = newDeatures;
  //       newMigration.mapObjects = newObjects;
  //       return newMigration;
  //     }),
  //   [migrations, dateFilter]
  // );

  return (
    <IndexTracksWorkerContext.Provider value={{ worker }}>
      <MigrationSelectedItemsProvider>
        <div>
          {/*<MigrationsDateFilterContainer>*/}
          {/*  <DatePicker*/}
          {/*    slotProps={{*/}
          {/*      textField: {*/}
          {/*        size: "small",*/}
          {/*      },*/}
          {/*    }}*/}
          {/*    value={dateFilter[0]}*/}
          {/*    onChange={(newValue) =>*/}
          {/*      setDateFilter((prev) => [newValue, prev[1]])*/}
          {/*    }*/}
          {/*  />*/}
          {/*  <DatePicker*/}
          {/*    slotProps={{*/}
          {/*      textField: {*/}
          {/*        size: "small",*/}
          {/*      },*/}
          {/*    }}*/}
          {/*    value={dateFilter[1]}*/}
          {/*    onChange={(newValue) =>*/}
          {/*      setDateFilter((prev) => [prev[0], newValue])*/}
          {/*    }*/}
          {/*  />*/}
          {/*</MigrationsDateFilterContainer>*/}
          <MigrationsFilesInput
            migrations={migrations}
            onMigrationsChange={setMigrations}
          />
          <MigrationsChooseAreas migrations={migrations || []} />
          <MigrationsGeneratedTracks />
        </div>
        <MigrationRightPanel />
      </MigrationSelectedItemsProvider>
    </IndexTracksWorkerContext.Provider>
  );
};
