import styled from "@emotion/styled";
import { Box, Modal } from "@mui/material";

export const CommonModalContainer = styled(Modal)`
  margin-left: auto;
  margin-right: auto;

  max-width: 650px;
  min-width: 400px;
`;
export const CommonModalBody = styled(Box)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: white;
`;
