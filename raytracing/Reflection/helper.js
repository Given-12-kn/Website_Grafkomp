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
 * Check if a point is in shadow from a light source
 * @param {vec3} point - The point to check
 * @param {vec3} lightDir - Direction to the light
 * @param {Array} objects - Array of objects in the scene
 * @param {number} distanceToLight - Distance to the light source
 * @returns {boolean} - True if point is in shadow
 */
function isInShadow(point, lightDir, objects, distanceToLight) {
  // Offset the point slightly in the normal direction to avoid self-shadowing
  const offsetPoint = vec3.create();
  vec3.scaleAndAdd(offsetPoint, point, lightDir, 0.001);

  // Check for any intersections between point and light
  const intersection = findClosestIntersection(offsetPoint, lightDir, objects);
  return intersection && intersection.distance < distanceToLight;
}

/**
 * Calculate refraction direction using Snell's law
 * @param {vec3} incident - Incident ray direction
 * @param {vec3} normal - Surface normal
 * @param {number} n1 - Refractive index of medium 1 (usually air = 1.0)
 * @param {number} n2 - Refractive index of medium 2 (material IOR)
 * @returns {vec3|null} - Refraction direction or null if total internal reflection
 */
function calculateRefraction(incident, normal, n1, n2) {
  const n = n1 / n2;
  const cosI = -vec3.dot(normal, incident);
  const sin2T = n * n * (1.0 - cosI * cosI);

  if (sin2T > 1.0) {
    return null; // Total internal reflection
  }

  const cosT = Math.sqrt(1.0 - sin2T);
  const refractDir = vec3.create();

  vec3.scale(refractDir, incident, n);
  vec3.scaleAndAdd(refractDir, refractDir, normal, n * cosI - cosT);
  vec3.normalize(refractDir, refractDir);

  return refractDir;
}

/**
 * Calculate Fresnel factor
 * @param {vec3} incident - Incident ray direction
 * @param {vec3} normal - Surface normal
 * @param {number} n1 - Refractive index of medium 1
 * @param {number} n2 - Refractive index of medium 2
 * @returns {number} - Fresnel reflectance factor
 */
function calculateFresnel(incident, normal, n1, n2) {
  const cosI = Math.abs(vec3.dot(normal, incident));
  const n = n1 / n2;
  const sin2T = n * n * (1.0 - cosI * cosI);

  if (sin2T > 1.0) {
    return 1.0; // Total internal reflection
  }

  const cosT = Math.sqrt(1.0 - sin2T);
  const rOrth = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
  const rPar = (n2 * cosI - n1 * cosT) / (n2 * cosI + n1 * cosT);

  return Math.min(1.0, (rOrth * rOrth + rPar * rPar) / 2.0);
}

/**
 * Calculate reflection and refraction color with recursion
 * @param {vec3} origin - Ray origin point
 * @param {vec3} direction - Ray direction
 * @param {Array} objects - Array of objects in the scene
 * @param {Array} lights - Array of light sources
 * @param {number} depth - Current recursion depth
 * @param {number} maxDepth - Maximum recursion depth
 * @param {number} currentIOR - Current medium's index of refraction
 * @param {boolean} insideObject - Whether the ray is inside the object
 * @returns {Array} - RGB color values
 */
