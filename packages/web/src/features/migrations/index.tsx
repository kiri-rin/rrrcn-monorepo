import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { MigrationSelectedItemsProvider } from "./utils/selected-items-context";

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
              <MigrationsChooseAreas />
            </div>
            <MigrationRightPanel />
          </MigrationSelectedItemsProvider>
        </MigrationsContext.Provider>
      </VulnerabilityWorkerContext.Provider>
    </IndexTracksWorkerContext.Provider>
  );
};
export type MigrationsContextType = {
  migrations?: Migration[];
  setMigrations: React.Dispatch<React.SetStateAction<Migration[] | undefined>>;
  setSelectedSeasons: React.Dispatch<
    React.SetStateAction<SelectedTracksSeasonsType>
  >;
  selectedSeasons: SelectedTracksSeasonsType;
  addSelectedSeason: (trackId: string, year: string, season: SEASONS) => void;
  removeSelectedSeason: (
    trackId: string,
    year: string,
    season: SEASONS
  ) => void;
  toggleSelectedSeason: (
    trackId: string,
    year: string,
    season: SEASONS
  ) => void;
};
export const MigrationsContext = createContext<MigrationsContextType>({
  setMigrations: () => {},
  setSelectedSeasons: () => {},
  addSelectedSeason: () => {},
  removeSelectedSeason: () => {},
  toggleSelectedSeason: () => {},
  selectedSeasons: {},
});
const useMigrationContextValues = (): MigrationsContextType => {
  const [migrations, setMigrations] = useState<
    IndexedMigration[] | undefined
  >();
  const [selectedSeasons, setSelectedSeasons] =
    useState<SelectedTracksSeasonsType>({});
  const addSelectedSeason = useCallback(
    (trackId: string, year: string, season: SEASONS) => {
      setSelectedSeasons((prevState) => {
        const newState = { ...prevState };
        if (!newState[trackId]) {
          newState[trackId] = {};
        }
        if (!newState[trackId][year]) {
          newState[trackId][year] = {};
        }
        newState[trackId][year][season] = true;
        return newState;
      });
    },
    []
  );
  const removeSelectedSeason = useCallback(
    (trackId: string, year: string, season: SEASONS) => {
      setSelectedSeasons((prevState) => {
        const newState = { ...prevState };
        if (!newState[trackId]) {
          newState[trackId] = {};
        }
        if (!newState[trackId][year]) {
          newState[trackId][year] = {};
        }
        newState[trackId][year][season] = false;
        return newState;
      });
    },
    []
  );
  const toggleSelectedSeason = useCallback(
    (trackId: string, year: string, season: SEASONS) => {
      setSelectedSeasons((prevState) => {
        const newState = { ...prevState };
        if (!newState[trackId]) {
          newState[trackId] = {};
        }
        if (!newState[trackId][year]) {
          newState[trackId][year] = {};
        }
        newState[trackId][year][season] = !newState[trackId][year][season];
        return newState;
      });
    },
    []
  );
  return {
    migrations,
    setMigrations,
    selectedSeasons,
    setSelectedSeasons,
    addSelectedSeason,
    removeSelectedSeason,
    toggleSelectedSeason,
  };
};
export const useMigrationsContext = () => useContext(MigrationsContext);
