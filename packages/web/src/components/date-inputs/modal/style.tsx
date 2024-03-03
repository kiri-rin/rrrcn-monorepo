import styled from "@emotion/styled";
import { Modal } from "@mui/material";
import {
  CommonModalBody,
  CommonModalContainer,
} from "@/components/common/modal";
import { RepeatedDateInputContainer } from "@/components/date-inputs/components/style";

export const DatesModal = styled(CommonModalContainer)``;
export const DatesModalBody = styled(CommonModalBody)`
  background-color: white;
`;
export const DatesModalElement = styled("div")`
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 100%;
  flex: 1;
  overflow: hidden;

  justify-content: space-between;
  ${RepeatedDateInputContainer} {
    flex: 1;
    width: 100%;
    max-width: 100%;
  }
`;
