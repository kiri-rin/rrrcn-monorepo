import { userResultsReduxApi } from "@/store/results";
import React, { useState } from "react";
import {
  CabinetUsersResultsContainer,
  CabinetUsersResultsList,
  CabinetUsersResultsPagination,
} from "./style";
import { CabinetUsersResultItem } from "@/features/user/cabinet/results/components/item";

export const CabinetUsersResults = () => {
  const [page, setPage] = useState<number>(1);

  const { data, isLoading, error } = userResultsReduxApi.useLoadResultsQuery({
    page,
  });

  return (
    <CabinetUsersResultsContainer>
      <CabinetUsersResultsPagination
        count={data?.pagination.pageCount || 1}
        page={page}
        onChange={(ev, value) => {
          setPage(Number(value));
        }}
      />
      <CabinetUsersResultsList>
        {data?.results?.map((it) => (
          <CabinetUsersResultItem item={it} />
        ))}
      </CabinetUsersResultsList>
    </CabinetUsersResultsContainer>
  );
};
