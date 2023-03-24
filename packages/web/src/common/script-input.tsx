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
import { FormikErrors, useField, useFormikContext } from "formik";
const scripts = ["elevation", "geomorph", "ndvi"];
export const ScriptSelectInput = ({
  onDelete,
  name,
}: {
  onDelete?: () => any;

  name: string;
}) => {
  const strings = useTranslations();
  const { data: scriptsList } = useQuery(
    "analysis-scripts",
    (opt) => api.analysis.getApiAnalysisScripts(),
    { enabled: false, refetchOnWindowFocus: false }
  );
  const [{ value: scriptConfig }, fieldMeta, { setValue: setConfig }] =
    useField<ScriptInputConfig>(name);
  const errors = fieldMeta.error as FormikErrors<ScriptInputConfig>;
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  return (
    <Box className={"script-input"}>
      <Select
        error={!!errors?.key}
        className={"script-input__select"}
        value={scriptConfig?.key}
        onChange={({ target: { value: _value } }) => {
          setConfig?.({ ...scriptConfig, key: _value as scriptKey });
        }}
        size={"small"}
      >
        {scriptsList?.data?.map((it: any) => (
          <MenuItem key={it} value={it}>
            {it}
          </MenuItem>
        ))}
      </Select>

      {showAdvancedSettings && <ScriptAdvanceSettings name={name} />}
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
const ScriptAdvanceSettings = ({ name }: { name: string }) => {
  const [{ value }, { error }, { setValue: onChange }] =
    useField<ScriptInputConfig>(name);
  const strings = useTranslations();
  return (
    <div className={"script-input__advanced-settings"}>
      <div className={"script-input__advanced-settings__buffer-container"}>
        <TextField
          size={"small"}
          label={strings["script-input.buffer"]}
          type={"numeric"}
          onChange={({ target: { value: val } }) =>
            onChange({
              ...value,
              buffer: Number(val) as ScriptConfig["buffer"],
            })
          }
          value={value.buffer}
        />
        <Select
          size={"small"}
          value={value.mode}
          onChange={({ target: { value: val } }) =>
            onChange({ ...value, mode: val as ScriptConfig["mode"] })
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
          onChange({ ...value, scale: Number(val) as ScriptConfig["scale"] })
        }
      />
      <TextField
        size={"small"}
        label={strings["script-input.filename"]}
        value={value.filename}
        onChange={({ target: { value: val } }) =>
          onChange({ ...value, filename: val as ScriptConfig["filename"] })
        }
      />
      <ScriptDatesInput name={`${name}.dates`} />
    </div>
  );
};
