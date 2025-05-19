// js/sceneSetup.js
import * as THREE from "three";

// Variabel scene, camera, renderer, lights, helpers dideklarasikan di scope modul
let scene, camera, renderer, ambientLight, directionalLight, dirLightHelper;
// let shadowCameraHelper; // Uncomment untuk debug shadow camera

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xddddf5);
}

function initCamera(aspect) {
  camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 100);
  // Sesuaikan posisi Y awal kamera agar terasa seperti ketinggian mata berdiri
  camera.position.set(0, 1.6, 5); // X=0, Z=5 (mundur sedikit), Y=1.6 (tinggi mata perkiraan)
  // camera.lookAt(0, 1.6, 0); // Arahkan lurus ke depan pada ketinggian yang sama
  // Atau, jika ingin melihat sedikit ke bawah ke objek di tengah:
  camera.lookAt(0, 0.8, 0); // Ini akan membuat kamera sedikit menunduk jika objek di y=0.8
  // Untuk FPS, biasanya lookAt diatur oleh PointerLockControls
  // Jadi, posisi awal dan rotasi awal (jika perlu) adalah yang utama.
  // PointerLockControls akan mengambil alih rotasi setelah diaktifkan.
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
  ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
  directionalLight.position.set(5, 8, 6);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 30;
  const shadowCamSize = 8;
  directionalLight.shadow.camera.left = -shadowCamSize;
  directionalLight.shadow.camera.right = shadowCamSize;
  directionalLight.shadow.camera.top = shadowCamSize;
  directionalLight.shadow.camera.bottom = -shadowCamSize;
  directionalLight.shadow.bias = -0.0005;

  scene.add(directionalLight);

  dirLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    0.5,
    0xffff00
  );
  scene.add(dirLightHelper);

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
