// js/animation.js
import { updateCameraPosition } from "./controls.js"; // Import fungsi update posisi

let prevTime = performance.now();

export function startAnimationLoop(
  scene,
  camera,
  renderer /*, controls - tidak dipakai lagi dari argumen */
) {
  function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000; // Delta time dalam detik

    // Update posisi kamera menggunakan logika FPS
    updateCameraPosition(camera, delta);

    // Tidak ada rotasi objek otomatis
    // if (objectsToAnimate) { ... }

    renderer.render(scene, camera);
    prevTime = time;
  }
  animate();
}
