import styled from "@emotion/styled";
import { Box, Button, Select } from "@mui/material";

export const ScriptInputContainer = styled(Box)`
  flex-direction: column;
  display: flex;
  border: 1px solid;
  margin-bottom: 8px;
  margin-top: 8px;
  padding: 8px;
  gap: 8px;
`;
export const ScriptInputSelect = styled(Select)``;
export const ScriptInputButtonsContainer = styled("div")`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
export const ScriptInputAdvancedButton = styled(Button)`
  margin-left: auto;
`;
export const ScriptInputAdvancedSettingsContainer = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
