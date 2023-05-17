import { Offset } from "../../App";
import { BASE_PATH } from "../../api/constants";
import Drawer from "@mui/material/Drawer";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../api";
import { useEventSource } from "../../utils/hooks";
import { LinearProgress } from "@mui/material";

export const AnalysisRightPanel = () => {
  const [results, setResults] = useState<number[]>([]);
  const { data: dataExtractionState } = useQuery(
    "analysis-results",
    api.analysis.postApiAnalysisProcess,
    { enabled: false }
  );

  useEffect(() => {
    setResults((prev) => [
      ...prev,
      ...(dataExtractionState?.data?.filter(
        (it: number) => !prev.includes(it)
      ) || []),
    ]);
  }, [dataExtractionState]);

  return (
    <Drawer variant="permanent" anchor="right">
      <Offset style={{ width: 200 }} />
      {results?.map((resultId: number) => (
        <EventSourceLogs resultId={resultId} key={resultId} />
      ))}
    </Drawer>
  );
};
const EventSourceLogs = ({ resultId }: { resultId: number }) => {
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
          target="_blank"
          rel="noopener noreferrer"
          href={`${BASE_PATH}/api/result/download/${resultId}`}
        >{`${BASE_PATH}/api/result/download/${resultId}`}</a>
      )}
    </div>
  );
};
