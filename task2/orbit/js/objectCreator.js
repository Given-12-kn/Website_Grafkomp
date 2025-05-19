// js/objectCreator.js
import * as THREE from "three";

export function createShowcaseObjects(uvTexture) {
  const objectsGroup = new THREE.Group();

  // --- Material Utama (Phong) untuk Kubus, Bola, Piramida ---
  const mainObjectPhongMaterial = new THREE.MeshPhongMaterial({
    map: uvTexture.clone(), // Tekstur UV sebagai warna dasar (diffuse map)
    color: 0xffffff, // Warna dasar objek (putih, akan dikalikan dengan map)

    // Properti PHONG untuk kilau specular
    specular: 0x777777, // Warna kilau specular (abu-abu untuk kilau putih yang cukup terang)
    shininess: 60, // Fokus kilau (0-100+, nilai lebih tinggi = kilau lebih kecil & tajam)

    // Properti EMISSIVE
    emissive: 0x221111, // Warna cahaya yang dipancarkan (misal, merah sangat redup)
    // Jika ingin lebih jelas, coba 0x330000 atau 0x003300 (hijau)
    emissiveIntensity: 0.6, // Seberapa kuat cahaya emissive (0-1)
    // emissiveMap: anotherTexture, // Jika ingin bagian tertentu saja yang bercahaya berdasarkan tekstur
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
    color: 0xffffff,
    specular: 0x050505, // Kilau sangat minim untuk plane
    shininess: 5,
    // Plane biasanya tidak emissive
  });
  const plane = new THREE.Mesh(planeGeometry, planePhongMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.receiveShadow = true; // Plane menerima bayangan
  objectsGroup.add(plane);

  // --- Cube ---
  const cubeSize = 1.5;
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cube = new THREE.Mesh(cubeGeometry, mainObjectPhongMaterial);
  cube.position.set(-2.5, cubeSize / 2 + 0.02, 0.3); // Naikkan sedikit lebih untuk bayangan
  cube.castShadow = true; // Cube menghasilkan bayangan
  cube.receiveShadow = true; // Cube juga bisa menerima bayangan
  objectsGroup.add(cube);

  // --- Sphere ---
  const sphereRadius = 1.0;
  const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
  const sphere = new THREE.Mesh(sphereGeometry, mainObjectPhongMaterial);
  sphere.position.set(0, sphereRadius + 0.02, -0.5);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  objectsGroup.add(sphere);

  // --- Pyramid ---
  const pyramidHeight = 2.0;
  const pyramidBaseRadius = 1.0;
  const pyramidGeometry = new THREE.ConeGeometry(
    pyramidBaseRadius,
    pyramidHeight,
    4
  );
  const pyramid = new THREE.Mesh(pyramidGeometry, mainObjectPhongMaterial);
  pyramid.position.set(2.2, pyramidHeight / 2 + 0.02, 0.6);
  pyramid.rotation.y = Math.PI / 5;
  pyramid.castShadow = true;
  pyramid.receiveShadow = true;
  objectsGroup.add(pyramid);

  return objectsGroup;
}
