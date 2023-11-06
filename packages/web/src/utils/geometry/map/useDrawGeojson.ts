import { useContext, useEffect, useRef } from "react";
import { MapDrawingContext } from "../../../components/map/MapEdit";
import { GeoJSON, GeoJsonProperties, Geometry } from "geojson";
export type GoogleMapObject =
  | google.maps.Polygon
  | google.maps.Rectangle
  | google.maps.Marker
  | google.maps.Circle
  | google.maps.Polyline;
export const useDrawGeojson = (geojsons?: GeoJSON[], deps: any[] = []) => {
  const { map } = useContext(MapDrawingContext);
  const mapObjectsRef = useRef<GoogleMapObject[]>([]);
  useEffect(() => {
    if (!map || !geojsons) {
      return;
    }
    for (let geojson of geojsons) {
      // TODO optimize
      mapObjectsRef.current.push(...drawGeojson(map, geojson));
    }
    return () => {
      mapObjectsRef.current.forEach((shape) => {
        shape.setMap(null);
      });
    };
  }, [...deps, map]);
};
export const drawGeojson = (
  map: google.maps.Map,
  geojson: GeoJSON
): GoogleMapObject[] => {
  const mapObjects = parseGeojson(geojson);
  mapObjects.forEach((shape) => {
    shape.setMap(map);
  });
  return mapObjects;
};
export const parseGeojson = (geojson: GeoJSON): GoogleMapObject[] => {
  switch (geojson.type) {
    case "Feature": {
      return parseGeojsonGeometry(geojson.geometry, geojson.properties);
    }
    case "FeatureCollection": {
      return geojson.features.flatMap((feature) =>
        parseGeojsonGeometry(feature.geometry, feature.properties)
      );
    }
    default: {
      return parseGeojsonGeometry(geojson);
    }
  }
};
const parseGeojsonGeometry = (
  geometry: Geometry,
  properties?: GeoJsonProperties
): GoogleMapObject[] => {
  switch (geometry.type) {
    case "GeometryCollection": {
      return geometry.geometries.flatMap((g) =>
        parseGeojsonGeometry(g, properties)
      );
    }

    case "Polygon": {
      return [
        new google.maps.Polygon({
          paths: geometry.coordinates[0].map((coord) => ({
            lat: Number(coord[1]),
            lng: Number(coord[0]),
          })),
        }),
      ];
      break;
    }
    case "Point": {
      return [
        new google.maps.Marker({
          icon: {
            url: "https://cdn.iconscout.com/icon/free/png-256/free-dot-22-433567.png?f=webp",
            size: new google.maps.Size(12, 12),
            anchor: new google.maps.Point(6, 6),
            origin: new google.maps.Point(120, 120),
          },
          position: {
            lat: Number(geometry.coordinates[1]),
            lng: Number(geometry.coordinates[0]),
          },
        }),
      ];
    }
    case "LineString": {
      return [
        new google.maps.Polyline({
          path: geometry.coordinates.map((coord) => ({
            lat: coord[1],
            lng: coord[0],
          })),
        }),
      ];
      break;
    }
    default: {
      return [
        new google.maps.Marker({
          position: {
            lat: 0,
            lng: 0,
          },
        }),
      ];
    }

    // case "MultiLineString": {
    //   break;
    // }
    // case "MultiPoint": {
    //   break;
    // }
    // case "MultiPolygon": {
    //   break;
    // }
  }
};
