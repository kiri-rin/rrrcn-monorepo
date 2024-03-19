import { IndexedMigration } from "../../../../index";
import { SEASONS } from "../../../../types";
import React, { useMemo } from "react";
import Modal from "@mui/material/Modal";
import { Offset } from "../../../../../../../App";
import { Box, Button } from "@mui/material";
import { useTranslations } from "@/utils/translations";

export const BirdMigrationSelectSeasonModal = ({
  onCancel,
  migration,
  onFinish,
  selectedMigration,
}: {
  onCancel: () => any;
  migration: IndexedMigration;
  onFinish: (year: number, season: SEASONS) => any;
  selectedMigration?: [number, number | null];
}) => {
  const t = useTranslations();
  const selectedYears = useMemo(() => {
    if (!selectedMigration?.every((it) => it !== null)) {
      return [];
    }
    const [startIndex, endIndex] = selectedMigration as [number, number];
    const startYear =
      migration.geojson.features[startIndex].properties.date.getFullYear();
    const endYear =
      migration.geojson.features[endIndex].properties.date.getFullYear();
    return new Array(endYear - startYear + 1)
      .fill(0)
      .map((it, index) => startYear + index);
  }, [selectedMigration]);
  return (
    <Modal open={true}>
      <>
        <Offset />
        <Box
          className={"common-modal__body"}
          style={{ backgroundColor: "white" }}
        >
          {selectedYears.map((year) => {
            const migrationInfo = migration.years[year] || {};
            return Object.values(SEASONS)
              .filter((season) => !migrationInfo[season])
              .map((season) => (
                <Button
                  key={season + year}
                  onClick={() => {
                    onFinish(year, season);
                  }}
                >
                  {t["migrations.add-season"]}Add {t[`migrations.${season}`]}{" "}
                  {year}
                </Button>
              ));
          })}
          <Button onClick={onCancel}>{t["common.cancel"]}</Button>
        </Box>
      </>
    </Modal>
  );
};
