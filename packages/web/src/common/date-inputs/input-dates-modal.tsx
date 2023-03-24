import { Box, Button, Modal, TextField } from "@mui/material";
import { Offset } from "../../App";
import React, { useEffect, useState } from "react";
import {
  DateIntervalsInputConfig,
  DatesInputConfig,
  DatesIntervalsInput,
} from "./dates-input";
import { useEffectNoOnMount } from "../../utils/hooks";
import cloneDeep from "lodash/cloneDeep";
import { useTranslations } from "../../utils/translations";
import { useFormik } from "formik";
import {
  DateIntervalsSchema,
  DatesInputItemSchema,
  DatesInputSchema,
} from "../../features/main-page/left-panel/schemas";
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
    <Modal className={"common-modal dates-modal"} open={true}>
      <>
        <Offset />
        <Box
          className={"common-modal__body"}
          style={{ backgroundColor: "white" }}
        >
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
            <div key={_index} className={"dates-modal__dates-element"}>
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
            </div>
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
          <Button className={"common-modal__close"} onClick={() => onClose()}>
            {strings["common.close"]}
          </Button>
          <Button
            onClick={() => {
              submitForm();
            }}
          >
            {strings["common.save"]}
          </Button>
        </Box>
      </>
    </Modal>
  );
};
