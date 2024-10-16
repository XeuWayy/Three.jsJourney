import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {SphereGeometry} from "three";
import colorSpaceNode from "three/addons/nodes/display/ColorSpaceNode.js";

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('./textures/particles/1.png')

/**
 * Particles
 */

// Sphere particle
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    alphaMap: particleTexture,
    transparent: true,
    vertexColors: true,
    /* Solution 1
    alphaTest: 0.001 */
    /* Solution 2
    alphaTest: 0.001
    depthTest: false */
    /* Solution 3*/
    depthWrite: false
    /* Solution 4
    depthWrite: false,
    blending: THREE.AdditiveBlending */
})

// Particles
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
particles.visible = false
scene.add(particles)

// Custom geometry particle
const customGeometry = new THREE.BufferGeometry()
const count = 5000

const positions =  new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] =  Math.random()
}

customGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
customGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
const customParticles = new THREE.Points(customGeometry, particlesMaterial)
scene.add(customParticles)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    customParticles.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()