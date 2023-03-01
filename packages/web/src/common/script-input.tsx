import { ScriptConfig } from "@rrrcn/services/dist/src/analytics_config_types";
import React, { useEffect, useState } from "react";
import { Button, Select, TextField } from "@mui/material";
import { scriptKey } from "@rrrcn/services/dist/src/services/ee-data";
import MenuItem from "@mui/material/MenuItem";
import { DatesIntervalsInput, ScriptDatesInput } from "./dates-input";
import { useEffectNoOnMount } from "../utils/hooks";
import { ScriptInputConfig } from "../features/data-extraction/components/config-form";

const scripts = ["elevation", "geomorph"];
export const ScriptSelectInput = ({
  value: scriptConfig,
  onChange,
}: {
  value: ScriptInputConfig;
  onChange?: (config: Partial<ScriptInputConfig>) => any;
}) => {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  return (
    <div>
      <Select
        value={scriptConfig.key}
        onChange={({ target: { value: _value } }) => {
          onChange?.({ key: _value as scriptKey });
        }}
        size={"small"}
      >
        {scripts.map((it) => (
          <MenuItem key={it} value={it}>
            {it}
          </MenuItem>
        ))}
      </Select>
      <Button
        size={"small"}
        onClick={() => setShowAdvancedSettings((prev) => !prev)}
      >
        Расширенные настройки
      </Button>
      {showAdvancedSettings && (
        <ScriptAdvanceSettings
          value={scriptConfig}
          onChange={(adv) => onChange?.(adv)}
        />
      )}
    </div>
  );
};
const ScriptAdvanceSettings = ({
  value,
  onChange,
}: {
  value: Omit<ScriptInputConfig, "key">;
  onChange: (val: Partial<Omit<ScriptInputConfig, "key">>) => any;
}) => {
  return (
    <div style={styles.advancedSettings}>
      <div>
        <TextField
          size={"small"}
          label={"Буффер"}
          type={"numeric"}
          value={value.buffer}
        />
        <Select
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
        label={"scale"}
        type={"numeric"}
        value={value.scale}
        onChange={({ target: { value: val } }) =>
          onChange({ scale: Number(val) as ScriptConfig["scale"] })
        }
      />
      <TextField
        size={"small"}
        label={"filename"}
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
