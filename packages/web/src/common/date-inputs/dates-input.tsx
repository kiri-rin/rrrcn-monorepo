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

const currentYear = new Date().getFullYear();
const yearsArray = new Array(currentYear - 2000)
  .fill(0)
  .map((it, index) => index + 2000);
type DateIntervalsInputConfig =
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
export const ScriptDatesInput = ({
  value,
  onChange,
}: {
  value: DatesInputConfig;
  onChange: (val: DatesInputConfig) => any;
}) => {
  const [dateConfig, setDateConfig] = useState<DatesInputConfig>([]);
  const [openModal, setOpenModal] = useState<number | undefined>();
  useEffectNoOnMount(() => {
    //TODO remove inner states
    dateConfig !== value && onChange(dateConfig);
  }, [dateConfig]);
  useEffectNoOnMount(() => {
    value !== dateConfig && setDateConfig(value);
  }, [value]);
  const strings = useTranslations();

  return (
    <div className={""}>
      {strings["common.dates"]}:
      {dateConfig.map((conf, index) => {
        return (
          <div className={"data-dates-input__container"}>
            <Input
              className={"data-dates-input__container__key-input"}
              value={conf.key}
              onChange={({ target: { value } }) =>
                setDateConfig((prev) => {
                  const newState = [...prev];
                  newState[index] = { ...newState[index], key: value };
                  return newState;
                })
              }
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
            <Button onClick={() => setOpenModal(index)}>
              {strings["common.edit"]}
            </Button>
          </div>
        );
      })}
      <Button
        size={"small"}
        onClick={() => {
          setDateConfig((prev) => {
            const newState = [...prev, { key: "", dateIntervals: [] }];
            return newState;
          });
        }}
      >
        {strings["data-extraction.add-dates-to-result"]}
      </Button>
      <Modal
        className={"common-modal dates-modal"}
        open={openModal !== undefined}
      >
        <>
          <Offset />
          {openModal !== undefined ? (
            <Box
              className={"common-modal__body"}
              style={{ backgroundColor: "white" }}
            >
              <Button
                className={"common-modal__close"}
                onClick={() => setOpenModal(undefined)}
              >
                Закрыть
              </Button>
              <TextField
                label={"key"}
                value={dateConfig[openModal as number].key}
                onChange={({ target: { value } }) =>
                  setDateConfig((prev) => {
                    const newState = [...prev];
                    newState[openModal].key = value;
                    return newState;
                  })
                }
              />
              {dateConfig[openModal as number].dateIntervals.map(
                (it, _index) => (
                  <div key={_index} className={"dates-modal__dates-element"}>
                    <DatesIntervalsInput
                      value={it}
                      onChange={(changed) =>
                        setDateConfig((prev) => {
                          const newConfig = [...prev];
                          const opened = newConfig[openModal as number];
                          opened.dateIntervals[_index] = changed;
                          return newConfig;
                        })
                      }
                    />
                    <div>
                      <Button
                        onClick={() => {
                          setDateConfig((prev) => {
                            const newConfig = [...prev];
                            const opened = newConfig[openModal as number];
                            opened.dateIntervals = [
                              ...opened.dateIntervals.slice(0, _index),
                              ...opened.dateIntervals.slice(_index + 1),
                            ];
                            return newConfig;
                          });
                        }}
                      >
                        {strings["common.delete"]}
                      </Button>
                    </div>
                  </div>
                )
              )}
              <Button
                size={"small"}
                onClick={() =>
                  setDateConfig((prev) => {
                    const newState = [...prev];
                    newState[openModal].dateIntervals = [
                      ...newState[openModal].dateIntervals,
                      { type: "date" },
                    ];
                    return newState;
                  })
                }
              >
                Добавить даты в результат
              </Button>
            </Box>
          ) : (
            <></>
          )}
        </>
      </Modal>
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
