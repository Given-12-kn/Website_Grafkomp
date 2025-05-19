// js/objectCreator.js
import * as THREE from "three";

export function createShowcaseObjects(uvTexture) {
  const mainGroup = new THREE.Group(); // Grup utama untuk semua elemen statis dan dinamis

  // --- Material Menggunakan MeshPhongMaterial ---
  const objectPhongMaterial = new THREE.MeshPhongMaterial({
    map: uvTexture.clone(),
    specular: 0x555555,
    shininess: 50,
  });

  // --- Plane (Lantai) ---
  const planeGeometry = new THREE.PlaneGeometry(12, 12);
  const planeTexture = uvTexture.clone();
  planeTexture.needsUpdate = true;
  planeTexture.wrapS = THREE.ClampToEdgeWrapping;
  planeTexture.wrapT = THREE.ClampToEdgeWrapping;
  planeTexture.repeat.set(1, 1);

  const planePhongMaterial = new THREE.MeshPhongMaterial({
    map: planeTexture,
    specular: 0x111111,
    shininess: 10,
  });
  const plane = new THREE.Mesh(planeGeometry, planePhongMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.receiveShadow = true;
  mainGroup.add(plane);

  // --- Sphere (Pusat Orbit) ---
  const sphereRadius = 1; // Radius geometri bola
  const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
  const sphere = new THREE.Mesh(sphereGeometry, objectPhongMaterial);
  sphere.position.set(0, sphereRadius + 0.01, 0); // Posisikan di atas plane
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  mainGroup.add(sphere); // Tambahkan sphere ke grup utama

  // --- Orbit Group (Pivot untuk Cube dan Pyramid, berpusat di Sphere) ---
  const orbitGroup = new THREE.Group();
  orbitGroup.name = "orbitGroup";
  // Posisikan orbitGroup di tempat yang sama dengan sphere
  orbitGroup.position.copy(sphere.position);
  mainGroup.add(orbitGroup); // Tambahkan orbitGroup ke grup utama

  // --- Objek yang Mengorbit (Cube dan Pyramid mengitari Sphere) ---
  const orbitRadiusVal = 3.0; // Jarak dari pusat (sphere) ke objek yang mengorbit
  // Offset Y agar dasar objek yang mengorbit kurang lebih sejajar dengan dasar bola
  const orbitingObjectYOffset = -sphereRadius;

  // Cube
  const cubeSize = 1.5;
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cube = new THREE.Mesh(cubeGeometry, objectPhongMaterial);
  // Posisikan cube RELATIF terhadap orbitGroup (yang berpusat di sphere)
  cube.position.set(orbitRadiusVal, cubeSize / 2 + orbitingObjectYOffset, 0);
  cube.castShadow = true;
  cube.receiveShadow = true;
  orbitGroup.add(cube); // Tambahkan cube sebagai child dari orbitGroup

  // Pyramid
  const pyramidHeight = 2;
  const pyramidBaseRadius = 1;
  const pyramidGeometry = new THREE.ConeGeometry(
    pyramidBaseRadius,
    pyramidHeight,
    4
  );
  const pyramid = new THREE.Mesh(pyramidGeometry, objectPhongMaterial);
  // Posisikan pyramid RELATIF terhadap orbitGroup, di sisi berlawanan dari cube
  pyramid.position.set(
    -orbitRadiusVal,
    pyramidHeight / 2 + orbitingObjectYOffset,
    0
  );
  pyramid.rotation.y = Math.PI / 4; // Sedikit rotasi pada pyramid itu sendiri
  pyramid.castShadow = true;
  pyramid.receiveShadow = true;
  orbitGroup.add(pyramid); // Tambahkan pyramid sebagai child dari orbitGroup

  return {
    mainGroup, // Grup yang berisi plane, sphere, dan orbitGroup
    orbitGroup, // Grup yang berisi cube dan pyramid, dan akan diputar
  };
}
