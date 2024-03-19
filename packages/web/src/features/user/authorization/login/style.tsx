import styled from "@emotion/styled";
import { Button, Card, Paper, TextField } from "@mui/material";
import { CommonPaper } from "@/components/common/common";
export const LoginContainer = styled("div")`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const LoginCard = styled(CommonPaper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const LoginEmailInput = styled(TextField)``;
export const LoginPasswordInput = styled(TextField)``;
export const LoginSubmitButton = styled(Button)``;
