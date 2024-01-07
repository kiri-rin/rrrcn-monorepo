import { CommonShowMarkersButton } from "../../../../components/common";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";

export const MigrationSeasonShowMarkersButton = styled(
  CommonShowMarkersButton
)``;
export const MigrationSeasonTitleRow = styled("div")`
  flex-direction: row;
  display: flex;
  align-items: center;
`;
export const MigrationSeasonTitle = styled("div")`
  flex-direction: row;
  margin-right: 12px;
  font-weight: 500;
`;
export const MigrationSeasonDates = styled(Typography)`
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;
