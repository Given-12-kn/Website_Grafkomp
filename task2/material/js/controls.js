// js/controls.js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function initOrbitControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true; // Efek pelambatan yang halus
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false; // Panning relatif terhadap plane
  controls.minDistance = 3; // Jarak zoom minimal
  controls.maxDistance = 50; // Jarak zoom maksimal
  // controls.maxPolarAngle = Math.PI / 2; // Batasi rotasi vertikal (agar tidak bisa lihat dari bawah tanah)
  controls.target.set(0, 1, 0); // Target orbit controls, sekitar tengah objek
  controls.update();
  return controls;
}
