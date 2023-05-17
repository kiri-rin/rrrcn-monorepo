import React, { useState, useTransition } from "react";
import { Button, Container } from "@mui/material";
import {
  CommonScriptParams,
  DataExtractionConfig,
  ScriptConfig,
} from "@rrrcn/services/dist/src/analytics_config_types";
import { GeometryInput } from "../../common/geometry-input";
import { ScriptSelectInput } from "../../common/script-input";
import { DatesInputConfig } from "../../common/date-inputs/dates-input";
import { useTranslations } from "../../utils/translations";
import { serializeRequestToForm } from "../../utils/request";
import { mapScriptsConfigToRequest } from "./utils";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "../../api";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {
  useFormikContext,
  Formik,
  Form,
  Field,
  useField,
  FieldArray,
  FormikErrors,
} from "formik";
import { CommonPaper } from "../../common/common";
import Typography from "@mui/material/Typography";

export interface ScriptInputConfig extends Omit<ScriptConfig, "dates"> {
  dates?: DatesInputConfig;
}
export interface DataExtractionInput
  extends Omit<
    DataExtractionConfig<File | undefined>,
    "scripts" | "defaultScriptParams"
  > {
  defaultScriptParams: Omit<CommonScriptParams, "dates"> & {
    dates?: DatesInputConfig;
  };
  scripts: ScriptInputConfig[];
}

export const DataExtractionConfigForm = ({ name }: { name: string }) => {
  const strings = useTranslations();
  const { touched, submitCount } = useFormikContext<any>();
  const [{ value: config = {} }, fieldMeta, { setValue: setConfig }] =
    useField<Partial<DataExtractionInput>>(name);
  const { data: scriptsList } = useQuery(
    "analysis-scripts",
    (opt) => api.analysis.getApiAnalysisScripts(),
    { enabled: false, refetchOnWindowFocus: false }
  );
  const errors = fieldMeta.error as FormikErrors<Partial<DataExtractionInput>>;
  console.log(touched);
  //TODO VALIDATE
  return (
    <div>
      <CommonPaper
        error={(touched?.[`${name}.points`] || submitCount) && errors?.points}
      >
        {" "}
        <Box sx={{ marginY: "10px" }}>
          {strings["data-extraction.choose-points"]}
        </Box>
        <GeometryInput
          value={config.points}
          onChange={(value) => setConfig({ ...config, points: value })}
        />
      </CommonPaper>

      <Divider sx={{ marginY: "10px", backgroundColor: "black" }} />
      <CommonPaper
        error={(touched?.[`${name}.scripts`] || submitCount) && errors?.scripts}
      >
        <Typography sx={{ marginY: "10px" }}>
          {strings["data-extraction.choose-params"]}
        </Typography>
        <FieldArray name={`${name}.scripts`}>
          {({ push, remove, name: _name }) => (
            <>
              {config?.scripts?.map((it: any, index: number) => (
                <ScriptSelectInput
                  key={it.id}
                  name={`${_name}.${index}`}
                  onDelete={() => {
                    remove(index);
                  }}
                />
              ))}
              <Button
                onClick={() => {
                  push({ id: Math.random(), key: scriptsList?.data?.[0] }); //TODO create new id getter
                }}
              >
                {strings["data-extraction.add-data"]}
              </Button>
            </>
          )}
        </FieldArray>
      </CommonPaper>
    </div>
  );
};
