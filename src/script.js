import "./styles.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
//Сцена
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
document.body.appendChild(renderer.domElement);
// Привязка источника света к курсору
document.querySelector("canvas").addEventListener("mousemove", () => {
  let Y = innerHeight - event.clientY * 2;
  let X = innerWidth - event.clientX * 2;
  light.position.set(-X / 2, Y / 2, 100);
});

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

// Сфера
const sphereGeometry = new THREE.SphereGeometry(10, 32, 16);
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: "red",
  specular: 0xbcbcbc,
  flatShading: true,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

// Куб
const cubeGeometry = new THREE.BoxGeometry(innerWidth, innerHeight, 1);

// Многогранник
const dodecahedronGeometry = new THREE.DodecahedronGeometry(10);
const dodecahedron = new THREE.Mesh(dodecahedronGeometry, gold);

// Объект Mesh, который принимает геометрию, и применяет к нему материал
const cube = new THREE.Mesh(cubeGeometry, gray);
cube.position.set(0, 0, -150);
scene.add(cube);

//создание точечного света. Принимает три величины (цвет, интенсивность, дистанция)
const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(50, 50, 50);
scene.add(light);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

const bublik = new THREE.Mesh(geometry, gold);
scene.add(bublik);

function sphereRender() {
  requestAnimationFrame(sphereRender);
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function dodecahedronRender() {
  requestAnimationFrame(dodecahedronRender);
  dodecahedron.rotation.x += 0.01;
  dodecahedron.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function bublikRender() {
  requestAnimationFrame(bublikRender);
  bublik.rotation.x += 0.01;
  bublik.rotation.y += 0.01;
  renderer.render(scene, camera);
}

document.getElementById("sphere").addEventListener("click", () => {
  scene.remove(bublik);
  scene.remove(dodecahedron);
  scene.remove(sphere);
  scene.add(sphere);
  sphereRender();
});

document.getElementById("dodecahedron").addEventListener("click", () => {
  scene.remove(bublik);
  scene.remove(dodecahedron);
  scene.remove(sphere);
  scene.add(dodecahedron);
  dodecahedronRender();
});

bublikRender();

loader.load(
  "./assets/scene.gltf",
  function (gltf) {
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
