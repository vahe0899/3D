import "./styles.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

/**
 *  БАЗОВЫЕ ЗАГРУЗЧИКИ И СЦЕНА С КАМЕРОЙ
 */

// Loader для 3D объектов
const gloader = new GLTFLoader();

// Loader шрифтов
const fontLoader = new FontLoader();

// Сцена
const scene = new THREE.Scene();

// Камера
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Позиция камеры
camera.position.z = 30;

// Создание canvas и вставка в DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const canvas = renderer.domElement;
document.body.appendChild(canvas);

/**
 *  МАТЕРИАЛЫ
 */

// Серый материал
const gray = new THREE.MeshPhongMaterial({
  color: 0xa1a1a1,
  specular: 0xbcbcbc,
});

// Золотой материал
const gold = new THREE.MeshPhongMaterial({
  color: 0xdaa520,
  specular: 0xbcbcbc,
});

// Красный материал для сферы
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: "pink",
  specular: 0xbcbcbc,
  flatShading: true,
});

// Задний Фон
const wallGeometry = new THREE.BoxGeometry(innerWidth, innerHeight, 1);
const wall = new THREE.Mesh(wallGeometry, gray);
wall.position.set(0, 0, -150);
scene.add(wall);

// Создание точечного света. Принимает три величины (цвет, интенсивность, дистанция)
const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(50, 50, 50);
scene.add(light);

// Привязка источника света к курсору
canvas.addEventListener("mousemove", (event) => {
  let Y = innerHeight - event.clientY * 2;
  let X = innerWidth - event.clientX * 2;
  light.position.set(-X / 2, Y / 2, 100);
});

// Рендер пустой сцены со светом
function sceneRender() {
  requestAnimationFrame(sceneRender);
  renderer.render(scene, camera);
}
sceneRender();

// ШРИФТЫ

document.getElementById("text").addEventListener("input", (event) => {
  fontLoader.load("/helvetiker_regular.typeface.json", function (font) {
    // Text
    const textGeometry = new TextGeometry(`${event.target.value}`, {
      font: font,
      size: 3,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });
    const text = new THREE.Mesh(textGeometry, gold);
    for (; scene.children.length > 2; ) {
      scene.children.pop();
    }
    scene.add(text);
    textGeometry.center();
  });
});

// Создание Сферы
const sphereGeometry = new THREE.SphereGeometry(10, 64, 32);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// Создание бублика
const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torus = new THREE.Mesh(torusGeometry, gold);

//Рендер сферы
function sphereRender() {
  requestAnimationFrame(sphereRender);
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
}

//Рендер бублика
function torusRender() {
  requestAnimationFrame(torusRender);
  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.01;
  renderer.render(scene, camera);
}

document.getElementById("sphere").addEventListener("click", () => {
  for (; scene.children.length > 2; ) {
    scene.children.pop();
  }
  scene.add(sphere);
  sphereRender();
});

document.getElementById("torus").addEventListener("click", () => {
  for (; scene.children.length > 2; ) {
    scene.children.pop();
  }
  scene.add(torus);
  torusRender();
});

// Ползунок интенсивности
document.getElementById("intensity").addEventListener("input", () => {
  let newIntensity = document.getElementById("intensity").value;
  light.intensity = newIntensity;
});

// Ползунок цвета
document.getElementById("color").addEventListener("input", () => {
  let hsl = document.getElementById("color").value;
  let newColor = new THREE.Color(`hsl(${hsl}, 100%, 50%)`);
  light.color = newColor;
});

gloader.load(
  // resource URL
  "/chips.glb",
  // called when the resource is loaded
  function (gltf) {
    gltf.scene.scale.set(0.05, 0.05, 0.05);
    // scene.add(gltf.scene);
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

let mouseDown = false;
canvas.onmousedown = () => {
  mouseDown = true;
};
canvas.onmouseup = () => {
  mouseDown = false;
};

canvas.addEventListener("mousemove", onMouseMove);

function onMouseMove(event) {
  if (scene.children[2]) {
    document.body.style.cursor = "grab";
  }
  if (mouseDown && scene.children[2]) {
    document.body.style.cursor = "grabbing";
    scene.children[2].rotation.y += event.movementX * 0.007;
    scene.children[2].rotation.x += event.movementY * 0.007;
  }
}
