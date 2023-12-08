import "@react-google-maps/api";
import { ParseTrackerXML, WorkerMessage } from "./types";
import { parseAquilaKML } from "./aquila";
import { Migration } from "../../types";

const DOMParser = new (require("xmldom").DOMParser)();
const queue: WorkerMessage[] = [];
let processing = false;
/* eslint-disable-next-line no-restricted-globals */
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  if (!e.data) {
    return;
  }
  const { type, file, id } = e.data;
  const processData = (data: any) => {
    let parser: ParseTrackerXML;
    switch (e.data.type) {
      case "aquila":
      default:
        parser = parseAquilaKML;
        break;
    }
    console.log("START PROCESSING", data);

    if (!data) {
      return;
    }
    parser(file, DOMParser)
      .then((res) => {
        console.log("finished", id);
        /* eslint-disable-next-line no-restricted-globals */
        self.postMessage({ result: res, id });
      })
      .catch((err) => {
        console.log("finished with error", id);
        console.log(err);
        processing = false;

        /* eslint-disable-next-line no-restricted-globals */
        self.postMessage({ result: null, id });
      })
      .finally(() => {
        processData(queue.pop());
      });
  };

  queue.length || processing ? queue.unshift(e.data) : processData(e.data);
};
export {};
