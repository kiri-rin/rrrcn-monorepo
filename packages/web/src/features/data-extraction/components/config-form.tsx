import React, { useState } from "react";
import { Button } from "@mui/material";
import {
  DataExtractionConfig,
  ScriptConfig,
} from "@rrrcn/services/dist/src/analytics_config_types";
import { GeometryInput } from "../../../common/geometry-input";
import { ScriptSelectInput } from "../../../common/script-input";
import { DatesInputConfig } from "../../../common/dates-input";
export interface ScriptInputConfig extends Omit<ScriptConfig, "dates"> {
  dates?: DatesInputConfig;
}
export interface DataExtractionInput
  extends Omit<DataExtractionConfig<File | undefined>, "scripts"> {
  scripts: ScriptInputConfig[];
}
export const DataExtractionConfigForm = ({
  onSend,
}: {
  onSend?: (config: Partial<DataExtractionInput>) => any;
}) => {
  const [config, setConfig] = useState<Partial<DataExtractionInput>>({});
  console.log(config);
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
                return { ...prev, scripts: [config as ScriptInputConfig] };
              }
              prev.scripts[index] = {
                ...prev.scripts[index],
                ...config,
              } as ScriptInputConfig;
              return { ...prev, scripts: [...prev.scripts] };
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
