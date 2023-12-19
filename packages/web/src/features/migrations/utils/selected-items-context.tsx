import {
  createContext,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { MigrationPointProperties } from "../types";

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
}>({
  selectedPoint: null,
  setSelectedPoint: () => {},
});
export const MigrationSelectedItemsProvider = ({
  children,
}: PropsWithChildren) => {
  const [selectedPoint, setSelectedPoint] = useState<GeoJSON.Feature<
    GeoJSON.Point,
    MigrationPointProperties
  > | null>(null);
  return (
    <MigrationSelectedItemsContext.Provider
      value={{ setSelectedPoint, selectedPoint }}
    >
      {children}
    </MigrationSelectedItemsContext.Provider>
  );
};
export const useMigrationSelectedItems = () => {
  return useContext(MigrationSelectedItemsContext);
};
