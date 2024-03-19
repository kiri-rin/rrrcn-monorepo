import { Offset } from "../../App";
import { BASE_PATH } from "@/api/constants";
import Drawer from "@mui/material/Drawer";
import React, { useEffect, useState } from "react";
import { useEventSource } from "@/utils/hooks";
import { LinearProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const AnalysisRightPanel = () => {
  const results = useSelector((state: RootState) => state.userRecentResults);

  return (
    <>
      {results?.map(({ uid: resultId }) => (
        <EventSourceLogs resultId={resultId} key={resultId} />
      ))}
    </>
  );
};
const EventSourceLogs = ({ resultId }: { resultId: number }) => {
  const {
    message: { message, id: messageId },
    close,
  } = useEventSource(`${BASE_PATH}/api/result/loading/${resultId}`, [resultId]);
  return (
    <div style={{ border: "1px solid", padding: 10, margin: 10, width: 200 }}>
      {!close && <LinearProgress />}
      <div>{message}</div>
      {"result will be available here \n"}
      <a
        style={{ wordBreak: "break-all" }}
        target="_blank"
        rel="noopener noreferrer"
        href={`${BASE_PATH}/api/result/download/${resultId}`}
      >{`${BASE_PATH}/api/result/download/${resultId}`}</a>
    </div>
  );
};
