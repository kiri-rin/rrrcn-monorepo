import Drawer from "@mui/material/Drawer";
import { Offset } from "../../App";
import { Button, Tab, TabProps, Tabs } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  DataExtractionConfigForm,
  DataExtractionInput,
} from "../../features/random-forest/data-extraction";
import {
  defaultRFConfig,
  mapRFConfigToRequest,
  RandomForestConfigForm,
  RandomForestInputConfig,
} from "../../features/random-forest/random-forest";
import { useTranslations } from "../../utils/translations";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "../../api";
import { serializeRequestToForm } from "../../utils/request";
import { mapScriptsConfigToRequest } from "../../features/random-forest/utils";
import { Formik, FormikProps } from "formik";
import {
  defaultPopulationConfig,
  PopulationForm,
  PopulationInputConfig,
} from "../../features/population/population";
import {
  FullSchema,
  isPopulationUseRandomForest,
} from "../../features/validations/main-schemas";
import { MigrationsForm } from "../../features/migrations/migrations";

export type FormType = {
  data?: Partial<DataExtractionInput>;
  randomForest?: Partial<RandomForestInputConfig>;
  population?: Partial<PopulationInputConfig>;
  migrations: any;
  analysisIncluded: {
    data: boolean;
    randomForest: boolean;
    population: boolean;
    migrations: any;
  };
};

export const MainPageLeftPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const strings = useTranslations();
  const { data: scriptsList } = useQuery(
    "analysis-scripts",
    (opt) => api.analysis.getApiAnalysisScripts(),
    { refetchOnWindowFocus: false }
  );
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
    console.log(analysisIncluded);
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
      analysisIncluded.population &&
        (isPopulationUseRandomForest(data)
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
            }),
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
        population: defaultPopulationConfig,
        analysisIncluded: {
          data: true,
          randomForest: false,
          population: false,
          migrations: false,
        },
        migrations: {},
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
                  console.log({ newValue });
                  setActiveTab(newValue);
                }}
              >
                <TabWithCheckbox
                  error={(touched["data"] || submitCount) && errors.data}
                  checked={values.analysisIncluded.data}
                  onChangeCheckbox={() => {
                    setFieldValue(
                      "analysisIncluded.data",
                      !values.analysisIncluded.data
                    );
                  }}
                  label={strings["data-extraction.title"]}
                />
                <TabWithCheckbox
                  error={
                    (touched["randomForest"] || submitCount) &&
                    errors.randomForest
                  }
                  checked={
                    isPopulationUseRandomForest(values) ||
                    values.analysisIncluded.randomForest
                  }
                  onChangeCheckbox={() => {
                    !isPopulationUseRandomForest(values) &&
                      setFieldValue(
                        "analysisIncluded.randomForest",
                        !values.analysisIncluded.randomForest
                      );
                  }}
                  label={strings["random-forest.title"]}
                />
                <TabWithCheckbox
                  error={
                    (touched["population"] || submitCount) && errors.population
                  }
                  checked={values.analysisIncluded.population}
                  onChangeCheckbox={() => {
                    setFieldValue(
                      "analysisIncluded.population",
                      !values.analysisIncluded.population
                    );
                  }}
                  label={strings["population.title"]}
                />
                <TabWithCheckbox
                  error={
                    (touched["migrations"] || submitCount) &&
                    (errors.migrations as string)
                  }
                  checked={values.analysisIncluded.migrations}
                  onChangeCheckbox={() => {
                    setFieldValue(
                      "analysisIncluded.migrations",
                      !values.analysisIncluded.migrations
                    );
                  }}
                  label={strings["population.title"]}
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
              <div style={activeTab !== 3 ? { display: "none" } : undefined}>
                <MigrationsForm />
              </div>
            </div>
          </Drawer>
        );
      }}
    </Formik>
  );
};
const TabWithCheckbox = ({
  checked,
  onChangeCheckbox,
  label,
  error,
  ...props
}: TabProps & {
  checked?: boolean;
  error?: boolean | string | number;
  onChangeCheckbox?: (e: React.ChangeEvent<HTMLInputElement>) => any;
}) => (
  <Tab
    className={error ? "common__card_error" : ""}
    {...props}
    label={
      <>
        <Checkbox checked={checked} onChange={onChangeCheckbox} />
        <Typography>{label}</Typography>
      </>
    }
  />
);
