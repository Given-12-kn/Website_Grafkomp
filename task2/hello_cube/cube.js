// js/cube.js
import * as THREE from "three";

export function createCube() {
  const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5); // Ukuran kubus

  // Karena tidak ada lighting, kita gunakan MeshBasicMaterial
  // yang tidak terpengaruh oleh cahaya.
  const material = new THREE.MeshBasicMaterial({
    color: 0x8b4513, // Warna coklat (SaddleBrown)
    wireframe: false, // Set true untuk melihat kerangka, false untuk solid
  });

  const cube = new THREE.Mesh(geometry, material);
  return cube;
}
