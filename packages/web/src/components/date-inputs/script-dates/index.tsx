import React, { useState } from "react";
import { useTranslations } from "@/utils/translations";
import { InputDatesModal } from "../modal";
import { FormikErrors, useField, useFormikContext } from "formik";
import {
  ScriptDateInputAddButton,
  ScriptDateInputContainer,
  ScriptDateInputDeleteButton,
  ScriptDateInputEditButton,
  ScriptDateInputKeyInput,
  ScriptDateInputKeyInputContainer,
} from "./style";
import { DateIntervalsInputConfig } from "../dates-interval";

export type DatesInputConfig = {
  key: string;
  dateIntervals: DateIntervalsInputConfig[];
}[];
export const ScriptDatesInput = ({ name }: { name: string }) => {
  const [openModal, setOpenModal] = useState<number | undefined>();
  const [{ value: dateConfig = [] }, fieldMeta, { setValue: setDateConfig }] =
    useField<DatesInputConfig>(name);
  const errors = fieldMeta.error as unknown as FormikErrors<DatesInputConfig>;
  const { setFieldValue } = useFormikContext();
  const strings = useTranslations();

  return (
    <ScriptDateInputContainer>
      {strings["common.dates"]}:
      {dateConfig.map((conf, index) => {
        return (
          <ScriptDateInputKeyInputContainer key={index}>
            <ScriptDateInputKeyInput
              error={!!errors?.[index]?.key}
              value={conf.key}
              onChange={({ target: { value } }) => {
                setFieldValue(`${name}.${index}`, {
                  ...dateConfig[index],
                  key: value,
                });
              }}
            />
            :
            {conf.dateIntervals
              .map((it) => {
                switch (it.type) {
                  case "date":
                    return it.date;
                  case "range":
                    return it.dates?.join("-");
                  case "repeated":
                    return "Месяцы...";
                }
              })
              .join(", ")}
            <ScriptDateInputEditButton
              size={"small"}
              onClick={() => setOpenModal(index)}
            >
              {strings["common.edit"]}
            </ScriptDateInputEditButton>
            <ScriptDateInputDeleteButton
              size={"small"}
              onClick={() =>
                setDateConfig([
                  ...dateConfig.slice(0, index),
                  ...dateConfig.slice(index + 1),
                ])
              }
            >
              {strings["common.delete"]}
            </ScriptDateInputDeleteButton>
          </ScriptDateInputKeyInputContainer>
        );
      })}
      <ScriptDateInputAddButton
        size={"small"}
        onClick={() => {
          setDateConfig([
            ...dateConfig,
            { key: "date" + (dateConfig.length + 1), dateIntervals: [] },
          ]);
        }}
      >
        {strings["data-extraction.add-dates-to-result"]}
      </ScriptDateInputAddButton>
      {openModal !== undefined && (
        <InputDatesModal
          onSave={(data) => {
            setFieldValue(`${name}.${openModal}`, data);
          }}
          value={dateConfig[openModal]}
          onClose={() => {
            setOpenModal(undefined);
          }}
        />
      )}
    </ScriptDateInputContainer>
  );
};
