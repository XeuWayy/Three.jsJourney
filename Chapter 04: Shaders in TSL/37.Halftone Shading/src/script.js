import * as THREE from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {Pane} from "tweakpane";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import {
    Fn,
    positionLocal,
    screenCoordinate,
    screenUV,
    uniform,
    vec4,
    assign,
    varying,
    vec2,
    div,
    mod,
    distance, smoothstep, step, vec3, dot, normalLocal, mul, mix
} from "three/tsl";

/**
 * Base
 */
// Debug
const pane = new Pane()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loaders
const gltfLoader = new GLTFLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Resolution Uniform
    resolution.value.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 7
camera.position.y = 7
camera.position.z = 7
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const rendererParameters = {}
rendererParameters.clearColor = '#bfa679'

const renderer = new THREE.WebGPURenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

pane.addBinding(rendererParameters, 'clearColor').on('change', () => {
        renderer.setClearColor(rendererParameters.clearColor)
    })

// Light

const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 4.0)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Material
 */
const materialParameters = {}
materialParameters.color = '#00ff78'
const color = uniform(new THREE.Color(materialParameters.color))
const shadeColor = uniform(new THREE.Color(materialParameters.shadeColor))

const material = new THREE.MeshStandardNodeMaterial({})

// Vertex shader

material.positionNode = Fn(() => {
    return positionLocal
})()

// Fragment shader

const resolution = uniform(vec2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio))

const createHalftone = Fn((
    [
        color,
        repetitions,
        direction,
        low,
        high,
        halftoneColor,
        normal
    ]) => {
    const intensity = dot(normal, direction)
    intensity.assign(smoothstep(low, high, intensity))

    const fragCoord = vec2(screenCoordinate.x, resolution.y.sub(screenCoordinate.y)).toVar()
    fragCoord.divAssign(resolution.y)
    fragCoord.mulAssign(repetitions);
    fragCoord.assign(mod(fragCoord, 1.0))

    const point = step(
        mul(0.5, intensity),
        distance(fragCoord, vec2(0.5))
    ).oneMinus()

    return mix(color, halftoneColor, point)
})

material.colorNode = Fn(() => {
    const finalColor = createHalftone([color, 75.0, vec3(0.0, -1.0, 0.0), -0.8, 1.5, vec3(0.9, 1.0, 0), normalLocal])

    return vec4(finalColor, 1.0)
})()

pane.addBinding(materialParameters, 'color').on('change', () => {
        color.value.set(materialParameters.color)
    })

/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material
)
torusKnot.position.x = 3
scene.add(torusKnot)

// Sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(),
    material
)
sphere.position.x = - 3
scene.add(sphere)

// Suzanne
let suzanne = null
gltfLoader.load(
    './suzanne.glb',
    (gltf) =>
    {
        suzanne = gltf.scene
        suzanne.traverse((child) =>
        {
            if(child.isMesh)
                child.material = material
        })
        scene.add(suzanne)
    }
)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Rotate objects
    if(suzanne)
    {
        suzanne.rotation.x = - elapsedTime * 0.1
        suzanne.rotation.y = elapsedTime * 0.2
    }

    sphere.rotation.x = - elapsedTime * 0.1
    sphere.rotation.y = elapsedTime * 0.2

    torusKnot.rotation.x = - elapsedTime * 0.1
    torusKnot.rotation.y = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.renderAsync(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()