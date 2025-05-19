// js/cameraManager.js
let availableCameras = [];
let currentCameraIndex = 0;
let activeCamera = null;
let cameraButton = null;
let cameraInfoElement = null;

function updateButtonAndInfo() {
  if (activeCamera && cameraButton && cameraInfoElement) {
    cameraInfoElement.textContent = `Kamera Aktif: ${
      activeCamera.name || "Tidak Bernama"
    }`;
  }
}

export function initCameraManager(cameras, buttonId, infoId) {
  availableCameras = [cameras.mainPerspective, cameras.mainOrthographic];

  if (availableCameras.length === 0) {
    console.error("Tidak ada kamera yang tersedia untuk CameraManager.");
    return null;
  }

  activeCamera = availableCameras[0];
  currentCameraIndex = 0;

  cameraButton = document.getElementById(buttonId);
  cameraInfoElement = document.getElementById(infoId);

  if (cameraButton) {
    cameraButton.addEventListener("click", () => {
      currentCameraIndex = (currentCameraIndex + 1) % availableCameras.length;
      activeCamera = availableCameras[currentCameraIndex];
      updateButtonAndInfo();
      console.log("Kamera diganti ke:", activeCamera.name);
    });
  } else {
    console.warn(`Elemen tombol dengan ID '${buttonId}' tidak ditemukan.`);
  }
  if (!cameraInfoElement) {
    console.warn(`Elemen info dengan ID '${infoId}' tidak ditemukan.`);
  }

  updateButtonAndInfo();
  return {
    getActiveCamera: () => activeCamera,
  };
}
