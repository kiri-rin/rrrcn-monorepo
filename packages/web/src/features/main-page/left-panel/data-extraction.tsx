import React, { useState, useTransition } from "react";
import { Button, Container } from "@mui/material";
import {
  CommonScriptParams,
  DataExtractionConfig,
  ScriptConfig,
} from "@rrrcn/services/dist/src/analytics_config_types";
import { GeometryInput } from "../../../common/geometry-input";
import { ScriptSelectInput } from "../../../common/script-input";
import { DatesInputConfig } from "../../../common/date-inputs/dates-input";
import { useTranslations } from "../../../utils/translations";
import { serializeRequestToForm } from "../../../utils/request";
import { mapScriptsConfigToRequest } from "./utils";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "../../../api";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import set = Reflect.set;
export interface ScriptInputConfig extends Omit<ScriptConfig, "dates"> {
  dates?: DatesInputConfig;
}
export interface DataExtractionInput
  extends Omit<
    DataExtractionConfig<File | undefined>,
    "scripts" | "defaultScriptParams"
  > {
  defaultScriptParams: Omit<CommonScriptParams, "dates"> & {
    dates: DatesInputConfig;
  };
  scripts: ScriptInputConfig[];
}
export const DataExtractionConfigForm = ({
  value: config,
  onChange: setConfig,
  errors,
}: {
  value: Partial<DataExtractionInput>;
  onChange: (val: Partial<DataExtractionInput>) => any;
  errors?: Partial<DataExtractionInput>;
}) => {
  const strings = useTranslations();
  //TODO VALIDATE
  return (
    <div>
      <Box sx={{ marginY: "10px" }}>
        {strings["data-extraction.choose-points"]}
      </Box>
      <GeometryInput
        value={config.points}
        onChange={(value) => setConfig({ points: value })}
      />
      <Divider sx={{ marginY: "10px", backgroundColor: "black" }} />
      <Box sx={{ marginY: "10px" }}>
        {strings["data-extraction.choose-params"]}
      </Box>
      {config.scripts?.map((it, index) => (
        <ScriptSelectInput
          onDelete={() => {
            const scripts = [
              ...(config.scripts?.slice(0, index) || []),
              ...(config.scripts?.slice(index + 1) || []),
            ] as ScriptInputConfig[];
            setConfig({ scripts });
          }}
          key={index}
          onChange={(scriptConfig) => {
            if (!config?.scripts) {
              return setConfig({
                scripts: [scriptConfig as ScriptInputConfig],
              });
            } else {
              const scripts = [...config.scripts];
              scripts[index] = {
                ...scripts[index],
                ...scriptConfig,
              } as ScriptInputConfig;
              setConfig({ scripts });
            }
          }}
          value={it}
        />
      ))}
      <Button
        onClick={() => {
          setConfig({
            scripts: [...(config.scripts || []), { key: "elevation" }],
          });
        }}
      >
        {strings["data-extraction.add-data"]}
      </Button>
    </div>
  );
};
