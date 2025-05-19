// js/animation.js
export function startAnimationLoop(
  scene,
  camera,
  renderer,
  controls /*, groupToOrbit - tidak dipakai lagi */
) {
  function animate() {
    requestAnimationFrame(animate);

    if (controls) {
      controls.update(); // Hanya update OrbitControls
    }

    // Tidak ada rotasi objek otomatis
    // if (groupToOrbit) {
    //     groupToOrbit.rotation.y += 0.005;
    // }

    renderer.render(scene, camera);
  }
  animate();
}
