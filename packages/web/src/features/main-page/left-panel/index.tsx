import Drawer from "@mui/material/Drawer";
import { Offset } from "../../../App";
import { Button, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import {
  DataExtractionConfigForm,
  DataExtractionInput,
} from "./data-extraction";
import {
  defaultRFConfig,
  mapRFConfigToRequest,
  RandomForestConfigForm,
  RandomForestInputConfig,
} from "./random-forest";
import { useTranslations } from "../../../utils/translations";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { useMutation, useQueryClient } from "react-query";
import { api } from "../../../api";
import { serializeRequestToForm } from "../../../utils/request";
import { mapScriptsConfigToRequest } from "./utils";

export const MainPageLeftPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const strings = useTranslations();
  const [analysisIncluded, setAnalysisIncluded] = useState({
    data: true,
    randomForest: false,
  });
  const [dataExtractionConfig, setDataExtractionConfig] = useState<
    Partial<DataExtractionInput>
  >({});
  const [randomForestConfig, setRandomForestConfig] =
    useState<Partial<RandomForestInputConfig>>(defaultRFConfig);
  const queryClient = useQueryClient();
  const { data: analysisState, mutateAsync: postAnalysis } = useMutation(
    "analysis-results",
    api.analysis.postApiAnalysisProcess,
    {
      onSuccess(data) {
        queryClient.setQueriesData("analysis-results", data);
      },
    }
  );

  const onSend = () => {
    const form = new FormData();
    const prepared = [
      analysisIncluded.data && {
        type: "data",
        config: mapScriptsConfigToRequest(
          dataExtractionConfig as DataExtractionInput
        ),
      },
      analysisIncluded.randomForest && {
        type: "random-forest",
        config: mapRFConfigToRequest(
          randomForestConfig as RandomForestInputConfig
        ),
      },
    ].filter((it) => it);
    serializeRequestToForm({ configs: prepared }, form);
    postAnalysis(form);
  };
  return (
    <Drawer style={{ resize: "horizontal" }} variant="permanent" anchor="left">
      <div className="data-extraction-left__container">
        <Offset />
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => {
            setActiveTab(newValue);
          }}
        >
          <Tab
            label={
              <>
                <Checkbox
                  checked={analysisIncluded.data}
                  onChange={({ target: { value } }) => {
                    setAnalysisIncluded((prev) => ({
                      ...prev,
                      data: !prev.data,
                    }));
                  }}
                />
                <Typography>{strings["data-extraction.title"]}</Typography>
              </>
            }
          />
          <Tab
            label={
              <>
                <Checkbox
                  checked={analysisIncluded.randomForest}
                  onChange={({ target: { value } }) => {
                    setAnalysisIncluded((prev) => ({
                      ...prev,
                      randomForest: !prev.randomForest,
                    }));
                  }}
                />
                <Typography>{strings["random-forest.title"]}</Typography>
              </>
            }
          />
          {/*<Tab label="Item Three" />*/}
        </Tabs>
        <div style={activeTab !== 0 ? { display: "none" } : undefined}>
          <DataExtractionConfigForm
            value={dataExtractionConfig}
            onChange={(part) => {
              setDataExtractionConfig((prev) => ({ ...prev, ...part }));
            }}
          />
        </div>
        <div style={activeTab !== 1 ? { display: "none" } : undefined}>
          <RandomForestConfigForm
            value={randomForestConfig}
            onChange={(part) => {
              setRandomForestConfig((prev) => ({ ...prev, ...part }));
            }}
          />
        </div>
      </div>
      <Button
        onClick={() => {
          onSend();
        }}
      >
        {strings["data-extraction.get-result"]}
      </Button>
    </Drawer>
  );
};
