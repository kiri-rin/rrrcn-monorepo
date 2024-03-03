import { Box, Button, Modal, TextField } from "@mui/material";
import { Offset } from "../../../App";
import React, { useEffect, useState } from "react";
import { DatesInputConfig } from "../script-dates";
import cloneDeep from "lodash/cloneDeep";
import { useTranslations } from "@/utils/translations";
import { useFormik } from "formik";
import { DatesInputItemSchema } from "@/components/date-inputs/dates-schemas";
import { DatesIntervalsInput } from "../dates-interval";
import {
  DatesModal,
  DatesModalBody,
  DatesModalElement,
} from "@/components/date-inputs/modal/style";
export const InputDatesModal = ({
  onSave,
  value,
  onClose,
}: {
  onSave: (value: DatesInputConfig[0]) => any;
  value: DatesInputConfig[0];
  onClose: () => any;
}) => {
  const strings = useTranslations();
  const {
    values: dateConfig,
    setValues: setDateConfig,
    submitForm,
    errors,
  } = useFormik({
    initialValues: cloneDeep(value),
    onSubmit: (data) => {
      onSave(data);
    },
    validationSchema: DatesInputItemSchema,
  });
  console.log({ dateErrors: errors });

  return (
    <DatesModal open={true}>
      <>
        <Offset />
        <DatesModalBody>
          <TextField
            label={"key"}
            value={dateConfig.key}
            onChange={({ target: { value } }) =>
              setDateConfig((prev) => {
                const newState = { ...prev };
                newState.key = value;
                return newState;
              })
            }
          />
          {dateConfig.dateIntervals.map((it, _index) => (
            <DatesModalElement key={_index}>
              <DatesIntervalsInput
                error={errors?.dateIntervals?.[_index]}
                value={it}
                onChange={(changed) =>
                  setDateConfig((prev) => {
                    const newConfig = { ...prev };
                    newConfig.dateIntervals[_index] = changed;
                    return newConfig;
                  })
                }
              />
              <div>
                <Button
                  onClick={() => {
                    setDateConfig((prev) => {
                      const newConfig = { ...prev };
                      newConfig.dateIntervals = [
                        ...newConfig.dateIntervals.slice(0, _index),
                        ...newConfig.dateIntervals.slice(_index + 1),
                      ];
                      return newConfig;
                    });
                  }}
                >
                  {strings["common.delete"]}
                </Button>
              </div>
            </DatesModalElement>
          ))}
          <Button
            size={"small"}
            onClick={() =>
              setDateConfig((prev) => {
                const newState = { ...prev };
                newState.dateIntervals = [
                  ...newState.dateIntervals,
                  { type: "date" },
                ];
                return newState;
              })
            }
          >
            {strings["data-extraction.add-dates-to-result"]}
          </Button>
          <Button onClick={() => onClose()}>{strings["common.close"]}</Button>
          <Button
            onClick={() => {
              submitForm();
            }}
          >
            {strings["common.save"]}
          </Button>
        </DatesModalBody>
      </>
    </DatesModal>
  );
};
