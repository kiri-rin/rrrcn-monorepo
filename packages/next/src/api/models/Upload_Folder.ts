import { Upload_File } from "./Upload_File";
export type Upload_Folder = {
  id: number;
  name: string;
  pathId: number;
  parent: Upload_Folder | null;
  children: Upload_Folder[] | null;
  files: Upload_File[] | null;
  path: string;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: any | null;
  updatedBy: any | null;
};
