import { Button, Dialog } from "@mui/material";
import { IndexedArea } from "@rrrcn/services/dist/src/controllers/migrations/types";
import { uniq } from "lodash";
import { useMemo } from "react";
import { useTranslations } from "@/utils/translations";

export const MigrationSelectedAreaStatisticsModal = ({
  area,
  onClose,
}: {
  onClose: () => void;
  area: IndexedArea;
}) => {
  const t = useTranslations();
  const altitudes = useMemo(() => {
    return uniq([
      ...Object.keys(area.altitudeStatistics),
      ...area.probabilities.altitudes.map((it) => String(it.value)),
    ]).sort((a, b) => Math.sign(Number(a) - Number(b)));
  }, [area]);

  return (
    <Dialog
      style={{ marginTop: 100, marginBottom: 100 }}
      open={true}
      onClose={onClose}
    >
      <table>
        <tr>
          <td>{t["migrations.area-heights"]}</td>
          <td>{t["migrations.area-real-heights"]}</td>
          <td>{t["migrations.area-generated-heights"]}</td>
        </tr>
        {altitudes.map((it) => (
          <tr>
            <td>{it}</td>
            <td>
              {area.probabilities.altitudes.find(
                ({ value: alt, count }) => String(alt) === String(it)
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
