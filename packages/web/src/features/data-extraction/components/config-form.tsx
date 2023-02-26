import React, { useState } from "react";
import { Button } from "@mui/material";
import {
  DataExtractionConfig,
  ScriptConfig,
} from "@rrrcn/services/dist/src/analytics_config_types";
import { GeometryInput } from "../../../common/geometry-input";
import { ScriptSelectInput } from "../../../common/script-input";
export interface DataExtractionInput
  extends DataExtractionConfig<File | undefined> {
  scripts: ScriptConfig[];
}
export const DataExtractionConfigForm = ({
  onSend,
}: {
  onSend?: (config: Partial<DataExtractionInput>) => any;
}) => {
  const [config, setConfig] = useState<Partial<DataExtractionInput>>({});
  //TODO VALIDATE
  return (
    <div>
      <GeometryInput
        value={config.points}
        onChange={(value) => setConfig((prev) => ({ ...prev, points: value }))}
      />
      {config.scripts?.map((it, index) => (
        <ScriptSelectInput
          key={index}
          onChange={(config) => {
            setConfig((prev) => {
              if (!prev.scripts) {
                return { ...prev, scripts: [config] };
              }
              prev.scripts[index] = config;
              return { ...prev };
            });
          }}
          value={it}
        />
      ))}
      <Button
        onClick={() => {
          setConfig((prev) => ({
            ...prev,
            scripts: [...(prev.scripts || []), { key: "elevation" }],
          }));
        }}
      >
        Добавить данные
      </Button>
      <Button
        onClick={() => {
          onSend?.(config);
        }}
      >
        Получить результат
      </Button>
    </div>
  );
};
