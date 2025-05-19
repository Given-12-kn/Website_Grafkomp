// js/main.js
import { setupThreeJS } from "./sceneSetup.js";
import { loadUVTexture } from "./textureLoader.js";
import { createShowcaseObjects } from "./objectCreator.js";
import { initOrbitControls } from "./controls.js";
import { startAnimationLoop } from "./animation.js";

const canvas = document.getElementById("webgl-canvas");

if (!canvas) {
  console.error("Canvas element 'webgl-canvas' not found!");
} else {
  const { scene, camera, renderer } = setupThreeJS(canvas);
  const controls = initOrbitControls(camera, renderer.domElement);

  loadUVTexture("textures/uv_grid_opengl.jpg")
    .then((uvTexture) => {
      // createShowcaseObjects sekarang hanya mengembalikan satu grup berisi semua objek
      const showcaseObjectsGroup = createShowcaseObjects(uvTexture);
      scene.add(showcaseObjectsGroup); // Tambahkan grup objek ke scene

      // Mulai loop animasi, tidak perlu meneruskan grup objek untuk rotasi
      startAnimationLoop(scene, camera, renderer, controls);

      console.log(
        "UV Texture Showcase with Static Objects (OrbitControls) Initialized!"
      );
    })
    .catch((error) => {
      console.error("Gagal memuat scene karena tekstur:", error);
    });
}
