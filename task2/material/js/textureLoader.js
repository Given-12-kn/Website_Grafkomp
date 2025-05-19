// js/textureLoader.js
import * as THREE from "three";

export function loadUVTexture(path) {
  return new Promise((resolve, reject) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      path,
      (texture) => {
        console.log("Texture loaded successfully:", path);
        resolve(texture);
      },
      undefined, // onProgress callback (not needed here)
      (error) => {
        console.error("An error happened during texture loading.", error);
        reject(error);
      }
    );
  });
}
