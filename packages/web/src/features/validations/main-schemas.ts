import * as yup from "yup";
import { DataExtractionInput } from "../random-forest/data-extraction";
import { RandomForestInputConfig } from "../random-forest/random-forest";
import { PopulationInputConfig } from "../population/population";
import { RandomForestInputSchema } from "./rf-schemas";
import { PopulationSchema } from "./population-schemas";
import { DataExtractionValidationSchema } from "./data-schemas";
import { FormType } from "../../navigation/main-page/left-panel";

export const FullSchema = yup.lazy(
  (value: {
    data?: Partial<DataExtractionInput>;
    randomForest?: Partial<RandomForestInputConfig>;
    population?: PopulationInputConfig;
    analysisIncluded: {
      data: boolean;
      randomForest: boolean;
      population: boolean;
    };
  }) => {
    const schemaObject = {} as any;
    if (value.analysisIncluded.data) {
      schemaObject.data = DataExtractionValidationSchema;
    }
    if (
      value.analysisIncluded.randomForest ||
      isPopulationUseRandomForest(value)
    ) {
      schemaObject.randomForest = RandomForestInputSchema;
    }
    if (value.analysisIncluded.population) {
      schemaObject.population = PopulationSchema;
    }
    return yup.object(schemaObject);
  }
);
export const isPopulationUseRandomForest = (value: FormType) => {
  console.log(
    value.population?.type, //@ts-ignore
    value.population
  );
  return (
    value.analysisIncluded.population &&
    value.population?.type === "random-points" &&
    value.population.config?.presenceArea?.type === "computedObject"
  );
};
