import { Strapi } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import * as turf from "@turf/turf";
const { ApplicationError } = errors;
export default ({ strapi }: { strapi: Strapi }) => ({
  validateSpatialGridCreate(entity) {
    if (
      !entity?.polygon &&
      !(
        entity.bbox_left &&
        entity.bbox_right &&
        entity.bbox_top &&
        entity.bbox_bottom
      )
    ) {
      throw new ApplicationError("polygon or bbox is required");
    }
    if (entity?.polygon) {
      try {
        const polygon = turf.polygon(entity.polygon);
        const bbox = turf.bbox(polygon);
        entity.bbox_left = bbox[0];
        entity.bbox_bottom = bbox[1];
        entity.bbox_right = bbox[2];
        entity.bbox_top = bbox[3];
      } catch (e) {
        console.error(e);
        throw new ApplicationError("Invalid polygon");
      }
    } else {
      try {
        entity.polygon = turf.bboxPolygon([
          entity.bbox_left,
          entity.bbox_bottom,
          entity.bbox_right,
          entity.bbox_top,
        ]);
      } catch (e) {
        throw new ApplicationError("Invalid bbox");
      }
    }
  },
});
