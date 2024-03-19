import { number } from "yup";

export type PaginatedResult<EntityType> = {
  results: EntityType[];
  pagination: {
    pageCount: number;
    page: number;
    total: number;
    pageSize: number;
  };
};
