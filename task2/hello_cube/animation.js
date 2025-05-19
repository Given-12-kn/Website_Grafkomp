// js/animation.js
// Tidak perlu import THREE jika hanya memanggil fungsi render

export function startAnimationLoop(scene, camera, renderer, objectsToAnimate) {
  function animate() {
    requestAnimationFrame(animate);

    // Animasi objek (jika ada)
    if (objectsToAnimate && objectsToAnimate.cube) {
      objectsToAnimate.cube.rotation.x += 0.01;
      objectsToAnimate.cube.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
  }

  animate(); // Mulai loop
}
