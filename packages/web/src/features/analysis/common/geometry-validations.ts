import * as yup from "yup";
import { lazy } from "yup";
import { GeometryInputConfig } from "@/components/geometry-inputs/geometry-input";
import { DataExtractionInput } from "../classifications/random-forest/data-extraction";

export const GeometryInputSchema: (
  geometryValidator?: (
    from: GeometryInputConfig["type"],
    geometry: any
  ) => yup.Schema<any>
) => yup.Schema<GeometryInputConfig> = (
  geometryValidator = () => yup.mixed().required()
) =>
  lazy((value: DataExtractionInput["points"]) => {
    switch (value?.type) {
      case "geojson": {
        return yup.object({
          type: yup.string().required(),
          json: geometryValidator(value.type, value.json),
        });
      }
      case "computedObject": {
        return yup.object({
          type: yup.string().required(),
        });
      }
      default:
      case "csv": {
        const geom = ""; //TODO Parse and validate csv
        return yup.object({
          type: yup.string().required(),
          path: geometryValidator(value.type, geom),
        });
      }
      case "shp": {
        const geom = ""; //TODO  Parse and validate shp
        return yup.object({
          type: yup.string().required(),
          path: geometryValidator(value.type, geom),
        });
      }
    }
  }) as unknown as yup.Schema<GeometryInputConfig>;
