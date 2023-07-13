import { IndexedMigration } from "../migrations-choose-tracks";
import React, { useContext } from "react";
import { MapDrawingContext } from "../../../common/map/MapEdit";
import { Button, Typography } from "@mui/material";
import { SEASONS } from "../types";

export const BirdMigrationYear = ({
  migration,
  year,
}: {
  migration: IndexedMigration;
  year: number;
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
}: {
  migration: IndexedMigration;
  year: number;
  season: SEASONS;
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
          showMapObjects(migration.mapObjects.slice(startIndex, endIndex));
        }}
      >
        Show
      </Button>
      <Button
        onClick={() => {
          hideMapObjects(migration.mapObjects.slice(startIndex, endIndex));
        }}
      >
        Hide
      </Button>
    </div>
  );
};
