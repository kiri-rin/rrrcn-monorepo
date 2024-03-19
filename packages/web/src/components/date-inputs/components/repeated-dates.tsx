import { Button, MenuItem, Select, SelectProps } from "@mui/material";
import { AddBoxRounded, Close } from "@mui/icons-material";
import React from "react";
import { LangType } from "@/store/lang/reducer";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { getIdGetter } from "@/utils/id";
import {
  RepeatedDateInputContainer,
  RepeatedDateInputYearContainer,
} from "@/components/date-inputs/components/style";
const currentYear = new Date().getFullYear();
const yearsArray = new Array(currentYear - 2000)
  .fill(0)
  .map((it, index) => index + 2000);
type RepeatedDatesConfig = {
  years?: [number, number][];
  months?: number[];
  days?: [number, number | string][];
};
const getMonth = (idx: number, locale: LangType) => {
  const objDate = new Date();
  objDate.setDate(1);
  objDate.setMonth(idx);
  return objDate.toLocaleString(locale, { month: "long" });
};
const getKey = getIdGetter();

export const DatesRepeatedInput = ({
  value: dateConfig = {},
  onChange,
  error,
}: {
  value: RepeatedDatesConfig;
  onChange: (val: RepeatedDatesConfig) => any;
  error?: any;
}) => {
  const lang = useSelector((state: RootState) => state.lang);
  return (
    <RepeatedDateInputContainer $error={error}>
      Годы:
      <RepeatedDateInputYearContainer $error={error}>
        {dateConfig?.years?.map((it, index) => (
          <div key={it.join("")}>
            <YearSelect
              value={it[0]}
              onChange={({ target: { value } }) => {
                const currentYear: [number, number] = [...it];
                currentYear[0] = value as number;
                onChange({
                  ...dateConfig,
                  years: [
                    ...(dateConfig.years?.slice(0, index) || []),
                    currentYear,
                    ...(dateConfig.years?.slice(index + 1) || []),
                  ],
                });
              }}
            />
            <YearSelect
              value={it[1]}
              onChange={({ target: { value } }) => {
                const currentYear: [number, number] = [...it];
                currentYear[1] = value as number;
                onChange({
                  ...dateConfig,
                  years: [
                    ...(dateConfig.years?.slice(0, index) || []),
                    currentYear,
                    ...(dateConfig.years?.slice(index + 1) || []),
                  ],
                });
              }}
            />
            <Close
              onClick={() => {
                onChange({
                  ...dateConfig,
                  years: [
                    ...(dateConfig.years?.slice(0, index) || []),
                    ...(dateConfig.years?.slice(index + 1) || []),
                  ],
                });
              }}
            />
          </div>
        ))}
        <Button
          onClick={() => {
            console.log("Changed");
            onChange({
              ...dateConfig,
              years: [...(dateConfig?.years || []), [2001, 2001]],
            });
          }}
        >
          <AddBoxRounded />
        </Button>
      </RepeatedDateInputYearContainer>
      Месяцы:
      <Select
        error={!!error?.dates?.months}
        style={{ width: "100%" }}
        multiple={true}
        onChange={({ target: { value } }) =>
          onChange({
            ...dateConfig,
            months: value as number[],
          })
        }
        size={"small"}
        value={dateConfig.months || []}
      >
        {[...Array(12).keys()].map((it, index) => (
          <MenuItem value={index}>{getMonth(index, lang)}</MenuItem>
        ))}
      </Select>
    </RepeatedDateInputContainer>
  );
};
const YearSelect = ({
  children,
  ...props
}: Omit<SelectProps<number>, "variant">) => (
  <Select size={"small"} {...props}>
    {yearsArray.map((year) => (
      <MenuItem value={year}>{year}</MenuItem>
    ))}
  </Select>
);
