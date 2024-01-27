import {
  GenerateTracksResponse,
  TrackPointProperties,
} from "@rrrcn/services/dist/src/controllers/migrations/types";
import { featureCollection, length, lineString } from "@turf/turf";
import { Position } from "geojson";
import shpwrite from "@mapbox/shp-write";
import { BlobReader, BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";
export const exportGeneratedMigrationsTracks = async (
  generatedTracks: GenerateTracksResponse
) => {
  const tracksLineStrings = featureCollection(
    generatedTracks.generatedTracks.map(({ points }) => {
      const tracklLneString = lineString(
        points.features
          .map(({ geometry }) => geometry?.coordinates)
          .filter((it) => it) as Position[],
        { length: 0 }
      );
      tracklLneString.properties.length = length(tracklLneString);
      return tracklLneString;
    })
  );
  const allPointsFeatureCollection = featureCollection(
    generatedTracks.generatedTracks.flatMap(({ points }, index) =>
      points.features.map((it) => ({
        ...it,
        properties: { ...it.properties, __exportedTrackIndex: index },
      }))
    )
  );
  const areas = featureCollection(
    generatedTracks.grid.features.map((it, index) => ({
      ...it,
      properties: { ...it.properties, ...generatedTracks.indexedAreas[index] },
    }))
  );
  const pointsJsonBlob = new Blob([JSON.stringify(allPointsFeatureCollection)]);
  const linesJsonBlob = new Blob([JSON.stringify(tracksLineStrings)]);
  const areasJsonBlob = new Blob([JSON.stringify(areas)]);
  const pointsShapeBlob: Blob = await shpwrite.zip<"blob">(
    allPointsFeatureCollection,
    {
      outputType: "blob",
      compression: "STORE",
    }
  );
  const linesShapeBlob: Blob = await shpwrite.zip<"blob">(tracksLineStrings, {
    outputType: "blob",
    compression: "STORE",
  });
  const areasShapeBlob: Blob = await shpwrite.zip<"blob">(areas, {
    outputType: "blob",
    compression: "STORE",
  });
  const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
  await Promise.all([
    zipWriter.add("lines.geojson", new BlobReader(linesJsonBlob)),
    zipWriter.add("points.geojson", new BlobReader(pointsJsonBlob)),
    zipWriter.add("areas.geojson", new BlobReader(areasJsonBlob)),
    zipWriter.add("lines_shp.zip", new BlobReader(linesShapeBlob)),
    zipWriter.add("points_shp.zip", new BlobReader(pointsShapeBlob)),
    zipWriter.add("areas_shp.zip", new BlobReader(areasShapeBlob)),
  ]);
  downloadFile(await zipWriter.close());

  // tracksBlobs.reduce();
};

function downloadFile(blob: Blob) {
  const link = Object.assign(document.createElement("a"), {
    download: "tracks.zip",
    href: URL.createObjectURL(blob),
    textContent: "Download zip file",
    style: { width: 0, height: 0 },
  });
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
type ExportedMigrationsTracksPoints = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  TrackPointProperties & { __exportedTrackIndex: number }
>;

type ExportedMigrationsTracksLineStrings = GeoJSON.FeatureCollection<
  GeoJSON.LineString,
  { __exportedTrackIndex: number }
>;
