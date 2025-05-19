// js/main.js
import { setupThreeJS } from "./sceneSetup.js";
import { createCube } from "./cube.js";
import { startAnimationLoop } from "./animation.js";

// Dapatkan elemen canvas dari HTML
const canvas = document.getElementById("webgl-canvas");

if (!canvas) {
  console.error("Canvas element 'webgl-canvas' not found!");
} else {
  // 1. Setup dasar Three.js (scene, camera, renderer)
  const { scene, camera, renderer } = setupThreeJS(canvas);

  // 2. Buat objek kubus
  const cube = createCube();

  // 3. Tambahkan kubus ke scene
  scene.add(cube);

  // 4. Atur posisi kamera jika belum di sceneSetup atau ingin override
  // camera.position.z = 5; // Sudah diatur di sceneSetup.js

  // 5. Mulai loop animasi
  // Kita bisa meneruskan objek yang ingin dianimasikan
  const animatedObjects = {
    cube: cube,
  };
  startAnimationLoop(scene, camera, renderer, animatedObjects);

  console.log("Three.js Hello Cube initialized!");
}
