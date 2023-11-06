import { UsersPermissions_Role } from "./UsersPermissions_Role";
export type UsersPermissions_Permission = {
  id: number;
  action: string;
  role: UsersPermissions_Role | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: any | null;
  updatedBy: any | null;
};
