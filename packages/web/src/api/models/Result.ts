import { UsersPermissions_User } from "./UsersPermissions_User";
import { SpatialGridCell } from "./SpatialGridCell";
import { AnalysisResult } from "./AnalysisResult";
export type Result = {
  id: number;
  status: ("processing" | "completed" | "error") | null;
  uid: string | null;
  user: UsersPermissions_User | null;
  type:
    | (
        | "data"
        | "population"
        | "survival"
        | "maxent"
        | "random-forest"
        | "migration"
        | "vulnerability"
      )
    | null;
  finished_at: string | null;
  logs: string | null;
  spatial_grid_cell: SpatialGridCell | null;
  analysis_results: AnalysisResult[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: any | null;
  updatedBy: any | null;
};
