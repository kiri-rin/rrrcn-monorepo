import { GoogleMap, Libraries, LoadScript } from "@react-google-maps/api";
import { api } from "../../../src/api/index";
import { PaginatedResult } from "../../../src/api/models/Pagination";
import { SpatialGridCell } from "../../../src/api/models/SpatialGridCell";
import {
  GoogleMapObject,
  parseGeojson,
} from "@/utils/geometry/map/useDrawGeojson";
import * as turf from "@turf/turf";
import React, { useEffect, useMemo, useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { SpatialGrid } from "../../../src/api/models/SpatialGrid";
import { Geometry, Position } from "geojson";
import { Drawer, List, ListItemButton } from "@mui/material";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
type MainPageProps = {
  title: string;
  cells: PaginatedResult<SpatialGridCell> | null;
  grids: PaginatedResult<SpatialGrid> | null;
  mapCells: GoogleMapObject[] | null;
};
const styles = { width: "100%", height: 700 };

const center = {
  lat: 44.745,
  lng: 68.523,
};
const libraries: Libraries = ["drawing", "geometry"];
const getCellColor = (vulnerability: number) => {
  if (vulnerability <= 0) {
    return;
  }
  if (vulnerability < 1) {
    return "green";
  }
  if (vulnerability < 2) {
    return "orange";
  }
  return "red";
};
export default function MainPage(props: MainPageProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const router = useRouter();
  const params = useParams();

  const mapCells = useMemo(() => {
    return map && props.cells
      ? parseGeojson({
          type: "FeatureCollection",
          features: props.cells.results.map((it) =>
            turf.feature(it.polygon as Geometry)
          ),
        })
      : [];
  }, [map, props.cells]);

  const mapGrids = useMemo(() => {
    return map && props.grids
      ? parseGeojson({
          type: "FeatureCollection",
          features: props.grids.results.map((it) =>
            turf.polygon(it.polygon as Position[][], { slug: it.slug })
          ),
        })
      : [];
  }, [map, props.cells]);

  useEffect(() => {
    if (params?.slug) {
      mapCells?.forEach((it, index) => {
        it.setMap(map);
        const color = getCellColor(
          props.cells?.results[index]?.total_vulnerability
        );
        it.setOptions({ strokeWeight: 0.1 });
        color && it.setOptions({ fillColor: color });
      });

      return () => {
        mapCells?.forEach((it) => it.setMap(null));
      };
    }
  }, [mapCells, params?.slug]);
  useEffect(() => {
    if (!params?.slug) {
      mapGrids?.forEach((it, index) => {
        it.setMap(map);
        it.addListener("click", () => {
          router.replace(`/map/${props.grids?.results[index]?.slug}`);
        });
      });

      return () => {
        mapGrids?.forEach((it) => it.setMap(null));
      };
    }
  }, [mapGrids, params?.slug]);
  console.log(props);
  return (
    <LoadScript
      libraries={libraries}
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY || ""}
    >
      <Drawer variant={"persistent"} open={true} anchor={"left"}>
        <List style={{ width: 200 }}>
          {props.grids?.results?.map(
            ({ title, slug }) =>
              !!slug && (
                <ListItemButton component={Link} href={slug}>
                  {title}
                </ListItemButton>
              )
          )}
        </List>
      </Drawer>
      <GoogleMap
        onLoad={(map: google.maps.Map) => {
          setMap(map);
        }}
        center={center}
        zoom={5}
        mapContainerStyle={styles}
      ></GoogleMap>
    </LoadScript>
  );
}
export const getServerSideProps: GetServerSideProps = async (params) => {
  try {
    const { slug } = params.params || {};
    const { data: grids }: { data: PaginatedResult<SpatialGrid> } =
      await api.spatialGrid.getApiSpatialGrids({
        params: {
          pagination: { limit: 10000 },
        },
      });
    const { data: cells }: { data: PaginatedResult<SpatialGridCell> | null } =
      slug
        ? await api.spatialGridCell.getApiSpatialGridCells({
            params: {
              pagination: { limit: 10000 },
              filters: { spatial_grid: { slug } },
            },
          })
        : { data: null };

    return { props: { title: "Hello", cells, grids } };
  } catch (e) {
    console.log(e);
  }
  return { props: { title: "Hello", cells: null, grids: null } };
};
