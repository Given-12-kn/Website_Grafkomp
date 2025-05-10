// Shadow calculations

/**
 * Check if a point is in shadow from a light source
 * @param {vec3} point - The point to check
 * @param {vec3} lightDir - Direction to the light
 * @param {Array} objects - Array of objects in the scene
 * @param {number} distanceToLight - Distance to the light source
 * @returns {number} - Shadow factor (0 = full shadow, 1 = no shadow)
 */
function calculateShadowFactor(point, lightDir, objects, distanceToLight) {
    const bias = 0.001;
    const shadowRayOrigin = vec3.create();
    vec3.scaleAndAdd(shadowRayOrigin, point, lightDir, bias);
    
    const intersection = findClosestIntersection(shadowRayOrigin, lightDir, objects);
    if (!intersection) return 1.0;
    
    if (intersection.distance < distanceToLight) {
        // Calculate soft shadow based on distance
        const shadowDistance = intersection.distance / distanceToLight;
        return Math.max(0, 1 - shadowDistance * 0.8); // Softer shadow transition
    }
    
    return 1.0;
}

/**
 * Calculate area light shadows
 * @param {vec3} point - Surface point
 * @param {Object} light - Light source
 * @param {Array} objects - Scene objects
 * @returns {number} - Shadow factor
 */
function calculateAreaLightShadow(point, light, objects) {
    const samples = 4; // Number of samples per dimension
    const lightSize = 0.5; // Size of the area light
    let shadowFactor = 0;

    for (let x = 0; x < samples; x++) {
        for (let y = 0; y < samples; y++) {
            // Calculate sample position on light
            const offsetX = (x / samples - 0.5) * lightSize;
            const offsetY = (y / samples - 0.5) * lightSize;
            
            const samplePos = vec3.create();
            vec3.copy(samplePos, light.position);
            samplePos[0] += offsetX;
            samplePos[1] += offsetY;

            // Calculate direction and distance to light sample
            const lightDir = vec3.create();
            vec3.subtract(lightDir, samplePos, point);
            const distanceToLight = vec3.length(lightDir);
            vec3.normalize(lightDir, lightDir);

            // Add shadow contribution from this sample
            shadowFactor += calculateShadowFactor(point, lightDir, objects, distanceToLight);
        }
    }

    // Average the shadow contributions
    return shadowFactor / (samples * samples);
}

/**
 * Calculate penumbra effect
 * @param {Object} intersection - Intersection information
 * @param {Object} light - Light source
 * @param {Array} objects - Scene objects
 * @returns {number} - Penumbra factor
 */
function calculatePenumbra(intersection, light, objects) {
    const { point, normal } = intersection;
    
    // Calculate basic shadow
    const lightDir = vec3.create();
    vec3.subtract(lightDir, light.position, point);
    const distanceToLight = vec3.length(lightDir);
    vec3.normalize(lightDir, lightDir);

    const baseShadow = calculateShadowFactor(point, lightDir, objects, distanceToLight);
    
    // If point is fully lit or in complete shadow, return early
    if (baseShadow === 1.0 || baseShadow === 0.0) return baseShadow;

    // Calculate area light shadow for soft edges
    const areaShadow = calculateAreaLightShadow(point, light, objects);
    
    // Mix based on distance and angle
    const normalDot = Math.abs(vec3.dot(normal, lightDir));
    const distanceFactor = Math.min(1.0, distanceToLight / 10.0);
    
    return Math.min(1.0, baseShadow * 0.7 + areaShadow * 0.3 * normalDot * (1 - distanceFactor));
} 