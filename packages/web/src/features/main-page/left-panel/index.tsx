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
import { Formik } from "formik";
import { getFormSchema } from "./schemas";

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

  const onSend = (data: {
    data?: Partial<DataExtractionInput>;
    randomForest?: Partial<RandomForestInputConfig>;
  }) => {
    [
      analysisIncluded.data && {
        type: "data",
        config: mapScriptsConfigToRequest(data.data as DataExtractionInput),
      },
      analysisIncluded.randomForest && {
        type: "random-forest",
        config: mapRFConfigToRequest(
          data.randomForest as RandomForestInputConfig
        ),
      },
    ].forEach((analysisConfig) => {
      if (analysisConfig) {
        const form = new FormData();
        serializeRequestToForm(analysisConfig, form);
        postAnalysis(form);
      }
    });
  };
  return (
    <Formik<{
      data?: Partial<DataExtractionInput>;
      randomForest?: Partial<RandomForestInputConfig>;
    }>
      validationSchema={getFormSchema(analysisIncluded)}
      initialValues={{ data: {}, randomForest: defaultRFConfig }}
      onSubmit={(data) => {
        onSend(data);
      }}
    >
      {({ submitForm, errors }) => {
        return (
          <Drawer
            style={{ resize: "horizontal" }}
            variant="permanent"
            anchor="left"
          >
            <div className="data-extraction-left__container">
              <Offset />
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => {
                  setActiveTab(newValue);
                }}
              >
                <Tab
                  style={
                    errors.data
                      ? {
                          backgroundColor: "rgba(255,0,0,0.2)",
                        }
                      : undefined
                  }
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
                      <Typography>
                        {strings["data-extraction.title"]}
                      </Typography>
                    </>
                  }
                />
                <Tab
                  style={
                    errors.randomForest
                      ? {
                          backgroundColor: "rgba(255,0,0,0.2)",
                        }
                      : undefined
                  }
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
                <DataExtractionConfigForm name={"data"} />
              </div>
              <div style={activeTab !== 1 ? { display: "none" } : undefined}>
                <RandomForestConfigForm
                  name={"randomForest"}
                  value={randomForestConfig}
                  onChange={(part) => {
                    setRandomForestConfig((prev) => ({ ...prev, ...part }));
                  }}
                />
              </div>
            </div>
            <Button
              onClick={() => {
                submitForm();
              }}
            >
              {strings["data-extraction.get-result"]}
            </Button>
          </Drawer>
        );
      }}
    </Formik>
  );
};
