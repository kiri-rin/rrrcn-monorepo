import React, { useState } from "react";
import {
  TopMenuResultsAllButton,
  TopMenuResultsDrawer,
  TopMenuResultsDrawerButton,
  TopMenuResultsDrawerButtonBadge,
} from "@/features/top-menu/components/results/style";
import { AnalysisRightPanel } from "@/features/main-page/right-panel";
import { Offset } from "@/App";
import { useNavigate } from "react-router-dom";
import { routes } from "@/navigation/routes";
import { useSelector } from "react-redux";
import { Badge, IconButton } from "@mui/material";
import { RootState } from "@/store";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
export const TopMenuResults = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const recentResults = useSelector(
    (state: RootState) => state.userRecentResults
  );
  return (
    <>
      <TopMenuResultsDrawerButtonBadge
        badgeContent={recentResults.length}
        color="secondary"
      >
        <TopMenuResultsDrawerButton onClick={() => setOpen((prev) => !prev)} />
      </TopMenuResultsDrawerButtonBadge>
      <TopMenuResultsDrawer
        anchor="right"
        variant={"persistent"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <IconButton
          style={{ alignSelf: "flex-start" }}
          onClick={() => setOpen(false)}
        >
          <ChevronRightIcon />
        </IconButton>
        <TopMenuResultsAllButton
          onClick={() => {
            setOpen(false);
            navigate(routes.CabinetResults);
          }}
        >
          Посмотреть все результаты
        </TopMenuResultsAllButton>
        <AnalysisRightPanel />
      </TopMenuResultsDrawer>
    </>
  );
};
