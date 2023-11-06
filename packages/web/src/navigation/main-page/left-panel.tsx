import Drawer from "@mui/material/Drawer";
import { Offset } from "../../App";
import { Button, Tab, TabProps, Tabs } from "@mui/material";
import React, { ComponentType, useEffect, useRef, useState } from "react";
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
import { Strings, useTranslations } from "../../utils/translations";
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
import { SurvivalForm } from "../../features/survival/survival";
import { MaxentConfigForm } from "../../features/maxent/maxent";

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
const TABS: { label: keyof Strings; Component: ComponentType }[] = [
  {
    label: "data-extraction.title",
    Component: DataExtractionConfigForm,
  },
  {
    label: "random-forest.title",
    Component: RandomForestConfigForm,
  },

  {
    label: "maxent.title",
    Component: MaxentConfigForm,
  },
  {
    label: "population.title",
    Component: PopulationForm,
  },
  {
    label: "survival.title",
    Component: SurvivalForm,
  },
  {
    label: "migrations.title",
    Component: MigrationsForm,
  },
];
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
          {TABS.map(({ label }, index) => (
            <Tab key={index} label={strings[label] as string} />
          ))}
        </Tabs>
        {TABS.map(({ Component }, index) => (
          <div
            key={index}
            style={activeTab !== index ? { display: "none" } : undefined}
          >
            <Component />
          </div>
        ))}
      </div>
    </Drawer>
  );
};
