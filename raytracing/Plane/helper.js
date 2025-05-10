// Helper functions for vector and matrix calculations
// Note: This still requires glMatrix library to be loaded

/**
 * Ray-sphere intersection test
 * @param {vec3} origin - Ray origin point
 * @param {vec3} direction - Ray direction (normalized)
 * @param {Object} sphere - Sphere object with center and radius properties
 * @returns {number} - Distance to intersection or -1 if no intersection
 */
function intersectSphere(origin, direction, sphere) {
  // Calculate coefficients for quadratic equation
  const oc = vec3.create();
  vec3.subtract(oc, origin, sphere.center);

  const a = vec3.dot(direction, direction);
  const b = 2.0 * vec3.dot(oc, direction);
  const c = vec3.dot(oc, oc) - sphere.radius * sphere.radius;

  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return -1; // No intersection
  }

  // Calculate the nearest intersection point
  const t = (-b - Math.sqrt(discriminant)) / (2.0 * a);

  if (t < 0) {
    return -1; // Intersection behind the ray origin
  }

  return t;
}

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

  // Checkerboard pattern - black and white, ignoring pattern type
  const scale = plane.pattern?.scale || 1.0;
  const isUEven = Math.floor(pu * scale) % 2 === 0;
  const isVEven = Math.floor(pv * scale) % 2 === 0;

  // Pure black and white chess board
  return isUEven !== isVEven ? [0.0, 0.0, 0.0] : [1.0, 1.0, 1.0];
}

/**
 * Calculate surface normal at intersection point
 * @param {Object} object - The intersected object
 * @param {vec3} point - The intersection point
 * @returns {vec3} - The surface normal vector
 */
function calculateNormal(object, point) {
  const normal = vec3.create();

  if (object.type === "sphere") {
    // For sphere, normal is normalized vector from center to point
    vec3.subtract(normal, point, object.center);
    vec3.normalize(normal, normal);
  } else if (object.type === "plane") {
    // For plane, just return the plane's normal
    vec3.copy(normal, object.normal);
  }

  return normal;
}

/**
 * Calculate reflection direction
 * @param {vec3} incident - Incident ray direction
 * @param {vec3} normal - Surface normal
 * @returns {vec3} - Reflection direction
 */
function calculateReflectionDirection(incident, normal) {
  const reflectDir = vec3.create();
  const dot = vec3.dot(normal, incident);
  vec3.scale(reflectDir, normal, 2 * dot);
  vec3.subtract(reflectDir, incident, reflectDir);
  vec3.normalize(reflectDir, reflectDir);
  return reflectDir;
}

/**
 * Calculate Phong lighting without shadows
 * @param {Object} intersection - Intersection information
 * @param {vec3} viewDir - View direction
 * @param {Array} lights - Array of light sources
 * @returns {Array} - RGB color values
 */
function calculatePhongLighting(intersection, viewDir, lights) {
  const { point, normal, object } = intersection;
  const material = object.material;

  // Initialize result color
  const result = [0, 0, 0];

  // Get the base color (using pattern for planes)
  let baseColor;
  if (object.type === "plane" && object.pattern?.enabled) {
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

  return result.map((c) => Math.min(255, Math.max(0, Math.floor(c * 255))));
}

/**
 * Convert screen coordinates to normalized ray direction
 * @param {number} x - Screen x coordinate
 * @param {number} y - Screen y coordinate
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {vec3} - Normalized ray direction
 */
function getRayDirection(x, y, width, height) {
  // Convert pixel coordinates to normalized device coordinates (-1 to 1)
  const ndcX = (x / width) * 2 - 1;
  const ndcY = 1 - (y / height) * 2; // Flip Y to match OpenGL convention

  // Create ray direction (simple perspective projection)
  const rayDir = vec3.fromValues(ndcX, ndcY, 1);
  vec3.normalize(rayDir, rayDir);

  return rayDir;
}

/**
 * Find the closest intersection with any object in the scene
 * @param {vec3} origin - Ray origin point
 * @param {vec3} direction - Ray direction (normalized)
 * @param {Array} objects - Array of objects in the scene
 * @returns {Object|null} - Information about the closest intersection or null if none
 */
function findClosestIntersection(origin, direction, objects) {
  let closestT = Infinity;
  let closestObject = null;
  let intersectionPoint = null;
  let intersectionNormal = null;

  // Test intersection with each object
  for (const object of objects) {
    let t = -1;

    // Check object type and use appropriate intersection function
    if (object.type === "sphere") {
      t = intersectSphere(origin, direction, object);
    } else if (object.type === "plane") {
      t = intersectPlane(origin, direction, object);
    }

    // If we found a closer intersection, update our result
    if (t > 0 && t < closestT) {
      closestT = t;
      closestObject = object;

      // Calculate intersection point
      intersectionPoint = vec3.create();
      vec3.scaleAndAdd(intersectionPoint, origin, direction, t);

      // Calculate normal at intersection point
      intersectionNormal = calculateNormal(object, intersectionPoint);
    }
  }

  if (closestObject) {
    return {
      distance: closestT,
      object: closestObject,
      point: intersectionPoint,
      normal: intersectionNormal,
    };
  }

  return null;
}

/**
 * Calculate reflection color
 * @param {Object} intersection - Intersection information
 * @param {vec3} viewDir - View direction
 * @param {Array} objects - Scene objects
 * @param {Array} lights - Scene lights
 * @param {number} depth - Current recursion depth
 * @param {number} maxDepth - Maximum recursion depth
 * @returns {Array} - RGB color values
 */
function calculateReflection(
  intersection,
  viewDir,
  objects,
  lights,
  depth,
  maxDepth
) {
  if (depth >= maxDepth) {
    return [0, 0, 0];
  }

  const { point, normal, object } = intersection;
  const material = object.material;

  // Get base color from Phong lighting
  const baseColor = calculatePhongLighting(intersection, viewDir, lights);

  // If object is not reflective, return base color
  if (!material.reflectivity) {
    return baseColor;
  }

  // Calculate reflection direction
  const reflectDir = calculateReflectionDirection(viewDir, normal);

  // Offset reflection origin to prevent self-intersection
  const reflectOrigin = vec3.create();
  vec3.scaleAndAdd(reflectOrigin, point, normal, 0.001);

  // Get reflected color
  const reflectedIntersection = findClosestIntersection(
    reflectOrigin,
    reflectDir,
    objects
  );
  if (!reflectedIntersection) {
    return baseColor;
  }

  const reflectedColor = calculateReflection(
    reflectedIntersection,
    reflectDir,
    objects,
    lights,
    depth + 1,
    maxDepth
  );

  // Mix colors based on reflectivity
  return baseColor.map((c, i) =>
    Math.min(
      255,
      c * (1 - material.reflectivity) +
        reflectedColor[i] * material.reflectivity
    )
  );
}
