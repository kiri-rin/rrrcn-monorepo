import { UsersPermissions_User } from "./UsersPermissions_User";
export type Result = {
  id: number;
  status: ("processing" | "completed" | "error") | null;
  uid: string | null;
  users_permissions_user: UsersPermissions_User | null;
  request_type: ("data" | "random_forest" | "population") | null;
  finished_at: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: any | null;
  updatedBy: any | null;
};
