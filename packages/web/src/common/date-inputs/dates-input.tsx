import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { useEffectNoOnMount } from "../../utils/hooks";
import moment from "moment";
import { useTranslations } from "../../utils/translations";
import { Offset } from "../../App";
import "./dates-input.scss";
import "../modal.scss";
import { DatesRepeatedInput } from "./repeated-dates";
import { InputDatesModal } from "./input-dates-modal";
import { useField, useFormikContext } from "formik";
import { ScriptInputConfig } from "../../features/main-page/left-panel/data-extraction";

const currentYear = new Date().getFullYear();
const yearsArray = new Array(currentYear - 2000)
  .fill(0)
  .map((it, index) => index + 2000);

export type DateIntervalsInputConfig =
  | { type: "date"; date?: string }
  | { type: "range"; dates?: [string | undefined, string | undefined] }
  | {
      type: "repeated";
      dates?: {
        years?: [number, number][];
        months?: number[];
        days?: [number, number | string][];
      };
    };
export type DatesInputConfig = {
  key: string;
  dateIntervals: DateIntervalsInputConfig[];
}[];
export const ScriptDatesInput = ({ name }: { name: string }) => {
  const [openModal, setOpenModal] = useState<number | undefined>();
  const [{ value: dateConfig = [] }, { error }, { setValue: setDateConfig }] =
    useField<DatesInputConfig>(name);
  const { setFieldValue } = useFormikContext();
  const strings = useTranslations();

  return (
    <div className={""}>
      {strings["common.dates"]}:
      {dateConfig.map((conf, index) => {
        return (
          <div key={index} className={"data-dates-input__container"}>
            <Input
              error={!!error}
              className={"data-dates-input__container__key-input"}
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
            <Button size={"small"} onClick={() => setOpenModal(index)}>
              {strings["common.edit"]}
            </Button>
            <Button
              size={"small"}
              onClick={() =>
                setDateConfig([
                  ...dateConfig.slice(0, index),
                  ...dateConfig.slice(index + 1),
                ])
              }
            >
              {strings["common.delete"]}
            </Button>
          </div>
        );
      })}
      <Button
        size={"small"}
        onClick={() => {
          setDateConfig([
            ...dateConfig,
            { key: "date" + (dateConfig.length + 1), dateIntervals: [] },
          ]);
        }}
      >
        {strings["data-extraction.add-dates-to-result"]}
      </Button>
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
    </div>
  );
};
export const DatesIntervalsInput = ({
  value: dateConfig,
  onChange: setDateConfig,
}: {
  value: DateIntervalsInputConfig;
  onChange: (val: DateIntervalsInputConfig) => any;
}) => {
  return (
    <div className={"date-intervals-input"}>
      <Select
        size={"small"}
        value={dateConfig?.type}
        onChange={({ target: { value: type } }) =>
          setDateConfig?.({ type: type as DateIntervalsInputConfig["type"] })
        }
      >
        <MenuItem value={"date"}>date</MenuItem>
        <MenuItem value={"range"}>range</MenuItem>
        <MenuItem value={"repeated"}>repeated</MenuItem>
      </Select>
      {(function () {
        switch (dateConfig?.type) {
          case "date":
            return (
              <div>
                <Input
                  type={"date"}
                  value={dateConfig?.date}
                  onChange={({ target: { value } }) =>
                    setDateConfig?.({
                      ...dateConfig,
                      date: moment(new Date(value)).format("YYYY-MM-DD"),
                    })
                  }
                />
              </div>
            );
          case "range":
            return (
              <div>
                <Input
                  type={"date"}
                  value={dateConfig.dates?.[0]}
                  onChange={({ target: { value } }) =>
                    setDateConfig(
                      dateConfig.type === "range"
                        ? {
                            ...dateConfig,
                            dates: [
                              moment(new Date(value)).format("YYYY-MM-DD"),
                              dateConfig.dates?.[1],
                            ],
                          }
                        : dateConfig
                    )
                  }
                />
                <Input
                  type={"date"}
                  value={dateConfig.dates?.[1]}
                  onChange={({ target: { value } }) =>
                    setDateConfig?.(
                      dateConfig.type === "range"
                        ? {
                            ...dateConfig,
                            dates: [
                              dateConfig.dates?.[0],
                              moment(new Date(value)).format("YYYY-MM-DD"),
                            ],
                          }
                        : dateConfig
                    )
                  }
                />
              </div>
            );
          case "repeated":
            return (
              <DatesRepeatedInput
                value={dateConfig.dates || {}}
                onChange={(changed) => {
                  setDateConfig({ ...dateConfig, dates: changed });
                }}
              />
            );
        }
      })()}
    </div>
  );
};
