import * as yup from "yup";
import { lazy } from "yup";
import { DatesInputConfig } from "./script-dates";
import { DateIntervalsInputConfig } from "./dates-interval";

export const DateIntervalsSchema = lazy((value: DateIntervalsInputConfig) => {
  switch (value.type) {
    case "range": {
      return yup.object({
        type: yup.string().required(),
        dates: yup.array(yup.string().required()).required().min(2).max(2),
      });
    }
    case "repeated": {
      return yup.object({
        type: yup.string().required(),
        dates: yup.object({
          years: yup
            .array(yup.array(yup.string().required()).length(2))
            .required()
            .min(1),
          months: yup.array(yup.string().required()).required().max(12).min(1),
          days: yup.array(yup.array(yup.string().required()).length(2)),
        }),
      });
    }
    default:
    case "date":
      return yup.object({
        type: yup.string().required(),
        date: yup.string().required(),
      });
  }
});
export const DatesInputItemSchema = yup.object({
  key: yup.string().required(),
  dateIntervals: yup
    .array<DateIntervalsInputConfig>(
      DateIntervalsSchema as unknown as yup.Schema<DateIntervalsInputConfig>
    )
    .min(1)
    .required(),
});
export const DatesInputSchema: yup.Schema<DatesInputConfig | undefined> =
  yup.array(DatesInputItemSchema);
