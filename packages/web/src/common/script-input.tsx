import { ScriptConfig } from "@rrrcn/services/dist/src/analytics_config_types";
import React, { useEffect, useState } from "react";
import { Button, Select, TextField } from "@mui/material";
import { scriptKey } from "@rrrcn/services/dist/src/services/ee-data";
import MenuItem from "@mui/material/MenuItem";
import { DateRangesInput } from "./dates-input";
import { useEffectNoOnMount } from "../utils/hooks";

const scripts = ["elevation", "geomorph"];
export const ScriptSelectInput = ({
  value,
  onChange,
}: {
  value?: ScriptConfig;
  onChange?: (config: ScriptConfig) => any;
}) => {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [scriptConfig, setScriptConfig] = useState<ScriptConfig>(
    value || {
      key: "elevation",
    }
  );
  useEffectNoOnMount(() => {
    value && setScriptConfig(value);
  }, [value]);
  useEffectNoOnMount(() => {
    onChange?.(scriptConfig);
  }, [scriptConfig]);
  return (
    <div>
      <Select
        value={scriptConfig.key}
        onChange={({ target: { value } }) => {
          setScriptConfig((prev) => ({ ...prev, key: value as scriptKey }));
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
        <div style={{ transform: "scale(0.7)", left: 0 }}>
          <TextField
            size={"small"}
            label={"Буффер"}
            type={"numeric"}
            value={scriptConfig.buffer}
          />
          <TextField
            size={"small"}
            label={"Scale"}
            type={"numeric"}
            value={scriptConfig.scale}
          />
          <DateRangesInput />
        </div>
      )}
    </div>
  );
};
