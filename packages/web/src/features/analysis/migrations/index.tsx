import React from "react";
import { Migration, SEASONS } from "./types";
import { MigrationsChooseAreas } from "./components/generate-tracks";
import { MigrationsFilesInput } from "./components/migrations-files";
import {
  IndexTracksWorkerContext,
  useIndexTracksWorker,
  useProcessVulnerabilityWorker,
  VulnerabilityWorkerContext,
} from "./workers/context";
import { MigrationRightPanel } from "./components/migration-right-panel";
import { MigrationSelectedItemsProvider } from "./context/selected-items";
import {
  MigrationsContext,
  useMigrationContextValues,
} from "./context/migrations";
import {
  MigrationVulnerabilityContextProvider,
  useMigrationVulnerabilityContextValue,
} from "./context/vulnerability-areas";
import { MigrationsVulnerability } from "./components/vulnerability";
import { MigrationsHabitatAreas } from "@/features/analysis/migrations/components/habitat-areas";

export type SelectedSeasonsType = {
  [year: string]: { [season in SEASONS]?: boolean };
};
export type SelectedTracksSeasonsType = {
  [trackId: string]: SelectedSeasonsType;
};
export type IndexedMigration = Migration;
export const MigrationsForm = () => {
  const contextValues = useMigrationContextValues();
  const worker = useIndexTracksWorker();
  const vulnerabilityWorker = useProcessVulnerabilityWorker();
  const vulnerabilityContextValues = useMigrationVulnerabilityContextValue();
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
      <VulnerabilityWorkerContext.Provider
        value={{ worker: vulnerabilityWorker }}
      >
        <MigrationsContext.Provider value={contextValues}>
          <MigrationSelectedItemsProvider>
            <MigrationVulnerabilityContextProvider
              value={vulnerabilityContextValues}
            >
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
                <MigrationsFilesInput />
                <MigrationsHabitatAreas />
                <MigrationsChooseAreas />
              </div>
              <MigrationRightPanel />
            </MigrationVulnerabilityContextProvider>
          </MigrationSelectedItemsProvider>
        </MigrationsContext.Provider>
      </VulnerabilityWorkerContext.Provider>
    </IndexTracksWorkerContext.Provider>
  );
};
