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

  return (
    <Drawer style={{ resize: "horizontal" }} variant="permanent" anchor="left">
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
          <Tab label={strings["data-extraction.title"]} />
          <Tab label={strings["random-forest.title"]} />
          <Tab label={strings["population.title"]} />
          <Tab label={strings["population.title"]} />
        </Tabs>
        <div style={activeTab !== 0 ? { display: "none" } : undefined}>
          <DataExtractionConfigForm />
        </div>
        <div style={activeTab !== 1 ? { display: "none" } : undefined}>
          <RandomForestConfigForm />
        </div>
        <div style={activeTab !== 2 ? { display: "none" } : undefined}>
          <PopulationForm />
        </div>
        <div style={activeTab !== 3 ? { display: "none" } : undefined}>
          <MigrationsForm />
        </div>
      </div>
    </Drawer>
  );
};
