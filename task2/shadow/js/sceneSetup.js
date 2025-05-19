// js/sceneSetup.js
import * as THREE from "three";

let scene, camera, renderer, ambientLight, directionalLight, dirLightHelper;

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeff);
}

function initCamera(aspect) {
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 100);
  camera.position.set(5, 5, 7);
  camera.lookAt(0, 1, 0);
}

function initRenderer(canvasElement) {
  renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // AKTIFKAN SHADOW MAP
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Tipe shadow map untuk bayangan lebih lembut (opsional)
  // renderer.outputColorSpace = THREE.SRGBColorSpace; // Jika diperlukan
}

function initLights() {
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Kurangi intensitas ambient sedikit
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Intensitas directional
  directionalLight.position.set(5, 10, 7.5);

  // AKTIFKAN LIGHT UNTUK CAST SHADOW
  directionalLight.castShadow = true;

  // KONFIGURASI SHADOW MAP UNTUK LIGHT (PENTING UNTUK KUALITAS & PERFORMA)
  directionalLight.shadow.mapSize.width = 2048; // Resolusi shadow map (lebih tinggi = lebih detail, lebih berat)
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5; // Jarak near plane untuk kamera shadow
  directionalLight.shadow.camera.far = 50; // Jarak far plane untuk kamera shadow
  // Atur ukuran frustum kamera shadow agar pas dengan area scene Anda
  const shadowCamSize = 10;
  directionalLight.shadow.camera.left = -shadowCamSize;
  directionalLight.shadow.camera.right = shadowCamSize;
  directionalLight.shadow.camera.top = shadowCamSize;
  directionalLight.shadow.camera.bottom = -shadowCamSize;
  // directionalLight.shadow.bias = -0.0001; // Untuk mengatasi shadow acne, sesuaikan jika perlu

  scene.add(directionalLight);

  // Helper untuk melihat arah directional light dan frustum shadow camera (opsional)
  dirLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    1,
    0xffff00
  );
  scene.add(dirLightHelper);
  // const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  // scene.add(shadowCameraHelper); // Untuk debug frustum shadow camera
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
