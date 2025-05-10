/**
 * Check if a point is in shadow
 * @param {vec3} point - The intersection point
 * @param {vec3} lightDir - Direction to the light
 * @param {Array} objects - Scene objects
 * @param {Object} currentObject - Current object (to be excluded)
 * @param {Object} light - The light source
 * @returns {boolean} - True if the point is in shadow
 */
function isPointInShadow(point, lightDir, objects, currentObject, light) {
  // Add a small offset to avoid self-intersection
  const shadowOrigin = vec3.create();
  vec3.scaleAndAdd(shadowOrigin, point, currentObject.normal, 0.001);

  // Calculate distance to light
  const distanceToLight = vec3.distance(shadowOrigin, light.position);

  // Check for intersection with any object between point and light
  for (const object of objects) {
    // Skip the current object
    if (object === currentObject) continue;

    let t = -1;
    if (object.type === "sphere") {
      t = intersectSphere(shadowOrigin, lightDir, object);
    } else if (object.type === "plane") {
      t = intersectPlane(shadowOrigin, lightDir, object);
    }

    // If there's an intersection before the light, the point is in shadow
    if (t > 0 && t < distanceToLight) {
      return true;
    }
  }

  return false;
}
