import React from "react";
import { MenuItem, Select } from "@mui/material";
const currentYear = new Date().getFullYear();
const yearsArray = new Array(currentYear - 2000)
  .fill(0)
  .map((it, index) => index + 2000);
export const DateRangesInput = () => {
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
    </div>
  );
};
