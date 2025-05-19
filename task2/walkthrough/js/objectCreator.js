// js/objectCreator.js
import * as THREE from "three";

export function createShowcaseObjects(uvTexture) {
  const objectsGroup = new THREE.Group();

  const objectMaterial = new THREE.MeshPhongMaterial({
    map: uvTexture.clone(),
    shininess: 100, // High shininess for strong specular highlights
    specular: 0xffffff // White specular color
  });

  // 1. Plane (Lantai)
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const planeTexture = uvTexture.clone();
  planeTexture.needsUpdate = true;
  planeTexture.wrapS = THREE.ClampToEdgeWrapping;
  planeTexture.wrapT = THREE.ClampToEdgeWrapping;
  planeTexture.repeat.set(1, 1);

  const planeMaterial = new THREE.MeshPhongMaterial({
    map: planeTexture,
    shininess: 30, // Lower shininess for floor
    specular: 0x444444 // Darker specular for floor
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0;
  plane.receiveShadow = true; // Plane harus menerima bayangan
  objectsGroup.add(plane);

  // 2. Cube
  const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const cube = new THREE.Mesh(cubeGeometry, objectMaterial.clone());
  cube.material.shininess = 80; // Custom shininess for cube
  cube.position.set(-2, 1.5 / 2 + 0.01, -0.5); // Naikkan sedikit untuk menghindari z-fighting dengan plane jika ada
  cube.castShadow = true; // Cube menghasilkan bayangan
  cube.receiveShadow = true; // Cube juga bisa menerima bayangan (misal dari objek lain)
  objectsGroup.add(cube);

  // 3. Sphere
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sphere = new THREE.Mesh(sphereGeometry, objectMaterial.clone());
  sphere.material.shininess = 120; // Higher shininess for sphere
  sphere.position.set(0, 1 + 0.01, 0);
  sphere.castShadow = true; // Sphere menghasilkan bayangan
  sphere.receiveShadow = true;
  objectsGroup.add(sphere);

  // 4. Pyramid (Cone dengan 4 sisi)
  const pyramidHeight = 2;
  const pyramidRadius = 1;
  const pyramidGeometry = new THREE.ConeGeometry(
    pyramidRadius,
    pyramidHeight,
    4
  );
  const pyramid = new THREE.Mesh(pyramidGeometry, objectMaterial.clone());
  pyramid.material.shininess = 90; // Custom shininess for pyramid
  pyramid.position.set(2.2, pyramidHeight / 2 + 0.01, -0.2);
  pyramid.castShadow = true; // Pyramid menghasilkan bayangan
  pyramid.receiveShadow = true;
  objectsGroup.add(pyramid);

  return objectsGroup;
}
