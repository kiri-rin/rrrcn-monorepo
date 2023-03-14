import React, { useState, useTransition } from "react";
import { Button, Container } from "@mui/material";
import {
  DataExtractionConfig,
  ScriptConfig,
} from "@rrrcn/services/dist/src/analytics_config_types";
import { GeometryInput } from "../../../common/geometry-input";
import { ScriptSelectInput } from "../../../common/script-input";
import { DatesInputConfig } from "../../../common/date-inputs/dates-input";
import { useTranslations } from "../../../utils/translations";
import { serializeRequestToForm } from "../../../utils/request";
import { mapConfigToRequest } from "./utils";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "../../../api";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
export interface ScriptInputConfig extends Omit<ScriptConfig, "dates"> {
  dates?: DatesInputConfig;
}
export interface DataExtractionInput
  extends Omit<DataExtractionConfig<File | undefined>, "scripts"> {
  scripts: ScriptInputConfig[];
}
export const DataExtractionConfigForm = () => {
  const [config, setConfig] = useState<Partial<DataExtractionInput>>({});
  const queryClient = useQueryClient();
  const { data: dataExtractionState, mutateAsync: postDataExtraction } =
    useMutation("data-extraction-result", api.eeData.postApiEeDataExtract, {
      onSuccess(data) {
        queryClient.setQueriesData("data-extraction-result", data);
      },
    });

  const strings = useTranslations();
  const onSend = () => {
    const form = new FormData();
    serializeRequestToForm(
      mapConfigToRequest(config as DataExtractionInput),
      form
    );
    postDataExtraction(form);
  };
  //TODO VALIDATE
  return (
    <div>
      <Box sx={{ marginY: "10px" }}>Выберите точки для получения данных</Box>
      <GeometryInput
        value={config.points}
        onChange={(value) => setConfig((prev) => ({ ...prev, points: value }))}
      />
      <Divider sx={{ marginY: "10px", backgroundColor: "black" }} />
      <Box sx={{ marginY: "10px" }}>Добавьте продукты для получения данных</Box>
      {config.scripts?.map((it, index) => (
        <ScriptSelectInput
          onDelete={() => {
            setConfig((prev) => {
              if (!prev.scripts) {
                return { ...prev, scripts: [config as ScriptInputConfig] };
              }
              prev.scripts = [
                ...prev.scripts.slice(0, index),
                ...prev.scripts.slice(index + 1),
              ] as ScriptInputConfig[];
              return { ...prev, scripts: [...prev.scripts] };
            });
          }}
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
        {strings["data-extraction.add-data"]}
      </Button>
      <Button
        onClick={() => {
          onSend();
        }}
      >
        {strings["data-extraction.get-result"]}
      </Button>
    </div>
  );
};
