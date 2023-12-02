import { RandomForestInputConfig } from "../features/random-forest/random-forest";
import { ScriptSelectInput } from "./script-input";
import { ScriptInputConfig } from "../features/random-forest/data-extraction";
import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary/AccordionSummary";
import {
  AccordionDetails,
  Button,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useTranslations } from "../utils/translations";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FieldArray, useField, useFormikContext } from "formik";
import { useQuery } from "react-query";
import { api } from "../api";
import { PasteScriptsConfigModal } from "../features/random-forest/components/paste-scripts-config";
export const ParamsImageInput = ({ name }: { name: string }) => {
  const { submitCount } = useFormikContext();
  const [{ value: config }, fieldMeta, { setValue: setConfig }] = useField<
    RandomForestInputConfig["params"] //@ts-ignore
  >(name);
  const errors = fieldMeta.error as any;
  const touched = fieldMeta.touched;
  const { data: scriptsList } = useQuery(
    "analysis-scripts",
    (opt) => api.analysis.getApiAnalysisScripts(),
    { enabled: false, refetchOnWindowFocus: false }
  );
  const [openImportConfig, setOpenImport] = useState(false);
  const strings = useTranslations();

  switch (config?.type) {
    case "scripts":
      return (
        <Accordion
          className={`common__card_${
            (touched || submitCount) && errors ? "error" : "blue"
          }`}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className={"common__row"}>
              <Typography>
                {strings["data-extraction.choose-params"]}
              </Typography>
              <Select
                error={errors?.type}
                size={"small"}
                value={config?.type || "scripts"}
                onChange={({ target: { value } }) => {
                  setConfig({
                    type: value as RandomForestInputConfig["params"]["type"],
                    ...(value === "scripts" && {
                      scripts: [],
                    }),
                    ...(value === "asset" && { path: "" }),
                  } as RandomForestInputConfig["params"]);
                }}
              >
                {/*<MenuItem onClick={(e) => e.stopPropagation()} value={"asset"}>*/}
                {/*  asset*/}
                {/*</MenuItem>*/}
                <MenuItem
                  onClick={(e) => e.stopPropagation()}
                  value={"scripts"}
                >
                  scripts
                </MenuItem>
              </Select>
            </div>
          </AccordionSummary>

          <AccordionDetails>
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
            <Button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(config.scripts));
              }}
            >
              Copy scripts config
            </Button>
            <Button
              onClick={() => {
                setOpenImport(true);
              }}
            >
              Import config
            </Button>
            {openImportConfig && (
              <PasteScriptsConfigModal
                onClose={() => setOpenImport(false)}
                open={openImportConfig}
                onSubmit={(data) => {
                  console.log(data);
                  setConfig({
                    type: "scripts",
                    ...data,
                  } as RandomForestInputConfig["params"]);
                  setOpenImport(false);
                }}
              />
            )}
          </AccordionDetails>
        </Accordion>
      );
    default:
      return <></>;
  }
};
