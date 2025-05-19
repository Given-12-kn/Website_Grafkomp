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
      const { mainGroup, orbitGroup } = createShowcaseObjects(uvTexture);
      scene.add(mainGroup);

      startAnimationLoop(scene, camera, renderer, controls, orbitGroup);

      console.log(
        "UV Texture Showcase with Cube/Pyramid Orbiting Sphere Initialized!"
      );
    })
    .catch((error) => {
      console.error("Gagal memuat scene karena tekstur:", error);
    });
}
