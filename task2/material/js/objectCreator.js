// js/objectCreator.js
import * as THREE from "three";

export function createShowcaseObjects(uvTexture) {
  const objectsGroup = new THREE.Group();

  // Material umum untuk objek selain plane
  const objectMaterial = new THREE.MeshStandardMaterial({
    map: uvTexture.clone(), // Gunakan clone tekstur agar setting wrapping tidak mempengaruhi plane
    roughness: 0.6,
    metalness: 0.2,
  });
  // Penting: Untuk objek seperti cube, sphere, pyramid, kita biasanya ingin
  // tekstur default (membentang di permukaan tanpa repeat eksplisit dari sini,
  // kecuali UV map-nya memang dirancang untuk tiling).
  // Jika kita memodifikasi uvTexture asli, itu akan mempengaruhi semua objek.
  // Jadi kita clone untuk plane, atau buat instance TextureLoader baru untuk plane.
  // Atau, lebih sederhana, atur wrapping di tekstur yang spesifik untuk plane.

  // 1. Plane (Lantai)
  const planeGeometry = new THREE.PlaneGeometry(10, 10); // Tidak perlu segmentasi tinggi jika tekstur tidak diulang

  // Buat instance tekstur baru atau clone untuk plane agar bisa di-setting berbeda
  const planeTexture = uvTexture.clone(); // Clone tekstur asli
  planeTexture.needsUpdate = true; // Penting setelah clone agar THREE.js tahu

  // Atur agar tekstur TIDAK berulang pada plane
  planeTexture.wrapS = THREE.ClampToEdgeWrapping;
  planeTexture.wrapT = THREE.ClampToEdgeWrapping;

  // Jika Anda ingin tekstur membentang pas satu kali di plane, pastikan repeat adalah 1,1
  // Jika sebelumnya ada .repeat.set(repeats, repeats), hapus atau set ke (1,1)
  planeTexture.repeat.set(1, 1); // Tekstur membentang satu kali

  const planeMaterial = new THREE.MeshStandardMaterial({
    map: planeTexture, // Gunakan tekstur yang sudah di-setting untuk plane
    roughness: 0.8,
    metalness: 0.1,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  objectsGroup.add(plane);

  // 2. Cube
  // Gunakan material objek umum yang tidak memiliki setting wrapping khusus
  const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const cube = new THREE.Mesh(cubeGeometry, objectMaterial); // Menggunakan objectMaterial
  cube.position.set(-2, 1.5 / 2, -0.5);
  objectsGroup.add(cube);

  // 3. Sphere
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphere = new THREE.Mesh(sphereGeometry, objectMaterial); // Menggunakan objectMaterial
  sphere.position.set(0, 1, 0);
  objectsGroup.add(sphere);

  // 4. Pyramid (Cone dengan 4 sisi)
  const pyramidHeight = 2;
  const pyramidRadius = 1;
  const pyramidGeometry = new THREE.ConeGeometry(
    pyramidRadius,
    pyramidHeight,
    4
  );
  const pyramid = new THREE.Mesh(pyramidGeometry, objectMaterial); // Menggunakan objectMaterial
  pyramid.position.set(2.2, pyramidHeight / 2, -0.2);
  objectsGroup.add(pyramid);

  return objectsGroup;
}
