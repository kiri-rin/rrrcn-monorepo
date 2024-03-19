export type PaginatedListState<EntityType> = {
  list: EntityType[];
  page: number;
  pageSize: number;
};
