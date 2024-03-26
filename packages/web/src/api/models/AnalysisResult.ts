import { Result } from "./Result";
import { SpatialGridCell } from "./SpatialGridCell";
import { Upload_File } from "./Upload_File";
import { Species } from "./Species";
import { SpatialGrid } from "./SpatialGrid";
export type AnalysisResult = {
  id: number;
  users_result: Result | null;
  spatial_grid_cell: SpatialGridCell | null;
  analysis_type:
    | (
        | "data"
        | "population"
        | "survival"
        | "classification"
        | "migration"
        | "vulnerability"
      )
    | null;
  analysis_data: object | null;
  admin_comment: string | null;
  parent_results: AnalysisResult[] | null;
  children_results: AnalysisResult[] | null;
  attachments: Upload_File[] | null;
  species: Species | null;
  spatial_grid: SpatialGrid | null;
  bbox_left: number | null;
  bbox_top: number | null;
  bbox_right: number | null;
  bbox_bottom: number | null;
  polygon: object | null;
  published: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: any | null;
  updatedBy: any | null;
};
