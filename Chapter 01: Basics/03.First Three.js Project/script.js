import * as three from 'three';

// The canvas getter
const canvas = document.querySelector('canvas.webgl');

// The scene setup
const scene = new three.Scene();

// The Cube setup
const cube = new three.BoxGeometry(1, 1, 1);
const material = new three.MeshBasicMaterial({ color: 0xff0000 });
const cubeMesh = new three.Mesh(cube, material);
scene.add(cubeMesh);

// The render size setup
const size = {
    width: "600",
    height: "500"
};

// The Camera setup
const camera = new three.PerspectiveCamera(45, size.width / size.height);
camera.position.set(1, 1, 4); // The camera position
camera.lookAt(0,0,0); // The camera look at the center of the scene
scene.add(camera);

// The Renderer setup
const renderer = new three.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(size.width, size.height);

renderer.render(scene, camera);