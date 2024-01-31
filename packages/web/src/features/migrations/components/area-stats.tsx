import { Button, Dialog } from "@mui/material";
import { IndexedArea } from "@rrrcn/services/dist/src/controllers/migrations/types";
import { uniq } from "lodash";
import { useMemo } from "react";
import { useTranslations } from "../../../utils/translations";

export const MigrationSelectedAreaStatisticsModal = ({
  area,
  onClose,
}: {
  onClose: () => void;
  area: IndexedArea;
}) => {
  const altitudes = useMemo(() => {
    return uniq([
      ...Object.keys(area.altitudeStatistics),
      ...area.probabilities.altitudes.map((it) => it.value),
    ]);
  }, []);
  const t = useTranslations();
  return (
    <Dialog open={true} onClose={onClose}>
      <table>
        {altitudes.map((it) => (
          <tr>
            <td>{it}</td>
            <td>
              {area.probabilities.altitudes.find(
                ({ value: alt, count }) => alt === it
              )?.count || ""}
            </td>
            <td>{area.altitudeStatistics[it] || ""}</td>
          </tr>
        ))}
      </table>
      <Button onClick={() => onClose()}>{t["common.close"]}</Button>
    </Dialog>
  );
};
