import { SpatialGridCell } from "./SpatialGridCell";
export type SpatialGrid = {
  id: number;
  title: string | null;
  bbox_left: number | null;
  bbox_top: number | null;
  bbox_right: number | null;
  bbox_bottom: number | null;
  polygon: object | null;
  spatial_grid_cells: SpatialGridCell[] | null;
  slug: string | null;
  cell_size: number;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
  createdBy: any | null;
  updatedBy: any | null;
};
