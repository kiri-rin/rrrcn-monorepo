import { IndexedMigration } from "../../../../index";
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Migration, MigrationYear, SEASONS } from "../../../../types";
import { BirdMigrationSelectSeasonModal } from "./add-migration-modal";
import { serializeMigrationSeason } from "../../use-map-track";
import {
  MigrationSeasonDates,
  MigrationSeasonShowMarkersButton,
  MigrationSeasonTitle,
  MigrationSeasonTitleRow,
} from "./style";
import { useMigrationsContext } from "../../../../context/migrations";
import { Strings, useTranslations } from "../../../../../../utils/translations";
import { ruTranslations } from "../../../../../../utils/translations/ru";

const sortedSeasons = [
  SEASONS.WINTER,
  SEASONS.SPRING,
  SEASONS.SUMMER,
  SEASONS.AUTUMN,
];
export const BirdMigrationYear = ({
  migration,
  year,
  onDeleteMigration,
  onShowSeason,
  onHideSeason,
  onChangeMigration,
  shownSeasons,
}: {
  shownSeasons: Set<string>;
  shownSeasonsPoints: Set<string>;
  migration: IndexedMigration; //TODO refactor, remove all migration from props
  year: string;
  onDeleteMigration: (year: string, season: SEASONS) => void;
  onChangeMigration: (migration: Migration) => void;
  onShowSeason: (season: SEASONS) => any;
  onHideSeason: (season: SEASONS) => any;
}) => {
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [editMigration, setEditMigration] = useState<SEASONS | null>(null);
  const [addMigration, setAddMigration] = useState<SEASONS | null>(null);
  const [newSeasonMigration, setNewSeasonMigration] = useState<
    [number, number | null] | undefined
  >();
  const t = useTranslations();
  const yearInfo = migration.years[year] || {};
  const onAddMigration = useCallback((season: SEASONS) => {
    setEditMigration(null);
    setAddMigration(season);
  }, []);
  const onEditMigration = useCallback((season: SEASONS) => {
    setEditMigration(season);
    setAddMigration(null);
  }, []);
  useEffect(() => {
    if (newSeasonMigration?.filter((it) => it !== null).length === 2) {
      setShowSeasonModal(true);
    }
  }, [newSeasonMigration]);
  const finishEdit = useCallback(
    (year: number, season: SEASONS) => {
      const newMigration = { ...migration };
      if (!newMigration.years[year]) {
        newMigration.years[year] = {} as MigrationYear;
      }
      newMigration.years[year][season] = [
        ...(newSeasonMigration as [number, number]),
      ];
      onChangeMigration(newMigration);
      setShowSeasonModal(false);
      setNewSeasonMigration(undefined);
      // onChangeEditState(false);
    },
    [migration, newSeasonMigration]
  );
  return (
    <>
      <Typography variant={"h5"}>{year}</Typography>
      {sortedSeasons
        .filter((season) => yearInfo[season])
        .map((season) => (
          <>
            <BirdMigrationSeason
              isEdit={editMigration === season}
              onEdit={() => {
                setEditMigration(season);
              }}
              onCancelEdit={() => {
                setEditMigration(null);
              }}
              onChange={([start, end]) => {
                const newMigration = {
                  ...migration,
                  years: {
                    ...migration.years,
                    [year]: {
                      ...migration.years[year],
                      [season]: [start, end],
                    },
                  },
                };
                onChangeMigration(newMigration);
                setEditMigration(null);
              }}
              onDeleteMigration={() => onDeleteMigration(year, season)}
              year={year}
              season={season}
              isShown={shownSeasons.has(
                serializeMigrationSeason({ year, season })
              )}
              onShowSeason={() => onShowSeason(season)}
              onHideSeason={() => onHideSeason(season)}
              migration={migration}
            />
          </>
        ))}
      {addMigration && (
        <>
          <Typography variant={"h6"}>
            {
              t[
                `migrations.${addMigration.toLowerCase()}` as unknown as keyof Strings
              ] as string
            }
          </Typography>
          <BirdMigrationSeason
            isNew={true}
            onEdit={() => {}}
            onCancelEdit={() => {
              setAddMigration(null);
            }}
            onChange={([start, end]) => {
              const newMigration = {
                ...migration,
                years: {
                  ...migration.years,
                  [year]: {
                    ...migration.years[year],
                    [addMigration]: [start, end],
                  },
                },
              };
              onChangeMigration(newMigration);
              setAddMigration(null);
            }}
            onDeleteMigration={() => {}}
            year={year}
            season={addMigration}
            isShown={false}
            onShowSeason={() => {}}
            onHideSeason={() => {}}
            migration={migration}
          />
        </>
      )}
      <Button
        onClick={() => {
          setShowSeasonModal(true);
        }}
      >
        {t["migrations.add-migration"]}
      </Button>
      {showSeasonModal && (
        <BirdMigrationSelectSeasonModal
          migration={migration}
          onCancel={() => {
            setAddMigration(null);
            setShowSeasonModal(false);
          }}
          onFinish={(year, season) => {
            setShowSeasonModal(false);
            setAddMigration(null);

            onAddMigration(season);
          }}
          selectedMigration={[0, 0]}
        />
      )}
    </>
  );
};
export const BirdMigrationSeason = ({
  migration,
  year,
  season,
  onDeleteMigration,
  onShowSeason,
  onHideSeason,
  isEdit,
  isShown,
  isPointsShown,
  onChange,
  onCancelEdit,
  onEdit,
  isNew,
}: {
  isNew?: boolean;
  isEdit?: boolean;
  isShown?: boolean;
  isPointsShown?: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  migration: IndexedMigration;
  year: string;
  season: SEASONS;
  onDeleteMigration: () => any;
  onShowSeason: () => any;
  onHideSeason: () => any;
  onChange: (indices: [number, number]) => void;
}) => {
  const { selectedSeasons, addSelectedSeason, toggleSelectedSeason } =
    useMigrationsContext();
  const t = useTranslations();
  const yearInfo = migration.years[year] || {};
  const defaultIndices = isNew
    ? [0, 0]
    : (yearInfo[season] as [number | null, number | null]);
  const [[startIndex, endIndex], setSeason] = useState(defaultIndices);
  const title = !isNew
    ? `
                    ${migration.geojson.features[
                      yearInfo[season]![0]
                    ]?.properties?.date.toLocaleDateString()} 
                    - 
                    ${migration.geojson.features[
                      yearInfo[season]![1]
                    ]?.properties?.date.toLocaleDateString()}`
    : "";
  return (
    <div key={season + year} title={title}>
      <MigrationSeasonTitleRow>
        <FormControlLabel
          label={
            <>
              <MigrationSeasonDates>
                <MigrationSeasonTitle>
                  {t[`migrations.${season}`]}
                </MigrationSeasonTitle>
                {title}
              </MigrationSeasonDates>
            </>
          }
          checked={!!selectedSeasons[migration.id]?.[year]?.[season]}
          onChange={() => toggleSelectedSeason(migration.id, year, season)}
          control={<Checkbox />}
        />
        <MigrationSeasonShowMarkersButton
          fill={isShown ? "blue" : "gray"}
          onClick={() => {
            isShown ? onHideSeason() : onShowSeason();
          }}
        />
      </MigrationSeasonTitleRow>

      {(isEdit || isNew) && (
        <div>
          <TextField
            type={"number"}
            value={startIndex}
            onChange={({ target: { value } }) =>
              setSeason((prev) => [
                value !== "" ? Number(value) : null,
                prev[1],
              ])
            }
          />
          <TextField
            type={"number"}
            value={endIndex}
            onChange={({ target: { value } }) =>
              setSeason((prev) => [
                prev[0],
                value !== "" ? Number(value) : null,
              ])
            }
          />
        </div>
      )}

      <Button
        onClick={(e) => {
          if (isEdit) {
            onCancelEdit();
            setSeason(defaultIndices);
          } else {
            onEdit();
          }
        }}
      >
        {isEdit || isNew ? t["common.cancel"] : t["common.edit"]}
      </Button>
      {(isEdit || isNew) && (
        <Button
          onClick={(e) => {
            startIndex !== null &&
              endIndex !== null &&
              onChange([startIndex, endIndex]);
          }}
        >
          {t["common.save"]}
        </Button>
      )}
      {!isNew && (
        <Button
          onClick={(e) => {
            onDeleteMigration();
          }}
        >
          {t["common.delete"]}
        </Button>
      )}
    </div>
  );
};
