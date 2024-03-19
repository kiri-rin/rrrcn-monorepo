import { Result } from "./Result";
import { SpatialGridCell } from "./SpatialGridCell";
import { Upload_File } from "./Upload_File";
export type AnalysisResult = {
  id: number;
  users_result: Result | null;
  spatial_grid_cell: SpatialGridCell | null;
  analysis_type: ("classification" | "population" | "vulnerability") | null;
  analysis_data: object | null;
  admin_comment: string | null;
  parent_results: AnalysisResult[] | null;
  children_results: AnalysisResult[] | null;
  attachments: Upload_File[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: any | null;
  updatedBy: any | null;
};
