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
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

function initLights() {
  // Cahaya ambient, sedikit lebih gelap agar highlight lebih menonjol
  ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Directional light untuk specular highlights dan bayangan
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Intensitas utama
  directionalLight.position.set(5, 10, 7.5);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  const shadowCamSize = 10;
  directionalLight.shadow.camera.left = -shadowCamSize;
  directionalLight.shadow.camera.right = shadowCamSize;
  directionalLight.shadow.camera.top = shadowCamSize;
  directionalLight.shadow.camera.bottom = -shadowCamSize;

  scene.add(directionalLight);

  dirLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    1,
    0xffff00
  );
  scene.add(dirLightHelper);
  // const shadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
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