function calculateReflection(
  origin,
  direction,
  objects,
  lights,
  depth,
  maxDepth,
  currentIOR = 1.0,
  insideObject = false
) {
  if (depth >= maxDepth) {
    return [0, 0, 0];
  }

  const intersection = findClosestIntersection(origin, direction, objects);
  if (!intersection) {
    return [0, 0, 0];
  }

  const { point, normal, object } = intersection;
  const material = object.material;

  // Calculate view direction
  const viewDir = vec3.create();
  vec3.subtract(viewDir, origin, point);
  vec3.normalize(viewDir, viewDir);

  // Get base color from Phong lighting
  const baseColor = calculatePhongLighting(
    intersection,
    viewDir,
    lights,
    objects
  );

  // If object is neither reflective nor refractive, return base color
  if (!material.reflectivity && !material.isRefractive) {
    return baseColor;
  }

  let finalColor = [...baseColor];

  // Handle refraction for transparent objects
  if (material.isRefractive) {
    // Determine if we're entering or exiting the material
    const n1 = insideObject ? material.ior : 1.0;
    const n2 = insideObject ? 1.0 : material.ior;

    // Adjust normal if we're inside the object
    const adjustedNormal = insideObject
      ? vec3.negate(vec3.create(), normal)
      : normal;

    // Calculate Fresnel factor with angle-dependent adjustment
    let fresnel = calculateFresnel(direction, adjustedNormal, n1, n2);
    const cosTheta = Math.abs(vec3.dot(direction, adjustedNormal));
    fresnel = fresnel * (1 + Math.pow(1 - cosTheta, 5) * 0.2); // Enhance edge reflections

    // Calculate refraction direction
    const refractDir = calculateRefraction(direction, adjustedNormal, n1, n2);

    let refractedColor = [0, 0, 0];
    let reflectedColor = [0, 0, 0];

    // Handle total internal reflection
    if (!refractDir) {
      // Total internal reflection occurs
      const reflectDir = calculateReflectionDirection(
        direction,
        adjustedNormal
      );
      reflectedColor = calculateReflection(
        vec3.scaleAndAdd(vec3.create(), point, reflectDir, 0.001),
        reflectDir,
        objects,
        lights,
        depth + 1,
        maxDepth,
        n1,
        insideObject
      );
      finalColor = reflectedColor;
    } else {
      // Calculate both reflection and refraction
      const reflectDir = calculateReflectionDirection(
        direction,
        adjustedNormal
      );

      // Get reflected color
      reflectedColor = calculateReflection(
        vec3.scaleAndAdd(vec3.create(), point, reflectDir, 0.001),
        reflectDir,
        objects,
        lights,
        depth + 1,
        maxDepth,
        n1,
        insideObject
      );

      // Get refracted color with distance-based attenuation
      const refractOrigin = vec3.scaleAndAdd(
        vec3.create(),
        point,
        refractDir,
        0.001
      );
      refractedColor = calculateReflection(
        refractOrigin,
        refractDir,
        objects,
        lights,
        depth + 1,
        maxDepth,
        n2,
        !insideObject
      );

      // Enhanced color mixing based on viewing angle and material properties
      const viewFactor = Math.pow(
        1 - Math.abs(vec3.dot(direction, adjustedNormal)),
        2
      );
      const reflectWeight = fresnel + viewFactor * 0.2;
      const refractWeight = 1 - reflectWeight;

      finalColor = finalColor.map((_, i) => {
        const reflectComponent = reflectedColor[i] * reflectWeight;
        const refractComponent = refractedColor[i] * refractWeight;
        return Math.min(255, reflectComponent + refractComponent);
      });

      // Apply subtle color dispersion effect
      if (insideObject) {
        const dispersionFactor = 0.02;
        finalColor = finalColor.map((c, i) => {
          const dispersion = 1 + (i - 1) * dispersionFactor; // Different for R,G,B
          return Math.min(255, c * dispersion);
        });
      }
    }

    // Apply material color tint with enhanced accuracy
    if (
      object.color[0] !== 1 ||
      object.color[1] !== 1 ||
      object.color[2] !== 1
    ) {
      const tintStrength = insideObject ? 0.4 : 0.15; // Adjusted tint strength
      const pathLength = insideObject ? vec3.distance(origin, point) * 0.5 : 0;
      const attenuationFactor = Math.exp(-pathLength);

      finalColor = finalColor.map((c, i) => {
        const tintFactor =
          1 - (1 - object.color[i]) * tintStrength * attenuationFactor;
        return c * tintFactor;
      });
    }
  }

  // Handle pure reflection for non-refractive objects
  if (material.reflectivity > 0 && !material.isRefractive) {
    const reflectDir = calculateReflectionDirection(direction, normal);
    const reflectOrigin = vec3.scaleAndAdd(vec3.create(), point, normal, 0.001);

    const reflectedColor = calculateReflection(
      reflectOrigin,
      reflectDir,
      objects,
      lights,
      depth + 1,
      maxDepth,
      currentIOR,
      insideObject
    );

    const reflectionStrength = material.reflectivity;
    finalColor = finalColor.map(
      (c, i) =>
        c * (1 - reflectionStrength) + reflectedColor[i] * reflectionStrength
    );
  }

  return finalColor.map((c) => Math.min(255, Math.max(0, Math.floor(c))));
}

// Helper function to calculate reflection direction
function calculateReflectionDirection(incident, normal) {
  const reflectDir = vec3.create();
  const dot = vec3.dot(normal, incident);
  vec3.scale(reflectDir, normal, 2 * dot);
  vec3.subtract(reflectDir, incident, reflectDir);
  vec3.normalize(reflectDir, reflectDir);
  return reflectDir;
}

