import {
  createContext,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { MigrationPointProperties } from "../types";
import { IndexedArea } from "@rrrcn/services/src/controllers/migrations/types";

const MigrationSelectedItemsContext = createContext<{
  selectedPoint: GeoJSON.Feature<
    GeoJSON.Point,
    MigrationPointProperties
  > | null;
  setSelectedPoint: React.Dispatch<
    SetStateAction<GeoJSON.Feature<
      GeoJSON.Point,
      MigrationPointProperties
    > | null>
  >;

  selectedBBox:
    | (IndexedArea & { index: number })
    | {
        index: number;
        probabilities: undefined;
      }
    | null;
  setSelectedBBox: React.Dispatch<
    SetStateAction<{
      index: number;
      probabilities: any;
    } | null>
  >;
}>({
  selectedPoint: null,
  setSelectedPoint: () => {},
  selectedBBox: null,
  setSelectedBBox: () => {},
});
export const MigrationSelectedItemsProvider = ({
  children,
}: PropsWithChildren) => {
  const [selectedPoint, setSelectedPoint] = useState<GeoJSON.Feature<
    GeoJSON.Point,
    MigrationPointProperties
  > | null>(null);
  const [selectedBBox, setSelectedBBox] = useState<{
    index: number;
    probabilities: any;
  } | null>(null);
  return (
    <MigrationSelectedItemsContext.Provider
      value={{ setSelectedPoint, selectedPoint, selectedBBox, setSelectedBBox }}
    >
      {children}
    </MigrationSelectedItemsContext.Provider>
  );
};
export const useMigrationSelectedItems = () => {
  return useContext(MigrationSelectedItemsContext);
};
