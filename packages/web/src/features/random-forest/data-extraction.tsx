import React, { useState, useTransition } from "react";
import { AccordionDetails, Button, Container } from "@mui/material";
import type {
  CommonScriptParams,
  DataExtractionConfig,
  ScriptConfig,
} from "@rrrcn/services/src/analytics_config_types";
import { GeometryInput } from "../../components/geometry-input";
import { ScriptSelectInput } from "../../components/script-input";
import { DatesInputConfig } from "../../components/date-inputs/dates-input";
import { useTranslations } from "../../utils/translations";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "../../api";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { FieldArray, useFormik, FormikContext } from "formik";
import { CommonPaper } from "../../components/common";
import Typography from "@mui/material/Typography";
import { useSendAnalysis } from "../common/utils";
import { DataExtractionValidationSchema } from "./data-schemas";
import { PasteScriptsConfigModal } from "./components/paste-scripts-config";
import { RandomForestInputConfig } from "./random-forest";

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
export const DataExtractionConfigForm = () => {
  const strings = useTranslations();
  const { onSend } = useSendAnalysis("data");
  const formik = useFormik<Partial<DataExtractionInput>>({
    initialValues: {},
    validationSchema: DataExtractionValidationSchema,
    onSubmit: (data) => {
      onSend(data);
    },
  });
  const {
    submitCount,
    touched,
    values: config,
    errors,
    submitForm,
    setValues: setConfig,
  } = formik;
  const { data: scriptsList } = useQuery(
    "analysis-scripts",
    (opt) => api.analysis.getApiAnalysisScripts(),
    { enabled: false, refetchOnWindowFocus: false }
  );
  const [openImportConfig, setOpenImport] = useState(false);

  //TODO VALIDATE
  return (
    <FormikContext.Provider value={formik}>
      <div>
        <CommonPaper
          error={(touched?.[`points`] || submitCount) && errors?.points}
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
          error={(touched?.[`scripts`] || submitCount) && errors?.scripts}
        >
          <Typography sx={{ marginY: "10px" }}>
            {strings["data-extraction.choose-params"]}
          </Typography>
          <FieldArray name={`scripts`}>
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
          {/*//TODO MOVE ALL THIS MODULE TO ONE FILE*/}
          <Button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(config.scripts));
            }}
          >
            {strings["data-extraction.copy-config"]}
          </Button>
          <Button
            onClick={() => {
              setOpenImport(true);
            }}
          >
            {strings["data-extraction.import-config"]}
          </Button>
          {openImportConfig && (
            <PasteScriptsConfigModal
              onClose={() => setOpenImport(false)}
              open={openImportConfig}
              onSubmit={(data) => {
                formik.setFieldValue("scripts", data.scripts);
                setOpenImport(false);
              }}
            />
          )}
        </CommonPaper>
        <Button
          onClick={() => {
            submitForm();
          }}
        >
          {strings["data-extraction.get-result"]}
        </Button>
      </div>
    </FormikContext.Provider>
  );
};
