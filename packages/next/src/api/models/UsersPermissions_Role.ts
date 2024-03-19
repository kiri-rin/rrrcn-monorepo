import { UsersPermissions_Permission } from "./UsersPermissions_Permission";
import { UsersPermissions_User } from "./UsersPermissions_User";
export type UsersPermissions_Role = {
  id: number;
  name: string;
  description: string | null;
  type: string | null;
  permissions: UsersPermissions_Permission[] | null;
  users: UsersPermissions_User[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: any | null;
  updatedBy: any | null;
};
