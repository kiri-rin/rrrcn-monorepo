import { RootState } from "@/store";
import { useSelector } from "react-redux";

export const CabinetInfo = () => {
  const user = useSelector((state: RootState) => state.user);
  return <>{user?.username}</>;
};
