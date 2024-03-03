import { Input, MenuItem, Select } from "@mui/material";
import moment from "moment";
import { DatesRepeatedInput } from "../components/repeated-dates";
import { DateIntervalInputContainer } from "@/components/date-inputs/dates-interval/style";

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
export const DatesIntervalsInput = ({
  value: dateConfig,
  onChange: setDateConfig,
  error,
}: {
  value: DateIntervalsInputConfig;
  onChange: (val: DateIntervalsInputConfig) => any;
  error: any;
}) => {
  return (
    <DateIntervalInputContainer>
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
                  error={!!error?.date}
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
                  error={!!error?.dates?.[0]}
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
                  error={!!error?.dates?.[1]}
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
                error={error}
                value={dateConfig.dates || {}}
                onChange={(changed) => {
                  setDateConfig({ ...dateConfig, dates: changed });
                }}
              />
            );
        }
      })()}
    </DateIntervalInputContainer>
  );
};
