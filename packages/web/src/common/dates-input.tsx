import React, { useState } from "react";
import { Box, Button, Input, MenuItem, Modal, Select } from "@mui/material";
import { DatesConfig } from "@rrrcn/services/dist/src/services/utils/dates";
import { useEffectNoOnMount } from "../utils/hooks";
import moment from "moment";
const currentYear = new Date().getFullYear();
const yearsArray = new Array(currentYear - 2000)
  .fill(0)
  .map((it, index) => index + 2000);
type DateIntervalsInputConfig =
  | { type: "date"; date?: string }
  | { type: "range"; dates?: [string | undefined, string | undefined] }
  | {
      type: "repeated";
      years?: [number, number][];
      months?: [number, number][];
      days?: [number, number | string][];
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
  useEffectNoOnMount(() => {//TODO remove inner states
    dateConfig !== value && onChange(dateConfig);
  }, [dateConfig]);
  useEffectNoOnMount(() => {
    value !== dateConfig && setDateConfig(value);
  }, [value]);
  return (
    <div>
      Даты:
      {dateConfig.map((conf, index) => {
        return (
          <div>
            <Input
              value={conf.key}
              onChange={({ target: { value } }) =>
                setDateConfig((prev) => {
                  const newState = [...prev];
                  newState[index] = { ...newState[index], key: value };
                  return newState;
                })
              }
            />
            :{" "}
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
            <Button onClick={() => setOpenModal(index)}>Редактировать</Button>
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
        Добавить даты в результат
      </Button>
      <Modal open={openModal !== undefined}>
        {openModal !== undefined ? (
          <Box style={{ backgroundColor: "white" }}>
            <Button onClick={() => setOpenModal(undefined)}>Закрыть</Button>
            key:
            <Input
              value={dateConfig[openModal as number].key}
              onChange={({ target: { value } }) =>
                setDateConfig((prev) => {
                  const newState = [...prev];
                  newState[openModal].key = value;
                  return newState;
                })
              }
            />
            {dateConfig[openModal as number].dateIntervals.map((it, _index) => (
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
            ))}
            <Button
              size={"small"}
              onClick={() =>
                setDateConfig((prev) => {
                  const newState = [...prev];
                  newState[openModal].dateIntervals.push({ type: "date" });
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
      </Modal>
    </div>
  );
};
export const DatesIntervalsInput = ({
  value,
  onChange,
}: {
  value?: DateIntervalsInputConfig;
  onChange?: (val: DateIntervalsInputConfig) => any;
}) => {
  const [dateConfig, setDateConfig] = useState<DateIntervalsInputConfig>({
    type: "date",
  });
  useEffectNoOnMount(() => {
    dateConfig !== value && onChange?.(dateConfig);
  }, [dateConfig]);
  useEffectNoOnMount(() => {
    value !== dateConfig && value && setDateConfig(value);
  }, [value]);
  return (
    <div>
      <Select
        value={dateConfig.type}
        onChange={({ target: { value: type } }) =>
          setDateConfig({ type: type as DateIntervalsInputConfig["type"] })
        }
      >
        <MenuItem value={"date"}>date</MenuItem>
        <MenuItem value={"range"}>range</MenuItem>
        <MenuItem value={"repeated"}>repeated</MenuItem>
      </Select>
      {(function () {
        switch (dateConfig.type) {
          case "date":
            return (
              <div>
                <Input
                  type={"date"}
                  value={dateConfig.date}
                  onChange={({ target: { value } }) =>
                    setDateConfig((prev) => ({
                      ...prev,
                      date: moment(new Date(value)).format("YYYY-MM-DD"),
                    }))
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
                    setDateConfig((prev) =>
                      prev.type === "range"
                        ? {
                            ...prev,
                            dates: [
                              moment(new Date(value)).format("YYYY-MM-DD"),
                              prev.dates?.[1],
                            ],
                          }
                        : prev
                    )
                  }
                />
                <Input
                  type={"date"}
                  value={dateConfig.dates?.[1]}
                  onChange={({ target: { value } }) =>
                    setDateConfig((prev) =>
                      prev.type === "range"
                        ? {
                            ...prev,
                            dates: [
                              prev.dates?.[0],
                              moment(new Date(value)).format("YYYY-MM-DD"),
                            ],
                          }
                        : prev
                    )
                  }
                />
              </div>
            );
          case "repeated":
            return (
              <div>
                <DatesRepeatedInput />
              </div>
            );
        }
      })()}
    </div>
  );
};
export const DatesRepeatedInput = () => {
  return (
    <div>
      Год:
      <div>
        <Select placeholder={"C"}>
          {yearsArray.map((it) => (
            <MenuItem value={it}>{it}</MenuItem>
          ))}
        </Select>
        <Select placeholder={"По"}>
          {yearsArray.map((it) => (
            <MenuItem value={it}>{it}</MenuItem>
          ))}
        </Select>
      </div>
      Месяцы:
      <Select></Select>
      <Button>Добавить</Button>
    </div>
  );
};
