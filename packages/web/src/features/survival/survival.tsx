import { useTranslations } from "../../utils/translations";
import { useSendAnalysis } from "../common/utils";
import { FormikContext, useFormik } from "formik";
import { CommonPaper } from "../../components/common/common";
import Typography from "@mui/material/Typography";
import { Button, Input, TextField } from "@mui/material";
import React from "react";
import { SurvivalValidationSchema } from "./schema";
import type { SurvivalNestConfig } from "@rrrcn/services/src/analytics_config_types";

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

  return (
    <FormikContext.Provider value={formik}>
      <CommonPaper $error={false}>
        <Typography sx={{ marginY: "10px" }}>
          {strings["survival.file"]}
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
          {strings["survival.nocc"]}
        </Typography>
        <TextField
          size={"small"}
          type={"number"}
          onChange={({ target: { value } }) => setFieldValue("nocc", value)}
          value={config.nocc}
        />
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
