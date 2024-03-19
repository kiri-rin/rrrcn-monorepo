import { Migration } from "../../types";
export enum TrackerFileTypes {
  AQUILA = "aquila",
  ORNITELLA = "ornitella",
  DRUID = "druid",
}
export type WorkerMessage = {
  type: TrackerFileTypes;
  file: File;
  id: string;
};
export type ParseTrackerXML = (
  file: File,
  DOMParser: DOMParser
) => Promise<Omit<Migration, "id">>;
