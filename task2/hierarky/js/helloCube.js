// js/helloCube.js
import * as THREE from "three";

export function createHelloCube() {
  const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8); // Ukuran kubus sedikit lebih kecil

  // Kita gunakan MeshBasicMaterial karena tidak ada lighting di scene ini
  const material = new THREE.MeshBasicMaterial({
    color: 0x8b4513, // Warna coklat (SaddleBrown) seperti sebelumnya
    wireframe: false,
  });

  const cube = new THREE.Mesh(geometry, material);
  return cube;
}
