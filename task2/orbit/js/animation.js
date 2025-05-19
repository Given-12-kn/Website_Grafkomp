// js/animation.js
export function startAnimationLoop(
  scene,
  camera,
  renderer,
  controls,
  groupToOrbit
) {
  function animate() {
    requestAnimationFrame(animate);

    if (controls) {
      controls.update();
    }

    // Animasikan rotasi grup orbit
    if (groupToOrbit) {
      groupToOrbit.rotation.y += 0.005; // Sesuaikan kecepatan orbit di sini
    }

    renderer.render(scene, camera);
  }
  animate();
}
