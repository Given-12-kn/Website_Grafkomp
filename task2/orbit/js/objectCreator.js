// js/objectCreator.js
import * as THREE from "three";

export function createShowcaseObjects(uvTexture) {
  const mainGroup = new THREE.Group();

  // --- Material Menggunakan MeshPhongMaterial ---
  const objectPhongMaterial = new THREE.MeshPhongMaterial({
    map: uvTexture.clone(), // Tekstur dasar
    specular: 0x555555, // Warna kilau (abu-abu terang untuk kilau putih)
    shininess: 50, // Seberapa tajam/fokus kilauannya (nilai lebih tinggi = lebih tajam)
    // emissive: 0x000000,  // Jika ingin ada bagian yang bercahaya sendiri tanpa dipengaruhi light
    // emissiveMap: someTexture, // Tekstur untuk emissive
    // emissiveIntensity: 1
  });

  // --- Plane (Lantai) ---
  // Plane bisa tetap menggunakan MeshStandardMaterial jika ingin tampilan berbeda,
  // atau bisa juga diubah ke MeshPhongMaterial.
  // Untuk konsistensi, kita ubah juga, tapi dengan shininess lebih rendah agar tidak terlalu berkilau.
  const planeGeometry = new THREE.PlaneGeometry(12, 12);
  const planeTexture = uvTexture.clone();
  planeTexture.needsUpdate = true;
  planeTexture.wrapS = THREE.ClampToEdgeWrapping;
  planeTexture.wrapT = THREE.ClampToEdgeWrapping;
  planeTexture.repeat.set(1, 1);

  const planePhongMaterial = new THREE.MeshPhongMaterial({
    map: planeTexture,
    specular: 0x111111, // Kilau sangat redup untuk plane
    shininess: 10,
  });
  const plane = new THREE.Mesh(planeGeometry, planePhongMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.receiveShadow = true;
  mainGroup.add(plane);

  // --- Sphere (Pusat Orbit) ---
  const sphereRadius = 1;
  const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
  const sphere = new THREE.Mesh(sphereGeometry, objectPhongMaterial); // Gunakan objectPhongMaterial
  sphere.position.set(0, sphereRadius + 0.01, 0);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  mainGroup.add(sphere);

  // --- Orbit Group ---
  const orbitGroup = new THREE.Group();
  orbitGroup.name = "orbitGroup";
  orbitGroup.position.copy(sphere.position);
  mainGroup.add(orbitGroup);

  // --- Objek yang Mengorbit ---
  const orbitRadius = 3.0;
  const orbitingObjectYOffset = -sphereRadius;

  // Cube
  const cubeSize = 1.5;
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cube = new THREE.Mesh(cubeGeometry, objectPhongMaterial); // Gunakan objectPhongMaterial
  cube.position.set(orbitRadius, cubeSize / 2 + orbitingObjectYOffset, 0);
  cube.castShadow = true;
  cube.receiveShadow = true;
  orbitGroup.add(cube);

  // Pyramid
  const pyramidHeight = 2;
  const pyramidBaseRadius = 1;
  const pyramidGeometry = new THREE.ConeGeometry(
    pyramidBaseRadius,
    pyramidHeight,
    4
  );
  const pyramid = new THREE.Mesh(pyramidGeometry, objectPhongMaterial); // Gunakan objectPhongMaterial
  pyramid.position.set(
    -orbitRadius,
    pyramidHeight / 2 + orbitingObjectYOffset,
    0
  );
  pyramid.rotation.y = Math.PI / 4;
  pyramid.castShadow = true;
  pyramid.receiveShadow = true;
  orbitGroup.add(pyramid);

  return {
    mainGroup,
    orbitGroup,
  };
}
