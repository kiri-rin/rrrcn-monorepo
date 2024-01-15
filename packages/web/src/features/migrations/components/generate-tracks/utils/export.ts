import { GenerateTracksResponse } from "@rrrcn/services/dist/src/controllers/migrations/types";

export const exportGeneratedMigrationsTracks = (
  generatedTracks: GenerateTracksResponse
) => {
  const tracksData = new Blob([
    JSON.stringify(generatedTracks.generatedTracks),
  ]);
};
