import "@react-google-maps/api";
import { ParseTrackerXML, TrackerFileTypes, WorkerMessage } from "./types";
import { parseAquilaKML } from "./aquila";
import { Migration } from "../../types";
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
    case TrackerFileTypes.AQUILA:
    default:
      parser = parseAquilaKML;
      break;
  }
  console.log("START PROCESSING", data);

  parser(file, DOMParser)
    .then((res) => {
      console.log("finished", id);
      callback({ result: res, id });
    })
    .catch((err) => {
      console.log("finished with error", id);
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
    : /* eslint-disable-next-line no-restricted-globals */
      processData(e.data, self.postMessage);
};
export {};
