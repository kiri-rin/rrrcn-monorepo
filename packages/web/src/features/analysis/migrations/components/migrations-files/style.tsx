import styled from "@emotion/styled";
import { Button, Dialog, Paper, Select, Typography } from "@mui/material";
export const MigrationFilesModalDialog = styled(Dialog)`
  .MuiPaper-root {
    padding: 30px;
    width: 600px;
  }
`;
export const MigrationFilesModalFileContainer = styled("div")`
  display: flex;
  gap: 10px;
  width: 100%;
  align-items: center;
  margin-bottom: 10px;
`;

export const MigrationFilesModalFileName = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MigrationFilesModalFileTypeSelect = styled(Select)`
  display: flex;
  margin-left: auto;
`;
export const MigrationFilesModalFileDeleteButton = styled(Button)`
  flex: 0;
`;

export const MigrationFilesModalButtons = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
export const MigrationFilesModalSaveButton = styled(Button)``;
