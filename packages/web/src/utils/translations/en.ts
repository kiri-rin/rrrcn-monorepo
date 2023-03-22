import { getPluralEn } from "./plural/en";

export const enTranslations = {
  "common.advanced-settings": "Advanced settings",
  "common.edit": "Edit",
  "common.delete": "Delete",
  "common.dates": "Dates",
  "common.close": "Close",
  "common.clear": "Clear",
  "common.save": "Save",
  "common.hide": "Hide",
  "common.show": "Show",
  "common.objects-plural": (number: number) =>
    getPluralEn({ number, key: "objects" }),
  "data-extraction.add-data": "Add data",
  "data-extraction.title": "Data export",
  "data-extraction.get-result": "Get result",
  "data-extraction.add-dates-to-result": "Add dates to result",
  "data-extraction.choose-params": "Add params",
  "data-extraction.choose-points": "Add points",
  "random-forest.title": "Random forest",
  "random-forest.choose-training-points": "Add  training points",
  "random-forest.choose-region": "Add  region of interest",
  "random-forest.all-training-points": "All points",
  "random-forest.separate-training-points": "Separate points",
  "script-input.scale": "scale",
  "script-input.buffer": "buffer",
  "script-input.filename": "filename",
};
