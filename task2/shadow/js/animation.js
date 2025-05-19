// js/animation.js
export function startAnimationLoop(
  scene,
  camera,
  renderer,
  controls /*, objectsToRotate */
) {
  function animate() {
    requestAnimationFrame(animate);

    if (controls) {
      controls.update(); // Penting jika enableDamping = true
    }

    // Jika ingin objek berputar sendiri, uncomment ini:
    // if (objectsToRotate) {
    //     objectsToRotate.rotation.y += 0.005;
    // }

    renderer.render(scene, camera);
  }
  animate();
}
