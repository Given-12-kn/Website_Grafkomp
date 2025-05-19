// js/sceneSetup.js
import * as THREE from "three";

let scene, camera, renderer, ambientLight, directionalLight, dirLightHelper;

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeff); // Warna latar belakang terang
}

function initCamera(aspect) {
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
  camera.position.set(5, 5, 7); // Posisikan kamera agar melihat objek
  camera.lookAt(0, 1, 0); // Arahkan ke tengah scene (sekitar y=1)
}

function initRenderer(canvasElement) {
  renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = false; // Pastikan bayangan dinonaktifkan
  // renderer.outputColorSpace = THREE.SRGBColorSpace; // Jika tekstur & warna terlihat pudar
}

function initLights() {
  ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Cahaya ambient lembut
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 1.2); // Cahaya utama
  directionalLight.position.set(5, 10, 7.5); // Atur posisi cahaya
  // directionalLight.castShadow = false; // Tidak perlu shadow
  scene.add(directionalLight);

  // Helper untuk melihat arah directional light (seperti gizmo kuning di gambar Anda)
  dirLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    1,
    0xffff00
  ); // Kuning
  scene.add(dirLightHelper);
}

function handleResize() {
  window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });
}

export function setupThreeJS(canvasElement) {
  initScene();
  initCamera(window.innerWidth / window.innerHeight);
  initRenderer(canvasElement);
  initLights();
  handleResize();

  return { scene, camera, renderer };
}
