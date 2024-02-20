import "@react-google-maps/api";
import { ParseTrackerXML, TrackerFileTypes, WorkerMessage } from "./types";
import { parseAquilaKML } from "./aquila";
import { Migration } from "../../types";
import { indexTrackByYears } from "../index_tracks/by-date";
import { parseOrnitellaKML } from "./ornitella";
import { parseDruidKML } from "./druid";
const DOMParser = new (require("xmldom").DOMParser)();
const queue: WorkerMessage[] = [];
let processing = false;
/* eslint-disable-next-line no-restricted-globals */
const processData = (
  data: WorkerMessage | undefined,
  callback: (res: { result: any; id: any }) => void
) => {
  if (!data) {
    return;
  }
  const { type, file, id } = data;

  let parser: ParseTrackerXML;
  switch (type) {
    case TrackerFileTypes.ORNITELLA:
      parser = parseOrnitellaKML;
      break;
    case TrackerFileTypes.DRUID:
      parser = parseDruidKML;
      break;
    case TrackerFileTypes.AQUILA:
    default:
      parser = parseAquilaKML;
      break;
  }
  parser(file, DOMParser)
    .then((res) => {
      (res as Migration).id = String(Math.random());
      callback({ result: res as Migration, id });
    })
    .catch((err) => {
      console.log(err);
      processing = false;

      callback({ result: null, id });
    })
    .finally(() => {
      processData(queue.pop(), callback);
    });
};
/* eslint-disable-next-line no-restricted-globals */
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  if (!e.data) {
    return;
  }

  queue.length || processing
    ? queue.unshift(e.data)
    : processData(e.data, (res) => {
        res.result.years = indexTrackByYears(res.result);
        /* eslint-disable-next-line no-restricted-globals */
        self.postMessage(res);
      });
};
export {};
