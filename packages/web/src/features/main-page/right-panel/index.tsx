import { Offset } from "../../../App";
import { BASE_PATH } from "../../../api/constants";
import Drawer from "@mui/material/Drawer";
import React from "react";
import { useQuery } from "react-query";
import { api } from "../../../api";
import { useEventSource } from "../../../utils/hooks";
import { LinearProgress } from "@mui/material";

export const AnalysisRightPanel = () => {
  const { data: dataExtractionState } = useQuery(
    "analysis-results",
    api.analysis.postApiAnalysisProcess,
    { enabled: false }
  );
  const { data: scriptsList } = useQuery(
    "analysis-scripts",
    (opt) => api.analysis.getApiAnalysisScripts(),
    { refetchOnWindowFocus: false }
  );
  console.log({ dataExtractionState });

  return (
    <Drawer variant="permanent" anchor="right">
      <Offset />
      {dataExtractionState?.data?.map((resultId: string) => (
        <EventSourceLogs resultId={resultId} key={resultId} />
      ))}
    </Drawer>
  );
};
const EventSourceLogs = ({ resultId }: { resultId: string }) => {
  const {
    message: { message, id: messageId },
    close,
  } = useEventSource(
    // TODO maybe better to handle messages on low level? like dom
    `${BASE_PATH}/api/result/loading/${resultId}`,
    [resultId]
  );
  return (
    <div style={{ border: "1px solid", padding: 10, margin: 10, width: 200 }}>
      {!close && <LinearProgress />}
      <div>{message}</div>
      {messageId === "success" && (
        <a
          href={`${BASE_PATH}/api/result/download/${resultId}`}
        >{`${BASE_PATH}/api/result/download/${resultId}`}</a>
      )}
    </div>
  );
};
