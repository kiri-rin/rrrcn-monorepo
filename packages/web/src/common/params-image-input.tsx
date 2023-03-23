import { RandomForestInputConfig } from "../features/main-page/left-panel/random-forest";
import { ScriptSelectInput } from "./script-input";
import { ScriptInputConfig } from "../features/main-page/left-panel/data-extraction";
import React, { useState } from "react";
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
export const ParamsImageInput = ({
  value: config,
  onChange: setConfig = () => {},
}: {
  value?: RandomForestInputConfig["params"];
  onChange?: (val: RandomForestInputConfig["params"]) => any;
}) => {
  const strings = useTranslations();

  switch (config?.type) {
    case "scripts":
      return (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{strings["data-extraction.choose-params"]}</Typography>
            <Select
              size={"small"}
              value={config?.type}
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
              <MenuItem onClick={(e) => e.stopPropagation()} value={"asset"}>
                asset
              </MenuItem>
              <MenuItem onClick={(e) => e.stopPropagation()} value={"scripts"}>
                scripts
              </MenuItem>
            </Select>
          </AccordionSummary>

          <AccordionDetails>
            {/*{config.scripts?.map((it, index) => (*/}
            {/*  <ScriptSelectInput*/}
            {/*    onDelete={() => {*/}
            {/*      const newConfig = { ...config };*/}
            {/*      newConfig.scripts = [*/}
            {/*        ...(newConfig.scripts?.slice(0, index) || []),*/}
            {/*        ...(newConfig.scripts?.slice(index + 1) || []),*/}
            {/*      ] as ScriptInputConfig[];*/}
            {/*      setConfig(newConfig);*/}
            {/*    }}*/}
            {/*    key={index}*/}
            {/*    onChange={(scriptConfig) => {*/}
            {/*      const prev = { ...config };*/}
            {/*      if (!prev.scripts) {*/}
            {/*        setConfig({*/}
            {/*          ...prev,*/}
            {/*          scripts: [scriptConfig as ScriptInputConfig],*/}
            {/*        });*/}
            {/*      }*/}
            {/*      prev.scripts[index] = {*/}
            {/*        ...prev.scripts[index],*/}
            {/*        ...scriptConfig,*/}
            {/*      } as ScriptInputConfig;*/}
            {/*      setConfig({ ...prev, scripts: [...prev.scripts] });*/}
            {/*    }}*/}
            {/*    value={it}*/}
            {/*  />*/}
            {/*))}*/}
            <Button
              onClick={() => {
                const prev = { ...config };
                setConfig({
                  ...prev,
                  scripts: [...(prev.scripts || []), { key: "elevation" }],
                });
              }}
            >
              {strings["data-extraction.add-data"]}
            </Button>
          </AccordionDetails>
        </Accordion>
      );
    default:
      return <></>;
  }
};
