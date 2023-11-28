import { Button, Card, CircularProgress, Input } from "@mui/material";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import { parseMigrationsKml } from "../utils";
import { TrackInfo } from "./track-info";
import { parseGeojson } from "../../../utils/geometry/map/useDrawGeojson";
import { IndexedMigration } from "../migrations";
import { useMutation, useQueries, useQuery } from "react-query";
import { useParseKMLWorker } from "../workers/context";
import { MigrationFilesModal } from "./migrations-files/modal";

export const MigrationsFilesInput = ({
  migrations,
  onMigrationsChange,
}: {
  migrations: IndexedMigration[] | undefined;
  onMigrationsChange: Dispatch<SetStateAction<IndexedMigration[] | undefined>>;
}) => {
  const worker = useParseKMLWorker();
  const [filesToParse, setFilesToParse] = useState<FileList | null>(null);
  const [currentEdit, setCurrentEdit] = useState<number | null>(null);
  const [loadingFilesNumber, setLoadingFilesNumber] = useState(0);
  const parseFiles = useCallback(
    (files: FileList | null) => {
      setLoadingFilesNumber((prev) => prev + (files?.length || 0));
      return worker ? parseMigrationsKml(worker, files) : Promise.resolve([]);
    },
    [worker]
  );
  const {
    isLoading,
    mutate: parseInputFiles,
    variables,
  } = useMutation<Partial<IndexedMigration>[], any, FileList | null>(
    "parseFiles",
    parseFiles,
    {
      onError: (error, variables) => {
        setLoadingFilesNumber((prev) =>
          Math.max(prev - (variables?.length || 0), 0)
        );
      },
      onSuccess: (res, variables) => {
        console.log(res);
        setLoadingFilesNumber((prev) =>
          Math.max(prev - (variables?.length || 0), 0)
        );
        onMigrationsChange((prevState) => [
          ...(prevState || []),
          ...addMigrationsMarkers(res),
        ]);
      },
    }
  );
  const ref = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <Button
        onClick={() => {
          ref.current?.click();
        }}
      >
        Add files
      </Button>
      <Input
        inputRef={ref}
        style={{ visibility: "hidden" }}
        inputProps={{ multiple: true }}
        size={"small"}
        type={"file"}
        onChange={({
          target: { files },
        }: React.ChangeEvent<HTMLInputElement>) => {
          parseInputFiles(files);
        }}
      />
      {migrations?.map((migr, index) => (
        <TrackInfo
          filteredMigration={migr}
          onChangeEditState={(edit) => {
            setCurrentEdit((curEdit) => {
              if (curEdit === index && !edit) {
                return null;
              } else {
                return index;
              }
            });
          }}
          migration={migr}
          isEdit={currentEdit === index}
          onEditEnd={(result) => {
            onMigrationsChange((prev) => {
              if (!prev) {
                prev = [];
              }
              prev[index] = result;
              return [...prev];
            });
          }}
        />
      ))}
      {Array(loadingFilesNumber)
        .fill(0)
        .map(() => (
          <Card className={`common__card common__card_blue`}>
            <CircularProgress />
          </Card>
        ))}
      <MigrationFilesModal open={!!filesToParse?.length} />
    </>
  );
};
const addMigrationsMarkers = (migrations: Partial<IndexedMigration>[]) => {
  return migrations.map((it: any) => {
    it.mapObjects = parseGeojson(it.geojson).map((_it, index) => {
      (_it as google.maps.Marker).setTitle(
        String(it.geojson.features[index].properties?.date)
      );
      return _it;
    });
    return it;
  });
};
