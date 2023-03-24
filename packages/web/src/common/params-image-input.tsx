import { RandomForestInputConfig } from "../features/main-page/left-panel/random-forest";
import { ScriptSelectInput } from "./script-input";
import { ScriptInputConfig } from "../features/main-page/left-panel/data-extraction";
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
import { FieldArray, useField } from "formik";
import { useQuery } from "react-query";
import { api } from "../api";
export const ParamsImageInput = ({ name }: { name: string }) => {
  const [{ value: config }, fieldMeta, { setValue: setConfig }] = useField<
    RandomForestInputConfig["params"] //@ts-ignore
  >(name);
  const errors = fieldMeta.error as any;
  const { data: scriptsList } = useQuery(
    "analysis-scripts",
    (opt) => api.analysis.getApiAnalysisScripts(),
    { enabled: false, refetchOnWindowFocus: false }
  );
  const strings = useTranslations();
  console.log({ config });

  switch (config?.type) {
    case "scripts":
      return (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{strings["data-extraction.choose-params"]}</Typography>
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
              <MenuItem onClick={(e) => e.stopPropagation()} value={"scripts"}>
                scripts
              </MenuItem>
            </Select>
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
          </AccordionDetails>
        </Accordion>
      );
    default:
      return <></>;
  }
};
