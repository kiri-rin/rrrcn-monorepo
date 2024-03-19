import { SpatialGrid } from "./SpatialGrid";
import { Result } from "./Result";
import { AnalysisResult } from "./AnalysisResult";
export type SpatialGridCell = {
  id: number;
  spatial_grid: SpatialGrid | null;
  bbox_left: number | null;
  bbox_top: number | null;
  bbox_right: number | null;
  bbox_bottom: number | null;
  polygon: object | null;
  results: Result[] | null;
  analysis_results: AnalysisResult[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
  createdBy: any | null;
  updatedBy: any | null;
};
