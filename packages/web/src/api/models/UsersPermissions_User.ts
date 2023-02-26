import { UsersPermissions_Role } from "./UsersPermissions_Role";
export type UsersPermissions_User = {
  id: number;
  username: string;
  email: string;
  provider: string | null;
  password: string | null;
  resetPasswordToken: string | null;
  confirmationToken: string | null;
  confirmed: boolean | null;
  blocked: boolean | null;
  role: UsersPermissions_Role | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: any | null;
  updatedBy: any | null;
};
