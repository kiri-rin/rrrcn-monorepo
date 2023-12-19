import { IndexedMigration } from "../../migrations";
import { Migration } from "../../types";
export enum TrackerFileTypes {
  AQUILA = "aquila",
  ORNITELLA = "ornitella",
}
export type WorkerMessage = {
  type: TrackerFileTypes;
  file: File;
  id: string;
};
export type ParseTrackerXML = (
  file: File,
  DOMParser: DOMParser
) => Promise<Migration>;
