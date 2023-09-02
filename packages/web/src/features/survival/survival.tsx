import { useTranslations } from "../../utils/translations";
import { useSendAnalysis } from "../common/utils";
import { FieldArray, FormikContext, useFormik } from "formik";
import { useQuery } from "react-query";
import { api } from "../../api";
import { CommonPaper } from "../../components/common";
import Typography from "@mui/material/Typography";
import { Button, Input, MenuItem, Select } from "@mui/material";
import React from "react";
import { SurvivalValidationSchema } from "./schema";
import { SurvivalNestConfig } from "@rrrcn/services/dist/src/analytics_config_types";

export const SurvivalForm = () => {
  const strings = useTranslations();
  const { onSend } = useSendAnalysis("survival");
  const formik = useFormik<Partial<SurvivalNestConfig<File>>>({
    initialValues: {},
    validationSchema: SurvivalValidationSchema,
    onSubmit: (data) => {
      onSend(data);
    },
  });
  const {
    submitCount,
    touched,
    values: config,
    errors,
    submitForm,
    setValues: setConfig,
    setFieldValue,
  } = formik;
  const { data: scriptsList } = useQuery(
    "analysis-scripts",
    (opt) => api.analysis.getApiAnalysisScripts(),
    { enabled: false, refetchOnWindowFocus: false }
  );
  return (
    <FormikContext.Provider value={formik}>
      <CommonPaper error={false}>
        <Typography sx={{ marginY: "10px" }}>
          {strings["population.distance-file"]}
        </Typography>
        <Input
          error={
            !!((touched[`survivalFile`] || submitCount) && errors?.survivalFile)
          }
          size={"small"}
          type={"file"}
          inputProps={{ accept: "text/csv" }}
          onChange={({
            target: { files, form },
          }: React.ChangeEvent<HTMLInputElement>) => {
            files?.[0] && setFieldValue(`survivalFile`, files[0]);
          }}
        />

        <Typography sx={{ marginY: "10px" }}>
          {strings["population.distance-function"]}
        </Typography>
      </CommonPaper>
      <Button
        onClick={() => {
          submitForm();
        }}
      >
        {strings["data-extraction.get-result"]}
      </Button>
    </FormikContext.Provider>
  );
};
