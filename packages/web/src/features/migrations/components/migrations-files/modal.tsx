import { Dialog, DialogProps } from "@mui/material";

import React from "react";
type MigrationFilesModalProps = DialogProps;
export const MigrationFilesModal = (
  props: MigrationFilesModalProps,
  files: FileList
) => {
  return <Dialog {...props}></Dialog>;
};
const MigrationFilesModalFile = (file: File) => {
  return <></>;
};
