// Basic plane calculations

/**
 * Ray-plane intersection test
 * @param {vec3} origin - Ray origin point
 * @param {vec3} direction - Ray direction (normalized)
 * @param {Object} plane - Plane object with normal and point properties
 * @returns {number} - Distance to intersection or -1 if no intersection
 */
function intersectPlane(origin, direction, plane) {
  const denom = vec3.dot(direction, plane.normal);
  if (Math.abs(denom) < 0.0001) {
    return -1; // Ray is parallel to plane
  }

  const p0l0 = vec3.create();
  vec3.subtract(p0l0, plane.point, origin);
  const t = vec3.dot(p0l0, plane.normal) / denom;

  return t > 0 ? t : -1;
}

/**
 * Calculate floor grid pattern
 * @param {vec3} point - Intersection point
 * @returns {Array} - RGB color values
 */
function calculateFloorPattern(point) {
  const gridSize = 1.0;
  // Classic black and white chess pattern
  const x = Math.floor(point[0] / gridSize);
  const z = Math.floor(point[2] / gridSize);
  const isEven = (x + z) % 2 === 0;
  return isEven ? [0, 0, 0] : [1, 1, 1]; // Pure black and white
}

/**
 * Get color for a point on a patterned plane
 * @param {vec3} point - The point on the plane
 * @param {Object} plane - The plane object
 * @returns {vec3} - The color at that point
 */
function getPlanePattern(point, plane) {
  // Create two perpendicular vectors on the plane
  const u = vec3.create();
  const v = vec3.create();

  // Find a vector that's not parallel to the normal
  const temp =
    Math.abs(plane.normal[0]) < 0.9
      ? vec3.fromValues(1, 0, 0)
      : vec3.fromValues(0, 1, 0);

  // Calculate two perpendicular vectors on the plane
  vec3.cross(u, plane.normal, temp);
  vec3.normalize(u, u);

  vec3.cross(v, plane.normal, u);
  vec3.normalize(v, v);

  // Project the point onto the plane basis vectors
  const pu = vec3.dot(point, u);
  const pv = vec3.dot(point, v);

  // Simple black and white checkerboard pattern
  const scale = plane.pattern?.scale || 1.0;
  const isUEven = Math.floor(pu * scale) % 2 === 0;
  const isVEven = Math.floor(pv * scale) % 2 === 0;

  // Pure black and white colors for chess board effect
  return isUEven !== isVEven ? [0, 0, 0] : [1, 1, 1];
}

/**
 * Override the calculatePhongLighting function to support patterns
 * This function will be used by helper.js
 *
 * @param {Object} intersection - Intersection information
 * @param {vec3} viewDir - View direction
 * @param {Array} lights - Array of light sources
 * @param {Array} objects - Array of scene objects (for shadow calculation)
 * @returns {Array} - RGB color values
 */
function calculatePhongLighting(intersection, viewDir, lights, objects) {
  const { point, normal, object } = intersection;
  const material = object.material;

  // Initialize result color
  const result = [0, 0, 0];

  // Get the base color (using chess pattern for planes)
  let baseColor;
  if (object.type === "plane" && object.pattern?.enabled) {
    // Use simplified black and white pattern for planes
    baseColor = getPlanePattern(point, object);
  } else {
    baseColor = object.color;
  }

  // Add ambient light
  const ambient = vec3.scale(vec3.create(), baseColor, material.ambient);
  vec3.add(result, result, ambient);

  for (const light of lights) {
    // Calculate light direction and distance
    const lightDir = vec3.create();
    vec3.subtract(lightDir, light.position, point);
    const distanceToLight = vec3.length(lightDir);
    vec3.normalize(lightDir, lightDir);

    // Check for shadows if shadow function exists
    let inShadow = false;
    if (typeof isPointInShadow === "function") {
      inShadow = isPointInShadow(point, lightDir, objects, object, light);
    }

    if (!inShadow) {
      // Calculate diffuse lighting
      const diffuseFactor = Math.max(0, vec3.dot(normal, lightDir));
      const diffuse = vec3.scale(
        vec3.create(),
        baseColor,
        diffuseFactor * material.diffuse
      );

      // Calculate specular lighting
      const reflectDir = calculateReflectionDirection(lightDir, normal);
      const specularFactor = Math.pow(
        Math.max(0, vec3.dot(reflectDir, viewDir)),
        material.shininess
      );
      const specular = vec3.scale(
        vec3.create(),
        [1, 1, 1],
        specularFactor * material.specular
      );

      // Add diffuse and specular components with light intensity and distance attenuation
      const attenuation = 1.0 / (1.0 + 0.1 * distanceToLight * distanceToLight);
      vec3.scaleAndAdd(result, result, diffuse, light.intensity * attenuation);
      vec3.scaleAndAdd(result, result, specular, light.intensity * attenuation);
    }
  }

  return result.map((c) => Math.min(255, Math.max(0, Math.floor(c * 255))));
}

// Helper function for reflection direction calculation
function calculateReflectionDirection(incident, normal) {
  const reflectDir = vec3.create();
  const dot = vec3.dot(normal, incident);
  vec3.scale(reflectDir, normal, 2 * dot);
  vec3.subtract(reflectDir, incident, reflectDir);
  vec3.normalize(reflectDir, reflectDir);
  return reflectDir;
}
