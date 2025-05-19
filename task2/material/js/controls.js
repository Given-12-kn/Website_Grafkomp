// js/controls.js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initOrbitControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1; // Increased for smoother movement
  controls.rotateSpeed = 0.8; // Slightly slower rotation for better control
  controls.zoomSpeed = 1.2; // Slightly faster zoom
  controls.screenSpacePanning = true; // Changed to true for more intuitive panning
  controls.minDistance = 2; // Closer minimum zoom
  controls.maxDistance = 30; // Reduced maximum zoom for better focus
  controls.minPolarAngle = 0; // Allow viewing from below
  controls.maxPolarAngle = Math.PI; // Allow full vertical rotation
  controls.target.set(0, 1.5, 0); // Adjusted target point slightly higher
  controls.update();
  return controls;
}
