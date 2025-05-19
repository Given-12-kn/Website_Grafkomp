// js/objectCreator.js
import * as THREE from "three";

export function createShowcaseObjects(uvTexture) {
  const objectsGroup = new THREE.Group();

  // --- Material Phong Utama untuk Bola dan Piramida ---
  // Kita akan buat material terpisah untuk Kubus agar bisa set emissive berbeda jika perlu
  const spherePyramidPhongMaterial = new THREE.MeshPhongMaterial({
    map: uvTexture.clone(),
    color: 0xffffff,
    specular: 0x777777,
    shininess: 60,
    // Emissive default (hitam, tidak bercahaya) untuk bola dan piramida, KECUALI kita set di bawah
  });

  // --- Material Phong Khusus untuk KUBUS dengan EMISSIVE ---
  const cubeEmissivePhongMaterial = new THREE.MeshPhongMaterial({
    map: uvTexture.clone(), // Tekstur UV
    color: 0xffffff, // Warna dasar (jika tekstur transparan atau untuk tint)

    specular: 0x888888, // Warna kilau specular (abu-abu cukup terang untuk kilau putih)
    shininess: 75, // Fokus dan intensitas kilau (coba nilai 50-100)

    emissive: 0x332211, // Warna cahaya yang dipancarkan kubus (misal, oranye/coklat redup)
    // Coba nilai lain: 0x222200 (kuning redup), 0x003300 (hijau redup)
    emissiveIntensity: 0.7, // Seberapa kuat efek emissive (0-1)
    // emissiveMap: someTexture,    // Jika ingin bagian tertentu saja yang emissive
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
    specular: 0x050505,
    shininess: 5,
  });
  const plane = new THREE.Mesh(planeGeometry, planePhongMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.receiveShadow = true;
  objectsGroup.add(plane);

  // --- Cube ---
  const cubeSize = 1.5;
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  // Gunakan material khusus kubus yang sudah ada emissive-nya
  const cube = new THREE.Mesh(cubeGeometry, cubeEmissivePhongMaterial);
  cube.position.set(-2.5, cubeSize / 2 + 0.02, 0.3);
  cube.castShadow = true;
  cube.receiveShadow = true;
  objectsGroup.add(cube);

  // --- Sphere ---
  // Jika ingin sphere juga emissive, bisa gunakan cubeEmissivePhongMaterial
  // atau tambahkan properti emissive ke spherePyramidPhongMaterial
  const sphereRadius = 1.0;
  const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
  const sphere = new THREE.Mesh(sphereGeometry, spherePyramidPhongMaterial); // Menggunakan material tanpa emissive default
  // Contoh jika ingin sphere juga emissive sedikit berbeda:
  // sphere.material.emissive.setHex(0x111122); // Biru redup
  // sphere.material.emissiveIntensity = 0.5;
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
  const pyramid = new THREE.Mesh(pyramidGeometry, spherePyramidPhongMaterial); // Menggunakan material tanpa emissive default
  pyramid.position.set(2.2, pyramidHeight / 2 + 0.02, 0.6);
  pyramid.rotation.y = Math.PI / 5;
  pyramid.castShadow = true;
  pyramid.receiveShadow = true;
  objectsGroup.add(pyramid);

  return objectsGroup;
}
