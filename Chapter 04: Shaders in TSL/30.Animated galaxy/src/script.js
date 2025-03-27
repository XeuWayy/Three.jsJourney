import * as THREE from 'three/webgpu'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {Pane} from "tweakpane"
import {
    Fn,
    positionLocal,
    range,
    vec3,
    assign,
    uniform,
    mul,
    PI2,
    time,
    sin,
    cos,
    mix,
    div,
    uv,
    vec4,
    color
} from "three/tsl";

/**
 * Base
 */
// Debug
const pane = new Pane({title: "🌌 Three.js Journey - Animated Galaxy 🌌"})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 20000
parameters.branches = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let geometry = null
let material = null
let mesh = null

const pointSize = uniform(0.05)
const radiusMultiplier = uniform(5)
const branches = uniform(3)
const randomnessPower = uniform(3)
const randomness = uniform(0.5)

const insideColor = uniform(new THREE.Color('#ff6030'))
const outsideColor = uniform(new THREE.Color('#1b3984'))

const generateGalaxy = () =>
{
    if(mesh !== null)
    {
        scene.remove(mesh)
        mesh.dispose()
        mesh = new THREE.InstancedMesh(geometry, material, parameters.count)
        scene.add(mesh)
    }
}


/**
 * Material
 */
material = new THREE.SpriteNodeMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
})

// Scale

material.scaleNode = range(0, 1).mul(pointSize)

// Position
const radiusRatio = range(0, 1)
const radius = radiusRatio.pow(1.5).mul(radiusMultiplier).toVar()

const branchesAngle = range(0, branches).floor().mul(PI2.div(branches))
const angles = branchesAngle.add(time.mul(radiusRatio.oneMinus()))

const position = vec3(
    sin(angles),
    0,
    cos(angles)
).mul(radius)

const randomOffset = range(vec3(-1), vec3(1)).pow(randomnessPower).mul(randomness).add(0.2)

material.positionNode = position.add(randomOffset)

// Color

const mixedColor = mix(outsideColor, insideColor, radiusRatio.pow(2).oneMinus());
const alpha = div(0.1, uv().sub(0.5).length()).sub(0.2)

material.colorNode = vec4(mixedColor, alpha)

/**
 * Geometry
 */
geometry = new THREE.PlaneGeometry(1,1)

// Vertex node

/**
 * Points
 */
mesh = new THREE.InstancedMesh(geometry, material, parameters.count)
scene.add(mesh)

//generateGalaxy()

pane.addBinding(parameters, 'count', {min: 100, max: 1000000, step: 100, label: 'Particle count'}).on('change', (event) => {
    if (event.last) {
        generateGalaxy()
    }
})
pane.addBinding(pointSize, 'value', {min: 0.01, max: 1, step: 0.01, label: 'Particle size'})
pane.addBinding(radiusMultiplier, 'value', {min: 0.01, max: 20, step: 0.01, label: 'Galaxy radius'})
pane.addBinding(parameters, 'branches', {min: 2, max: 20, step: 1, label: 'Branch count'}).on('change', (event) => {
    if (event.last) {
        branches.value = parameters.branches
        generateGalaxy()
    }
})
pane.addBinding(randomness, 'value', {min: 0, max: 2, step: 0.001, label: 'Particles randomness'})
pane.addBinding(randomnessPower, 'value', {min: 1, max: 10, step: 0.001, label: 'Randomness power'})
pane.addBinding(parameters, 'insideColor', {label: 'Inside color'}).on('change', () => {
    insideColor.value.set(parameters.insideColor)
})
pane.addBinding(parameters, 'outsideColor', {label: 'Outside color'}).on('change', () => {
    outsideColor.value.set(parameters.outsideColor)
})

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
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 200)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGPURenderer({
    canvas: canvas,
    forceWebGL: true
})
renderer.setClearColor(0x000)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.renderAsync(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()