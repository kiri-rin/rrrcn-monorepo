import { IndexedMigration } from "../migrations";
import React, { useContext } from "react";
import { MapDrawingContext } from "../../../components/map/MapEdit";
import { Button, Typography } from "@mui/material";
import { SEASONS } from "../types";

export const BirdMigrationYear = ({
  migration,
  year,
  onDeleteMigration,
}: {
  migration: IndexedMigration;
  year: number;
  onDeleteMigration: (year: number, season: SEASONS) => any;
}) => {
  const yearInfo = migration.years[year] || {};
  return (
    <>
      <Typography variant={"h5"}>{year}</Typography>
      {Object.values(SEASONS)
        .filter((season) => yearInfo[season])
        .map((season) => (
          <>
            <Typography variant={"h6"}>{season}</Typography>
            <BirdMigrationSeason
              onDeleteMigration={() => onDeleteMigration(year, season)}
              year={year}
              season={season}
              migration={migration}
            />
          </>
        ))}
    </>
  );
};
export const BirdMigrationSeason = ({
  migration,
  year,
  season,
  onDeleteMigration,
}: {
  migration: IndexedMigration;
  year: number;
  season: SEASONS;
  onDeleteMigration: () => any;
}) => {
  const { map, showMapObjects, hideMapObjects } = useContext(MapDrawingContext);

  const yearInfo = migration.years[year] || {};

  const [startIndex, endIndex] = yearInfo[season] as [number, number];
  const title = `
                    ${migration.geojson.features[
                      startIndex
                    ]?.properties?.date.toISOString()} 
                    - 
                    ${migration.geojson.features[
                      endIndex
                    ]?.properties?.date.toISOString()}`;
  return (
    <div className={"common__row"} key={season + year} title={title}>
      <Typography className={"common__ellipsis-text"}>{title}</Typography>
      <Button
        onClick={() => {
          migration.mapObjects
            .slice(startIndex, endIndex)
            .forEach((it) => it.setOpacity(1));
          showMapObjects(migration.mapObjects.slice(startIndex, endIndex));
        }}
      >
        Show
      </Button>
      <Button
        onClick={() => {
          migration.mapObjects
            .slice(startIndex, endIndex)
            .forEach((it) => it.setOpacity(0));

          hideMapObjects(migration.mapObjects.slice(startIndex, endIndex));
        }}
      >
        Hide
      </Button>
      <Button
        onClick={(e) => {
          onDeleteMigration();
        }}
      >
        Delete
      </Button>
    </div>
  );
};
