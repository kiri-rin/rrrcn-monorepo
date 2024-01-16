import { GenerateTracksResponse } from "@rrrcn/services/dist/src/controllers/migrations/types";

export const exportGeneratedMigrationsTracks = (
  generatedTracks: GenerateTracksResponse
) => {
  const tracksBlobs = generatedTracks.generatedTracks.map(
    (fc) => new Blob([JSON.stringify(fc.points)])
  );
  // tracksBlobs.reduce();
};
