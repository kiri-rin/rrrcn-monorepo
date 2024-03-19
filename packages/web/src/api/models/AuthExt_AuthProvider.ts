import { UsersPermissions_User } from "./UsersPermissions_User";
export type AuthExt_AuthProvider = {
  id: number;
  provider: string | null;
  provider_owner: string | null;
  username: string | null;
  email: string | null;
  enable_as_first_step: boolean | null;
  enable_as_second_step: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: any | null;
  updatedBy: any | null;
  user: UsersPermissions_User | null;
};
