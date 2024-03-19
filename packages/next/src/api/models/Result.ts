import { UsersPermissions_User } from "./UsersPermissions_User";
import { SpatialGridCell } from "./SpatialGridCell";
import { AnalysisResult } from "./AnalysisResult";
export type Result = {
  id: number;
  status: ("processing" | "completed" | "error") | null;
  uid: uid | null;
  user: UsersPermissions_User | null;
  request_type: ("data" | "random_forest" | "population") | null;
  finished_at: string | null;
  logs: string | null;
  spatial_grid_cell: SpatialGridCell | null;
  analysis_results: AnalysisResult[] | null;
  createdAt: string;
  updatedAt: string | null;
  createdBy: any | null;
  updatedBy: any | null;
};
