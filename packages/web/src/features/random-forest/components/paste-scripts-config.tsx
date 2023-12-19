import { FormikProps, useFormik } from "formik";
import { RandomForestInputConfig } from "../random-forest";
import { ScriptInputConfig } from "../data-extraction";
import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogProps, TextField } from "@mui/material";
import { FormikConfig } from "formik/dist/types";
import * as yup from "yup";
import { DefaultScriptParamsSchema, ScriptInputSchema } from "../data-schemas";
import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;

export const PasteScriptsConfigModal = ({
  onSubmit,
  ...props
}: Omit<DialogProps, "onSubmit"> & {
  onSubmit: FormikConfig<{ scripts: ScriptInputConfig[] }>["onSubmit"];
}) => {
  const form = useFormik<{ scripts: ScriptInputConfig[] }>({
    initialValues: { scripts: [] as ScriptInputConfig[] },
    onSubmit: onSubmit,
    validationSchema: yup.object({
      scripts: yup.array(ScriptInputSchema).required().min(1),
    }),
  });
  const [text, setText] = useState("");
  useEffect(() => {
    if (text) {
      try {
        form.setFieldValue("scripts", JSON.parse(text));
      } catch (e) {
        form.setFieldValue("scripts", undefined);
      }
    }
  }, [text]);
  useEffect(() => {
    return form.resetForm();
  }, []);
  return (
    <Dialog {...props}>
      <TextField
        error={!!form.errors.scripts}
        multiline={true}
        value={text}
        onChange={({ currentTarget: { value } }) => setText(value)}
      />
      <Button onClick={form.submitForm}>Save</Button>
    </Dialog>
  );
};
