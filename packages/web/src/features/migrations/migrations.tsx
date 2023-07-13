import React, { useState } from "react";
import { Tabs } from "@mui/material";
import Tab from "@mui/material/Tab";
import { MigrationsChooseAreas } from "./migrations-choose-areas";
import { MigrationsChooseTracks } from "./migrations-choose-tracks";
import { useMutation, useQuery } from "react-query";
const STEPS = [
  { label: "Index tracks", Component: MigrationsChooseTracks },
  { label: "Choose RF areas", Component: MigrationsChooseAreas },
];
export const MigrationsForm = () => {
  const [step, setStep] = useState(0);

  const { data: migrationSplitAreaState } = useQuery("migration-split-area");
  const isStepAvailable = (step: number) => {
    if (!step) {
      return true;
    } else {
      return migrationSplitAreaState;
    }
  };
  return (
    <>
      <Tabs
        variant={"scrollable"}
        scrollButtons={true}
        value={step}
        onChange={(e, newValue) => {
          isStepAvailable(newValue) && setStep(newValue);
        }}
      >
        {STEPS.map(({ label }) => (
          <Tab label={label} />
        ))}
      </Tabs>
      {STEPS.map(({ Component }, index) => (
        <div style={step !== index ? { display: "none" } : undefined}>
          <Component />
        </div>
      ))}
    </>
  );
};
