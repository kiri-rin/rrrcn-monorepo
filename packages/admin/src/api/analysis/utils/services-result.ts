import { MultipleAreaVulnerabilityControllerResponse } from "@rrrcn/services/src/controllers/vulnerability/multiple-area-vulnerability";
import * as turf from "@turf/turf";
type ServicesResponse = {
  type: "vulnerability";
  response: MultipleAreaVulnerabilityControllerResponse;
};
export async function mapVulnerabilityResponseToResult(
  response: MultipleAreaVulnerabilityControllerResponse
) {
  return Object.entries(response || {}).map(
    ([areaId, { extended, single, area }]) => {
      const bbox = turf.bbox(area);
      return {
        analysis_data: { extended, single },
        analysis_type: "vulnerability",
        polygon: area,
        bbox_left: bbox[0],
        bbox_bottom: bbox[1],
        bbox_right: bbox[2],
        bbox_top: bbox[3],
      };
    }
  );
}
export async function mapServicesResponseToResult(response: ServicesResponse) {
  switch (response.type) {
    case "vulnerability":
      return mapVulnerabilityResponseToResult(response.response);
    default:
      return {};
  }
}
