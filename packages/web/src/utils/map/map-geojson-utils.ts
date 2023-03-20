export type GeometryInputMapObject =
  | {
      type: "Points";
      object: google.maps.Marker[];
    }
  | { type: "Rectangle"; object: google.maps.Rectangle }
  | { type: "Circle"; object: google.maps.Circle };
const rectangleToGeojson = (
  rect: google.maps.Rectangle
): GeoJSON.Feature<GeoJSON.Polygon> => {
  return {
    type: "Feature",
    geometry: { coordinates: [], type: "Polygon" },
    properties: {},
  };
};
export const pointsToGeojson = (
  poinst: google.maps.Marker[]
): GeoJSON.FeatureCollection<GeoJSON.Point> => {
  return {
    type: "FeatureCollection",
    features: poinst.map((point, index) => ({
      type: "Feature",
      id: index,
      geometry: {
        coordinates: [
          Number(point.getPosition()?.lng()) || 0,
          Number(point.getPosition()?.lat()) || 0,
        ],
        type: "Point",
      },
      properties: {
        longitude: Number(point.getPosition()?.lng()) || 0,
        latitude: Number(point.getPosition()?.lat()) || 0,
      },
    })),
  };
};
export const polygonsToGeojson = (
  polygons: google.maps.Polygon[]
): GeoJSON.FeatureCollection<GeoJSON.Polygon> => {
  return {
    type: "FeatureCollection",
    features: polygons.map((polygon, index) => ({
      type: "Feature",
      id: index,
      geometry: {
        coordinates: [
          polygon
            .getPaths()
            .getAt(0)
            .getArray()
            .map((path) => [Number(path.lng() || 0), Number(path.lat() || 0)]),
        ],
        type: "Polygon",
      },
      properties: {},
    })),
  };
};
