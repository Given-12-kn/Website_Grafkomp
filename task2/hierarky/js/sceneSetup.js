// js/sceneSetup.js
import * as THREE from "three";

let scene, renderer;
const cameras = {};

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);
}

function initCameras(aspect) {
  cameras.mainPerspective = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
  cameras.mainPerspective.position.set(3.5, 2.5, 6);
  cameras.mainPerspective.lookAt(0, 0.5, 0);
  cameras.mainPerspective.name = "Perspektif Utama";

  const orthoSize = 8;
  cameras.mainOrthographic = new THREE.OrthographicCamera(
    (-orthoSize * aspect) / 2,
    (orthoSize * aspect) / 2,
    orthoSize / 2,
    -orthoSize / 2,
    0.1,
    1000
  );
  cameras.mainOrthographic.position.set(0, 7, 0);
  cameras.mainOrthographic.lookAt(0, 0, 0);
  cameras.mainOrthographic.name = "Ortografik Atas";

  cameras.dummyForHelper = new THREE.PerspectiveCamera(70, 1.0, 0.5, 3.5);
  cameras.dummyForHelper.position.set(0, 0.5, 0);
  cameras.dummyForHelper.name = "Dummy (Helper Source)";
  scene.add(cameras.dummyForHelper);
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
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (cameras.mainPerspective) {
      cameras.mainPerspective.aspect = aspect;
      cameras.mainPerspective.updateProjectionMatrix();
    }
    if (cameras.mainOrthographic) {
      const orthoSize = 8;
      cameras.mainOrthographic.left = (-orthoSize * aspect) / 2;
      cameras.mainOrthographic.right = (orthoSize * aspect) / 2;
      cameras.mainOrthographic.top = orthoSize / 2;
      cameras.mainOrthographic.bottom = -orthoSize / 2;
      cameras.mainOrthographic.updateProjectionMatrix();
    }
  });
}

export function setupThreeJS(canvasElement) {
  initScene();
  initCameras(window.innerWidth / window.innerHeight);
  initRenderer(canvasElement);
  handleResize();
  return { scene, cameras, renderer };
}
