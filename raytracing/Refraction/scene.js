// Scene setup with reflective floor and multiple spheres
const scene = {
  objects: [
    // Floor (reflective plane)
    {
      type: "plane",
      point: [0, -2, 0],  // Position of the plane
      normal: [0, 1, 0],  // Normal pointing upward
      color: [0.8, 0.8, 0.8],  // Light gray color
      altColor: [0.3, 0.3, 0.3],  // Darker color for checkerboard
      checkerboardSize: 2.0,  // Size of checkerboard squares
      material: {
        ambient: 0.2,
        diffuse: 0.6,
        specular: 0.4,
        shininess: 50,
        reflectivity: 0.4  // Add reflectivity (0.0 to 1.0)
      }
    },
    
    // Main sphere (red)
    {
      type: "sphere",
      center: [0, 0, 0],
      radius: 1.0,
      color: [1.0, 0.2, 0.2], // Red color
      material: {
        ambient: 0.2,
        diffuse: 0.7,
        specular: 0.5,
        shininess: 32,
        reflectivity: 0.3
      }
    },

    // Second sphere (blue) - will cast shadow on red sphere
    {
      type: "sphere",
      center: [2, 1, -2],
      radius: 1.2,
      color: [0.2, 0.2, 1.0], // Blue color
      material: {
        ambient: 0.2,
        diffuse: 0.7,
        specular: 0.5,
        shininess: 32,
        reflectivity: 0.3
      }
    },

    // Third sphere (green) - smaller sphere
    {
      type: "sphere",
      center: [-1.5, -1, -1],
      radius: 0.7,
      color: [0.2, 1.0, 0.2], // Green color
      material: {
        ambient: 0.2,
        diffuse: 0.7,
        specular: 0.5,
        shininess: 32,
        reflectivity: 0.3
      }
    }
  ],
  
  lights: [
    // Main light source
    {
      position: [5, 10, 5],
      intensity: 0.7
    },
    // Secondary light source for softer shadows
    {
      position: [-5, 8, -5],
      intensity: 0.3
    }
  ]
};

// Render function with reflection and shadows
function render(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.createImageData(width, height);
  
  // Camera setup
  const rayOrigin = vec3.fromValues(0, 2, 8); // Position camera slightly above and back
  
  // For each pixel in the canvas
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Get ray direction for this pixel
      const rayDirection = getRayDirection(x, y, width, height);
      
      // Calculate color with reflection and shadows (max depth = 5)
      const color = calculateReflection(
        rayOrigin,
        rayDirection,
        scene.objects,
        scene.lights,
        0,  // Initial depth
        5,  // Maximum recursion depth
        1.0, // Initial IOR
        false // Not inside any object
      );
      
      // Set pixel color
      const pixelIndex = (y * width + x) * 4;
      imageData.data[pixelIndex] = color[0];     // R
      imageData.data[pixelIndex + 1] = color[1]; // G
      imageData.data[pixelIndex + 2] = color[2]; // B
      imageData.data[pixelIndex + 3] = 255;      // A
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
} 