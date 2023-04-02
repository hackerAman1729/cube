// Import additional three.js modules
import * as THREE from 'https://cdn.skypack.dev/three';
import { OrbitControls } from 'https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls';
import { Line2 } from 'https://cdn.skypack.dev/three/examples/jsm/lines/Line2';
import { LineGeometry } from 'https://cdn.skypack.dev/three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'https://cdn.skypack.dev/three/examples/jsm/lines/LineMaterial';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add a point light
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 0, 2);
scene.add(pointLight);

// Create the glass cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({
  transparent: true,
  opacity: 0.5,
  color: 0xffffff,
  shininess: 100,
  envMap: new THREE.CubeTextureLoader().load([
      'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg',
      'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg',
      'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg',
      'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg',
      'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg',
      'https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg',
    ]),
  reflectivity: 1
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create glowing edges
const glowGeometry = new THREE.EdgesGeometry(geometry, 1);
const glowMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
const glowCube = new THREE.LineSegments(glowGeometry, glowMaterial);
scene.add(glowCube);

// Create laser beams
const laserCount = 4;
const lasers = [];

for (let i = 0; i < laserCount; i++) {
  const lineGeometry = new LineGeometry();
  const lineMaterial = new LineMaterial({
    color: new THREE.Color(`hsl(${(i * 360) / laserCount}, 100%, 50%)`),
    linewidth: 0.0075,
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
  });

  const laser = new Line2(lineGeometry, lineMaterial);
  lasers.push(laser);
  scene.add(laser);
}

function updateLasers() {
  const radius = 2.5;
  const now = Date.now() * 0.001;

  lasers.forEach((laser, i) => {
    const angle = (i * 2 * Math.PI) / laserCount + now;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const z = 0;

    laser.geometry.setPositions([-x, -y, -z, x, y, z]);
    laser.geometry.verticesNeedUpdate = true;
  });
}

// Resize the renderer when the window is resized
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

// Animate the cube and lasers
function animate() {
  requestAnimationFrame(animate);

  // Rotate the cube
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  // Sync glowing edges with the cube
  glowCube.rotation.copy(cube.rotation);

  // Update lasers
  updateLasers();

  renderer.render(scene, camera);
}

animate();

