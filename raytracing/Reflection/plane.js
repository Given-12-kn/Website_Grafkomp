// Plane calculations

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
 * Calculate plane color with lighting
 * @param {Object} intersection - Intersection information
 * @param {vec3} viewDir - View direction
 * @param {Array} objects - Scene objects
 * @param {Array} lights - Scene lights
 * @returns {Array} - RGB color values
 */
function calculatePlaneColor(intersection, viewDir, objects, lights) {
    return calculatePhongLighting(intersection, viewDir, lights, objects);
}

/**
 * Calculate floor grid pattern
 * @param {vec3} point - Intersection point
 * @returns {Array} - RGB color values
 */
function calculateFloorPattern(point) {
    const gridSize = 1.0;
    const x = Math.floor(Math.abs(point[0]) / gridSize);
    const z = Math.floor(Math.abs(point[2]) / gridSize);
    const isEven = (x + z) % 2 === 0;
    return isEven ? [0.3, 0.3, 0.3] : [0.4, 0.4, 0.4];
} 