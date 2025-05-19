// js/animation.js
export function startAnimationLoop(
  scene,
  getActiveCameraFunc,
  renderer,
  objectsToAnimate
) {
  function animate() {
    requestAnimationFrame(animate);

    const activeCamera = getActiveCameraFunc();
    if (!activeCamera) return;

    if (objectsToAnimate && objectsToAnimate.dummyCamera) {
      objectsToAnimate.dummyCamera.rotation.y += 0.008;
      objectsToAnimate.dummyCamera.rotation.x += 0.003;
    }

    renderer.render(scene, activeCamera);
  }
  animate();
}
