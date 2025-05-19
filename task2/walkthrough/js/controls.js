// js/controls.js
import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

let controls;
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
// let canJump = false; // Variabel lompat, fungsionalitasnya masih dasar
let isShiftPressed = false;

const movementSpeed = 8.0;
const sprintMultiplier = 1.8;
const eyeHeight = 1.6; // Definisikan tinggi mata di sini agar konsisten

export function initFPSControls(camera, domElement, blocker, instructions) {
  controls = new PointerLockControls(camera, domElement);

  instructions.addEventListener("click", () => {
    controls.lock();
  });

  controls.addEventListener("lock", () => {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });

  controls.addEventListener("unlock", () => {
    blocker.style.display = "flex";
    instructions.style.display = "";
  });

  const onKeyDown = (event) => {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;
      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;
      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;
      // case 'Space': // Logika lompat masih dasar
      //     if (canJump) velocity.y += 350 * 0.2; // Sesuaikan kekuatan lompat
      //     canJump = false;
      //     break;
      case "ShiftLeft":
      case "ShiftRight":
        isShiftPressed = true;
        break;
    }
  };

  const onKeyUp = (event) => {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;
      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;
      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        isShiftPressed = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Setel posisi awal kamera yang sebenarnya setelah controls dibuat
  // karena PointerLockControls memanipulasi object yang di-pass (camera)
  camera.position.y = eyeHeight;

  return controls;
}

export function updateCameraPosition(camera, delta) {
  if (!controls || !controls.isLocked) {
    velocity.x = 0;
    velocity.z = 0;
    return;
  }

  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  // Logika gravitasi sederhana (jika lompat diaktifkan)
  // velocity.y -= 9.8 * 5.0 * delta; // 9.8 m/s^2, 5.0 adalah massa/skala sembarang

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize();

  const currentSpeed = isShiftPressed
    ? movementSpeed * sprintMultiplier
    : movementSpeed;

  if (moveForward || moveBackward)
    velocity.z -= direction.z * currentSpeed * delta * 20;
  if (moveLeft || moveRight)
    velocity.x -= direction.x * currentSpeed * delta * 20;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);

  // Mengaplikasikan pergerakan vertikal (jika ada gravitasi/lompat)
  // camera.position.y += (velocity.y * delta);

  // Batasi kamera agar tidak masuk ke bawah ketinggian mata yang ditentukan
  if (camera.position.y < eyeHeight) {
    // velocity.y = 0; // Hentikan pergerakan vertikal ke bawah
    camera.position.y = eyeHeight; // Set ke ketinggian mata
    // canJump = true; // Bisa lompat lagi jika menyentuh 'tanah' (ketinggian mata)
  }
}
