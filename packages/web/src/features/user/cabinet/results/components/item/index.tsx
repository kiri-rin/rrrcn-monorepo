import { Result } from "@/api/models/Result";
import {
  CabinetUsersResultItemBottomRow,
  CabinetUsersResultItemContainer,
  CabinetUsersResultItemDate,
  CabinetUsersResultItemId,
  CabinetUsersResultItemInnerContainer,
  CabinetUsersResultItemLink,
  CabinetUsersResultItemStatus,
  CabinetUsersResultItemType,
} from "@/features/user/cabinet/results/components/item/style";
import { BASE_PATH } from "@/api/constants";
import { format } from "date-fns";

export const CabinetUsersResultItem = (props: { item: Result }) => {
  const link = `${BASE_PATH}/api/result/download/${props.item.uid}`;
  return (
    <CabinetUsersResultItemContainer>
      <CabinetUsersResultItemInnerContainer>
        <CabinetUsersResultItemType>
          {props.item.request_type}
        </CabinetUsersResultItemType>
        <CabinetUsersResultItemId>{props.item.id}</CabinetUsersResultItemId>
        <CabinetUsersResultItemStatus>
          {props.item.status}
        </CabinetUsersResultItemStatus>
        <CabinetUsersResultItemBottomRow>
          <CabinetUsersResultItemLink href={link}>
            Скачать
          </CabinetUsersResultItemLink>
          <CabinetUsersResultItemDate>
            {format(new Date(props.item.createdAt), "dd.MM.yyyy HH:mm")}
          </CabinetUsersResultItemDate>
        </CabinetUsersResultItemBottomRow>
      </CabinetUsersResultItemInnerContainer>
    </CabinetUsersResultItemContainer>
  );
};
