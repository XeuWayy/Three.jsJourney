import * as THREE from 'three/webgpu'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {Pane} from "tweakpane"

import {
    Fn,
    modelPosition,
    positionGeometry,
    vec4,
    assign,
    sin,
    uniform,
    float,
    modelWorldMatrix,
    cameraViewMatrix, cameraProjectionMatrix, positionLocal, vec2, time
} from "three/tsl";
import * as viewMatrix from "three/tsl";
import * as projectionMatrix from "three/tsl";

/**
 * Base
 */
// Debug
const pane = new Pane({title: "🌊 Three.js Journey - Raging Sea 🌊"})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry

const waterGeometry = new THREE.PlaneGeometry(2, 2, 128, 128)

// Material
const waterMaterial = new THREE.MeshStandardNodeMaterial({
    side: THREE.DoubleSide,
})

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

// Water vertex shader

const uBigWavesElavation = uniform(0.2)
const uBigWavesFrequency = uniform(vec2(4.0, 1.0))
const elapsed = uniform(0)

const waterVertex = Fn( () => {
    const position = positionLocal.toVar()

    const elevation = sin(position.x.mul(uBigWavesFrequency.x).add(time))
                    .mul(sin(position.y.mul(uBigWavesFrequency.y).add(time)))
                    .mul(uBigWavesElavation);

    position.z.assign(elevation)

    return position
})

waterMaterial.positionNode = waterVertex()

// Water fragment shader

const waterFragment = Fn( () => {
    return vec4(1.0, positionGeometry.y, positionGeometry.z, 1.0)
})

waterMaterial.colorNode = waterFragment()

// Debug water
pane.addBinding(waterMaterial, 'wireframe', {label: 'Water Wireframe'})
pane.addBinding(uBigWavesElavation, 'value', {min: 0, max: 1, step: 0.001, label:'Big Waves Elevation'})
pane.addBinding(uBigWavesFrequency, 'value', {min: 0, max: 25, step: 0.5, label:'Big Waves Elevation'})


const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial()
)
//scene.add(cube)

const pointLight = new THREE.PointLight(0xFFffFF, 10)
pointLight.position.set(2, 3, 4)
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
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
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGPURenderer({
    canvas: canvas
})
renderer.setClearColor('#000000')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    elapsed.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.renderAsync(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()