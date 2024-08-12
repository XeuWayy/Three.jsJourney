import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animations

// Three.js Clock
const clock = new THREE.Clock()

const loop = () => {
    // Clock
    const elaspsedTime = clock.getElapsedTime()

    // Update objects
    mesh.rotation.y = elaspsedTime
    mesh.position.x = Math.sin(elaspsedTime)
    mesh.position.y = Math.cos(elaspsedTime)

    // Render the scene
    renderer.render(scene, camera)

    window.requestAnimationFrame(loop);
}

loop()