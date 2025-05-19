// js/objectCreator.js
import * as THREE from "three";
import { createHelloCube } from "./helloCube.js"; // Import fungsi untuk membuat Hello Cube

export function createSceneContent(scene, dummyCameraSource) {
  const objects = {};

  // 1. Axes Helper
  objects.axesHelper = new THREE.AxesHelper(2.5);
  scene.add(objects.axesHelper);

  // 2. Camera Helper (Frustum) untuk dummyCameraSource
  objects.frustumHelper = new THREE.CameraHelper(dummyCameraSource);
  if (objects.frustumHelper.material) {
    objects.frustumHelper.material.dispose();
  }
  objects.frustumHelper.material = new THREE.LineBasicMaterial({
    color: 0x00aa00,
    toneMapped: false,
  });

  // 3. Dua Bola (Sphere)
  const sphereRadius = 0.3;
  const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 16, 16);

  // Bola Biru
  const blueMaterial = new THREE.MeshBasicMaterial({ color: 0x2222ff });
  objects.blueSphere = new THREE.Mesh(sphereGeometry, blueMaterial);
  objects.blueSphere.position.set(-0.5, 0.6, -1.2);
  dummyCameraSource.add(objects.blueSphere); // Tambahkan sebagai child dari dummyCameraSource

  // Bola Merah
  const redMaterial = new THREE.MeshBasicMaterial({ color: 0xaa2222 });
  objects.redSphere = new THREE.Mesh(sphereGeometry, redMaterial);
  objects.redSphere.position.set(0.6, -0.2, -1.5);
  dummyCameraSource.add(objects.redSphere); // Tambahkan sebagai child dari dummyCameraSource

  // 4. Hello Cube
  objects.helloCube = createHelloCube();
  // Posisikan Hello Cube relatif terhadap dummyCameraSource
  // Misalnya, di tengah sedikit ke depan dari frustum
  objects.helloCube.position.set(0, 0.1, -0.5); // Sesuaikan posisi X, Y, Z agar terlihat baik
  dummyCameraSource.add(objects.helloCube); // Tambahkan sebagai child dari dummyCameraSource

  return objects;
}
