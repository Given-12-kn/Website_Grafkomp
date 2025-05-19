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
  // 1. Setup dasar Three.js
  const { scene, camera, renderer } = setupThreeJS(canvas);

  // 2. Inisialisasi OrbitControls untuk rotasi scene
  const controls = initOrbitControls(camera, renderer.domElement);

  // 3. Load tekstur UV
  // js/main.js
  loadUVTexture("textures/uv_grid_opengl.jpg")
    .then((uvTexture) => {
      // 4. Setelah tekstur dimuat, buat objek-objek showcase
      const showcaseGroup = createShowcaseObjects(uvTexture);
      scene.add(showcaseGroup);

      // 5. Mulai loop animasi
      // Jika ingin grup objek berputar otomatis, teruskan showcaseGroup
      startAnimationLoop(
        scene,
        camera,
        renderer,
        controls /*, showcaseGroup */
      );

      console.log("UV Texture Showcase Initialized!");
    })
    .catch((error) => {
      console.error("Gagal memuat scene karena tekstur:", error);
    });
}
