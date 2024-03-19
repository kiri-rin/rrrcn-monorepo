import { Migration, SEASONS } from "../types";
import React, { createContext, useCallback, useContext, useState } from "react";
import { IndexedMigration, SelectedTracksSeasonsType } from "../index";

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
export const useMigrationContextValues = (): MigrationsContextType => {
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
