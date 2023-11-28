import { IndexedMigration } from "../../migrations";
import { Migration } from "../../types";

export type WorkerMessage = {
  type: "parse" | "parse_aquila" | "parse_ornitella";
  files: File[];
  id: string;
};
export type ParseTrackerXML = (
  file: File,
  DOMParser: DOMParser
) => Promise<Migration>;
