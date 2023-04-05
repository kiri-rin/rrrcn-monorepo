import Drawer from "@mui/material/Drawer";
import { Offset } from "../../../App";
import { Button, Tab, Tabs } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
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
import { Formik, FormikProps } from "formik";
import { FullSchema, isPopulationUseRandomForest } from "./schemas";
import { useEffectNoOnMount } from "../../../utils/hooks";
import { PopulationForm, PopulationInputConfig } from "./population";

export type FormType = {
  data?: Partial<DataExtractionInput>;
  randomForest?: Partial<RandomForestInputConfig>;
  population?: Partial<PopulationInputConfig>;
  analysisIncluded: {
    data: boolean;
    randomForest: boolean;
    population: boolean;
  };
};

export const MainPageLeftPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const strings = useTranslations();

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

  const onSend = (data: FormType) => {
    const { analysisIncluded } = data;
    [
      analysisIncluded.data && {
        type: "data",
        config: mapScriptsConfigToRequest(data.data as DataExtractionInput),
      },
      analysisIncluded.randomForest &&
        !isPopulationUseRandomForest(data) && {
          type: "random-forest",
          config: mapRFConfigToRequest(
            data.randomForest as RandomForestInputConfig
          ),
        },
      analysisIncluded.population && isPopulationUseRandomForest(data)
        ? [
            {
              type: "random-forest",
              config: mapRFConfigToRequest(
                data.randomForest as RandomForestInputConfig
              ),
            },
            {
              type: "population",
              config: data.population,
            },
          ]
        : {
            type: "population",
            config: data.population,
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
    <Formik<FormType>
      validationSchema={FullSchema}
      initialValues={{
        data: {},
        randomForest: defaultRFConfig,
        population: {},
        analysisIncluded: {
          data: true,
          randomForest: false,
          population: false,
        },
      }}
      onSubmit={(data) => {
        onSend(data);
      }}
    >
      {({
        submitForm,
        errors,
        touched,
        submitCount,
        values,
        setFieldValue,
      }) => {
        return (
          <Drawer
            style={{ resize: "horizontal" }}
            variant="permanent"
            anchor="left"
          >
            <div className="data-extraction-left__container">
              <Offset />
              <Tabs
                variant={"scrollable"}
                scrollButtons={true}
                value={activeTab}
                onChange={(e, newValue) => {
                  setActiveTab(newValue);
                }}
              >
                <Tab
                  className={
                    (touched["data"] || submitCount) && errors.data
                      ? "common__card_error"
                      : ""
                  }
                  label={
                    <>
                      <Checkbox
                        checked={values.analysisIncluded.data}
                        onChange={({ target: { value } }) => {
                          setFieldValue(
                            "analysisIncluded.data",
                            !values.analysisIncluded.data
                          );
                        }}
                      />
                      <Typography>
                        {strings["data-extraction.title"]}
                      </Typography>
                    </>
                  }
                />
                <Tab
                  className={
                    (touched["randomForest"] || submitCount) &&
                    errors.randomForest
                      ? "common__card_error"
                      : ""
                  }
                  label={
                    <>
                      <Checkbox
                        checked={
                          isPopulationUseRandomForest(values) ||
                          values.analysisIncluded.randomForest
                        }
                        onChange={({ target: { value } }) => {
                          !isPopulationUseRandomForest(values) &&
                            setFieldValue(
                              "analysisIncluded.randomForest",
                              !values.analysisIncluded.randomForest
                            );
                        }}
                      />
                      <Typography>{strings["random-forest.title"]}</Typography>
                    </>
                  }
                />
                <Tab
                  className={
                    (touched["population"] || submitCount) && errors.population
                      ? "common__card_error"
                      : ""
                  }
                  label={
                    <>
                      <Checkbox
                        checked={values.analysisIncluded.population}
                        onChange={({ target: { value } }) => {
                          console.log(
                            "USE RF",
                            isPopulationUseRandomForest(values)
                          );
                          setFieldValue(
                            "analysisIncluded.population",
                            !values.analysisIncluded.population
                          );
                        }}
                      />
                      <Typography>{strings["population.title"]}</Typography>
                    </>
                  }
                />
              </Tabs>
              <Button
                onClick={() => {
                  submitForm();
                }}
              >
                {strings["data-extraction.get-result"]}
              </Button>
              <div style={activeTab !== 0 ? { display: "none" } : undefined}>
                <DataExtractionConfigForm name={"data"} />
              </div>
              <div style={activeTab !== 1 ? { display: "none" } : undefined}>
                <RandomForestConfigForm name={"randomForest"} />
              </div>
              <div style={activeTab !== 2 ? { display: "none" } : undefined}>
                <PopulationForm name={"population"} />
              </div>
            </div>
          </Drawer>
        );
      }}
    </Formik>
  );
};
