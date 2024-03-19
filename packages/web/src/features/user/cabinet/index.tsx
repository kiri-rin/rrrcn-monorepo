import { PropsWithChildren } from "react";
import {
  CabinetLayoutContainer,
  CabinetLayoutInnerContainer,
  CabinetLayoutMenu,
  CabinetLayoutMenuItem,
  CabinetLayoutMenuLogoutButton,
} from "@/features/user/cabinet/style";
import { routes } from "@/navigation/routes";
import { Link } from "react-router-dom";
import { useLogoutMutation } from "@/store/user";

export const CabinetLayout = (props: PropsWithChildren) => {
  const [logout] = useLogoutMutation();
  return (
    <CabinetLayoutContainer>
      <CabinetLayoutInnerContainer>
        <CabinetLayoutMenu>
          <CabinetLayoutMenuItem to={routes.CabinetInfo}>
            Инфо
          </CabinetLayoutMenuItem>
          <CabinetLayoutMenuItem to={routes.CabinetResults}>
            Результаты
          </CabinetLayoutMenuItem>
          <CabinetLayoutMenuLogoutButton
            onClick={() => {
              logout({});
            }}
          >
            Выйти
          </CabinetLayoutMenuLogoutButton>
        </CabinetLayoutMenu>
        {props.children}
      </CabinetLayoutInnerContainer>
    </CabinetLayoutContainer>
  );
};
