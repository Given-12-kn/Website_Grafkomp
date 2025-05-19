// js/sceneSetup.js
import * as THREE from "three";

// Variabel scene, camera, renderer, lights, helpers dideklarasikan di scope modul
let scene, camera, renderer, ambientLight, directionalLight, dirLightHelper;
// let shadowCameraHelper; // Uncomment untuk debug shadow camera

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xddddf5); // Warna latar sedikit keunguan/biru muda
}

function initCamera(aspect) {
  camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 100); // FOV sedikit diubah
  camera.position.set(4.5, 3.5, 6.5); // Posisi kamera
  camera.lookAt(0, 0.8, 0); // Arahkan ke area objek
}

function initRenderer(canvasElement) {
  renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

function initLights() {
  // AMBIENT LIGHT: Memberi sedikit cahaya dasar ke seluruh scene.
  // Jangan terlalu terang agar emissive dan specular bisa menonjol.
  ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  // DIRECTIONAL LIGHT: Sumber cahaya utama untuk bayangan dan specular highlights.
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
  directionalLight.position.set(5, 8, 6); // Posisi bisa disesuaikan
  directionalLight.castShadow = true;

  // Pengaturan kualitas bayangan
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 30; // Sesuaikan far plane shadow cam
  const shadowCamSize = 8; // Sesuaikan ukuran area shadow cam
  directionalLight.shadow.camera.left = -shadowCamSize;
  directionalLight.shadow.camera.right = shadowCamSize;
  directionalLight.shadow.camera.top = shadowCamSize;
  directionalLight.shadow.camera.bottom = -shadowCamSize;
  directionalLight.shadow.bias = -0.0005; // Coba nilai ini untuk shadow acne

  scene.add(directionalLight);

  // Helper untuk Directional Light (opsional)
  dirLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.5,
    0xffff00
  );
  scene.add(dirLightHelper);

  // Helper untuk Shadow Camera (sangat berguna untuk debugging)
  // shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  // scene.add(shadowCameraHelper);
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
