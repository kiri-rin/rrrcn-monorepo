import { Dialog, DialogProps, MenuItem, Select } from "@mui/material";

import React, { useState } from "react";
import { TrackerFileTypes, WorkerMessage } from "../../workers/parse_kml/types";
import {
  MigrationFilesModalButtons,
  MigrationFilesModalDialog,
  MigrationFilesModalFileContainer,
  MigrationFilesModalFileDeleteButton,
  MigrationFilesModalFileName,
  MigrationFilesModalFileTypeSelect,
  MigrationFilesModalSaveButton,
} from "./style";
import { useTranslations } from "@/utils/translations";
type MigrationFilesModalProps = DialogProps & {
  files: FileList;
  onParseClick: (filesWithTypes: MigrationFilesParseConfig[]) => void;
};
export type MigrationFilesParseConfig = {
  file: File;
  type: WorkerMessage["type"];
};
export const MigrationFilesModal = ({
  files,
  onParseClick,
  ...props
}: MigrationFilesModalProps) => {
  const t = useTranslations();
  const [filesToParse, setFilesToParse] = useState<MigrationFilesParseConfig[]>(
    Array.from(files).map((file) => ({ file, type: TrackerFileTypes.AQUILA }))
  );
  return (
    <MigrationFilesModalDialog {...props}>
      {filesToParse.map((file, index) => (
        <MigrationFilesModalFile
          fileWithType={file}
          onDeleteClick={() => {
            setFilesToParse((prevState) => {
              const newState = [...prevState].filter(
                (it, _index) => _index !== index
              );
              return newState;
            });
          }}
          onChangeType={(type) => {
            setFilesToParse((prevState) => {
              const newState = [...prevState];
              newState[index].type = type;
              return newState;
            });
          }}
        />
      ))}
      <MigrationFilesModalButtons>
        <MigrationFilesModalSaveButton
          onClick={(e) => {
            props.onClose?.(e, "backdropClick");
          }}
        >
          {t["common.cancel"]}
        </MigrationFilesModalSaveButton>
        <MigrationFilesModalSaveButton
          onClick={() => {
            onParseClick(filesToParse);
          }}
        >
          {t["migrations.parse-files"]}
        </MigrationFilesModalSaveButton>
      </MigrationFilesModalButtons>
    </MigrationFilesModalDialog>
  );
};
const TrackerFileTypesArray = [
  TrackerFileTypes.AQUILA,
  TrackerFileTypes.ORNITELLA,
  TrackerFileTypes.DRUID,
];
const MigrationFilesModalFile = ({
  fileWithType,
  onDeleteClick,
  onChangeType,
}: {
  fileWithType: MigrationFilesParseConfig;
  onDeleteClick: () => void;
  onChangeType: (type: WorkerMessage["type"]) => void;
}) => {
  const t = useTranslations();
  return (
    <MigrationFilesModalFileContainer>
      <MigrationFilesModalFileName title={fileWithType.file.name}>
        {fileWithType.file.name}
      </MigrationFilesModalFileName>
      <MigrationFilesModalFileTypeSelect
        size={"small"}
        value={fileWithType.type}
        onChange={({ target: { value } }) => {
          onChangeType(value as WorkerMessage["type"]);
        }}
      >
        {TrackerFileTypesArray.map((it) => (
          <MenuItem value={it}>{it}</MenuItem>
        ))}
      </MigrationFilesModalFileTypeSelect>
      <MigrationFilesModalFileDeleteButton onClick={onDeleteClick}>
        {t["common.delete"]}
      </MigrationFilesModalFileDeleteButton>
    </MigrationFilesModalFileContainer>
  );
};
