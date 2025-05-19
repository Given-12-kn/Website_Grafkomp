// js/main.js
import { setupThreeJS } from "./sceneSetup.js";
import { createSceneContent } from "./objectCreator.js";
import { initCameraManager } from "./cameraManager.js";
import { startAnimationLoop } from "./animation.js";

const canvas = document.getElementById("webgl-canvas");

if (!canvas) {
  console.error("Canvas element 'webgl-canvas' not found!");
} else {
  const { scene, cameras, renderer } = setupThreeJS(canvas);
  const sceneObjects = createSceneContent(scene, cameras.dummyForHelper); // sceneObjects sekarang berisi helloCube juga
  const cameraManager = initCameraManager(
    cameras,
    "toggle-camera-btn",
    "current-camera-info"
  );

  if (!cameraManager) {
    console.error("Gagal menginisialisasi Camera Manager.");
  } else {
    const objectsToAnimate = {
      dummyCamera: cameras.dummyForHelper,
    };
    startAnimationLoop(
      scene,
      cameraManager.getActiveCamera,
      renderer,
      objectsToAnimate
    );
    console.log("Animated Scene Hierarchy with Hello Cube Initialized!");
  }
}
