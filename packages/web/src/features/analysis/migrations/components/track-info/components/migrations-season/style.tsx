import { CommonShowMarkersButton } from "@/components/common/common";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";

export const MigrationSeasonShowMarkersButton = styled(CommonShowMarkersButton)`
  margin-left: auto;
`;
export const MigrationSeasonTitleRow = styled("div")`
  flex-direction: row;
  display: flex;
  align-items: center;
  width: 100%;
`;
export const MigrationSeasonTitle = styled("span")`
  flex-direction: row;
  margin-right: 12px;
  font-weight: 500;
`;
export const MigrationSeasonDates = styled(Typography)`
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  align-self: flex-end;
`;