/**
 * Check if a point on a plane is on a light or dark square in a checkerboard pattern
 * @param {vec3} point - Point on the plane
 * @param {number} squareSize - Size of each square in the checkerboard
 * @returns {boolean} - True if on a light square, false if on a dark square
 */
function isLightSquare(point, squareSize = 1.0) {
  // Use the x and z coordinates for horizontal planes
  const x = Math.floor(Math.abs(point[0] / squareSize));
  const z = Math.floor(Math.abs(point[2] / squareSize));
  return (x + z) % 2 === 0;
}

/**
 * Calculate Phong lighting with shadows
 * @param {Object} intersection - Intersection information
 * @param {vec3} viewDir - View direction
 * @param {Array} lights - Array of light sources
 * @param {Array} objects - Array of objects in the scene
 * @returns {Array} - RGB color values
 */
function calculatePhongLighting(intersection, viewDir, lights, objects) {
  const { point, normal, object } = intersection;
  const material = object.material;

  // Initialize result color
  let baseColor = [...object.color];

  // Apply checkerboard pattern for planes
  if (object.type === "plane") {
    const squareSize = object.checkerboardSize || 1.0;
    if (isLightSquare(point, squareSize)) {
      // Light square - use the original color
    } else {
      // Dark square - use darker color or specified alternate color
      if (object.altColor) {
        baseColor = [...object.altColor];
      } else {
        // Default to darker version of original color
        baseColor = baseColor.map((c) => c * 0.3);
      }
    }
  }

  // Initialize result color
  const result = [0, 0, 0];

  // Add ambient light
  const ambient = vec3.scale(vec3.create(), baseColor, material.ambient);
  vec3.add(result, result, ambient);

  for (const light of lights) {
    // Calculate light direction and distance
    const lightDir = vec3.create();
    vec3.subtract(lightDir, light.position, point);
    const distanceToLight = vec3.length(lightDir);
    vec3.normalize(lightDir, lightDir);

    // Check for shadows with soft edges
    const shadowFactor = calculateShadowFactor(
      point,
      lightDir,
      objects,
      distanceToLight
    );
    if (shadowFactor <= 0) continue;

    // Calculate diffuse lighting
    const diffuseFactor =
      Math.max(0, vec3.dot(normal, lightDir)) * shadowFactor;
    const diffuse = vec3.scale(
      vec3.create(),
      baseColor,
      diffuseFactor * material.diffuse
    );

    // Calculate specular lighting
    const reflectDir = vec3.create();
    vec3.scale(reflectDir, normal, 2 * vec3.dot(normal, lightDir));
    vec3.subtract(reflectDir, reflectDir, lightDir);
    vec3.normalize(reflectDir, reflectDir);

    const specularFactor =
      Math.pow(Math.max(0, vec3.dot(reflectDir, viewDir)), material.shininess) *
      shadowFactor;
    const specular = vec3.scale(
      vec3.create(),
      [1, 1, 1],
      specularFactor * material.specular
    );

    // Add diffuse and specular components with light intensity
    vec3.scaleAndAdd(result, result, diffuse, light.intensity);
    vec3.scaleAndAdd(result, result, specular, light.intensity);
  }

  return result.map((c) => Math.min(255, Math.max(0, Math.floor(c * 255))));
}

/**
 * Calculate shadow factor with soft edges
 * @param {vec3} point - The point to check
 * @param {vec3} lightDir - Direction to the light
 * @param {Array} objects - Array of objects in the scene
 * @param {number} distanceToLight - Distance to the light source
 * @returns {number} - Shadow factor
 */
function calculateShadowFactor(point, lightDir, objects, distanceToLight) {
  const bias = 0.001;
  const shadowRayOrigin = vec3.create();
  vec3.scaleAndAdd(shadowRayOrigin, point, lightDir, bias);

  const intersection = findClosestIntersection(
    shadowRayOrigin,
    lightDir,
    objects
  );
  if (!intersection) return 1.0;

  if (intersection.distance < distanceToLight) {
    // Calculate soft shadow based on distance
    const shadowDistance = intersection.distance / distanceToLight;
    return Math.max(0, 1 - shadowDistance);
  }

  return 1.0;
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
 * Calculate the intersection point of a ray
 * @param {vec3} origin - Ray origin
 * @param {vec3} direction - Ray direction
 * @param {number} t - Distance along the ray
 * @returns {vec3} - The intersection point
 */
function calculateIntersectionPoint(origin, direction, t) {
  const point = vec3.create();
  const scaledDir = vec3.create();

  vec3.scale(scaledDir, direction, t);
  vec3.add(point, origin, scaledDir);

  return point;
}
