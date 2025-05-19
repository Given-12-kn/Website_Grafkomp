// js/main.js
import { setupThreeJS } from "./sceneSetup.js";
import { loadUVTexture } from "./textureLoader.js";
import { createShowcaseObjects } from "./objectCreator.js";
import { initFPSControls } from "./controls.js"; // Ganti import
import { startAnimationLoop } from "./animation.js";

const canvas = document.getElementById("webgl-canvas");
const blocker = document.getElementById("blocker");
const instructions = document.getElementById("instructions");

if (!canvas || !blocker || !instructions) {
  console.error(
    "Required HTML elements not found (canvas, blocker, or instructions)!"
  );
} else {
  const { scene, camera, renderer } = setupThreeJS(canvas);

  // Inisialisasi FPS Controls
  const fpsControls = initFPSControls(
    camera,
    renderer.domElement,
    blocker,
    instructions
  );
  scene.add(fpsControls.getObject()); // PointerLockControls mengembalikan objek yang perlu ditambahkan ke scene

  loadUVTexture("textures/uv_grid_opengl.jpg")
    .then((uvTexture) => {
      const showcaseObjectsGroup = createShowcaseObjects(uvTexture);
      scene.add(showcaseObjectsGroup);

      // Loop animasi tidak lagi menerima 'controls' sebagai argumen eksplisit
      // karena update kamera dihandle oleh fungsi dari modul controls.js
      startAnimationLoop(scene, camera, renderer);

      console.log("FPS Controls Showcase Initialized!");
    })
    .catch((error) => {
      console.error("Gagal memuat scene karena tekstur:", error);
    });
}
