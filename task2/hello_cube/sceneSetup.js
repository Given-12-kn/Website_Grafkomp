// js/sceneSetup.js
import * as THREE from "three";

let scene, camera, renderer;

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x282c34); // Warna latar belakang sedikit gelap
}

function initCamera() {
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 5; // Mundurkan kamera sedikit agar kubus terlihat
}

function initRenderer(canvasElement) {
  renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function handleResize() {
  window.addEventListener("resize", () => {
    // Update ukuran renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update aspek rasio kamera
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

export function setupThreeJS(canvasElement) {
  initScene();
  initCamera();
  initRenderer(canvasElement);
  handleResize(); // Setup event listener untuk resize

  // Kembalikan objek yang bisa diakses
  return { scene, camera, renderer };
}
