import { ScriptConfig } from "@rrrcn/services/dist/src/analytics_config_types";
import React, { useEffect, useState } from "react";
import { Button, Select, TextField } from "@mui/material";
import { scriptKey } from "@rrrcn/services/dist/src/services/ee-data";
import MenuItem from "@mui/material/MenuItem";
import {
  DatesIntervalsInput,
  ScriptDatesInput,
} from "./date-inputs/dates-input";
import { useEffectNoOnMount } from "../utils/hooks";
import { ScriptInputConfig } from "../features/main-page/left-panel/data-extraction";
import { useTranslations } from "../utils/translations";
import "./script-input.scss";

import Box from "@mui/material/Box";
import { useQuery } from "react-query";
import { api } from "../api";
const scripts = ["elevation", "geomorph", "ndvi"];
export const ScriptSelectInput = ({
  value: scriptConfig,
  onChange,
  onDelete,
  error,
}: {
  value: ScriptInputConfig;
  onChange?: (config: Partial<ScriptInputConfig>) => any;
  onDelete?: () => any;
  error?: string;
}) => {
  const strings = useTranslations();
  const { data: scriptsList } = useQuery(
    "analysis-scripts",
    (opt) => api.analysis.getApiAnalysisScripts(),
    { enabled: false, refetchOnWindowFocus: false }
  );

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  return (
    <Box className={"script-input"}>
      <Select
        className={"script-input__select"}
        value={scriptConfig.key}
        onChange={({ target: { value: _value } }) => {
          onChange?.({ key: _value as scriptKey });
        }}
        size={"small"}
      >
        {scriptsList?.data?.map((it: any) => (
          <MenuItem key={it} value={it}>
            {it}
          </MenuItem>
        ))}
      </Select>

      {showAdvancedSettings && (
        <ScriptAdvanceSettings
          value={scriptConfig}
          onChange={(adv) => onChange?.(adv)}
        />
      )}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          className={"script-input__advanced-button"}
          size={"small"}
          onClick={() => onDelete?.()}
        >
          {strings["common.delete"]}
        </Button>
        <Button
          className={"script-input__advanced-button"}
          size={"small"}
          style={{ marginLeft: "auto" }}
          onClick={() => setShowAdvancedSettings((prev) => !prev)}
        >
          {strings["common.advanced-settings"]}
        </Button>
      </div>
    </Box>
  );
};
const ScriptAdvanceSettings = ({
  value,
  onChange,
}: {
  value: Omit<ScriptInputConfig, "key">;
  onChange: (val: Partial<Omit<ScriptInputConfig, "key">>) => any;
}) => {
  const strings = useTranslations();
  return (
    <div className={"script-input__advanced-settings"}>
      <div className={"script-input__advanced-settings__buffer-container"}>
        <TextField
          size={"small"}
          label={strings["script-input.buffer"]}
          type={"numeric"}
          onChange={({ target: { value: val } }) =>
            onChange({ buffer: Number(val) as ScriptConfig["buffer"] })
          }
          value={value.buffer}
        />
        <Select
          size={"small"}
          value={value.mode}
          onChange={({ target: { value: val } }) =>
            onChange({ mode: val as ScriptConfig["mode"] })
          }
        >
          <MenuItem value={"SUM"}>SUM</MenuItem>
          <MenuItem value={"MEAN"}>MEAN</MenuItem>
        </Select>
      </div>
      <TextField
        size={"small"}
        label={strings["script-input.scale"]}
        type={"numeric"}
        value={value.scale}
        onChange={({ target: { value: val } }) =>
          onChange({ scale: Number(val) as ScriptConfig["scale"] })
        }
      />
      <TextField
        size={"small"}
        label={strings["script-input.filename"]}
        type={"numeric"}
        value={value.filename}
        onChange={({ target: { value: val } }) =>
          onChange({ filename: val as ScriptConfig["filename"] })
        }
      />
      <ScriptDatesInput
        value={value.dates || []}
        onChange={(dates) => onChange({ dates })}
      />
    </div>
  );
};
const styles: { [p: string]: React.CSSProperties } = {
  //TODO move to SCSS
  advancedSettings: {
    marginRight: 2,
    display: "flex",
    flexDirection: "column",
  },
};
