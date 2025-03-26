import * as THREE from 'three/webgpu'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {Pane} from "tweakpane"

import {
    Fn,
    vec4,
    sin,
    uniform,
    positionLocal, vec2, time, varying, mix, mx_noise_float, vec3, abs, Loop
} from "three/tsl";


/**
 * Base
 */
// Debug
const pane = new Pane({title: "🌊 Three.js Journey - Raging Sea 🌊"})
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry

const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

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
const uBigWavesFrequency = uniform(vec2(4.0, 1.5))
const uBigWavesSpeed = uniform(0.75)

const elapsed = uniform(0)
const vElevation = varying(0)

const smallWavesSpeed = uniform(0.2)
const smallWavesFrequency = uniform(3.0)
const smallWavesMultiplier = uniform( 0.25 )
const smallWavesIteration = uniform( 4 )

const waterVertex = Fn( () => {

    const position = positionLocal.toVar()

    const elevation = sin(position.x.mul(uBigWavesFrequency.x).add(time.mul(uBigWavesSpeed)))
                    .mul(sin(position.y.mul(uBigWavesFrequency.y).add(time.mul(uBigWavesSpeed))))
                    .mul(uBigWavesElavation).toVar();

    Loop({start: 1, end: smallWavesIteration, type: 'int', condition: '<='}, ({i}) => {

        const noise = vec3(
            position.xy
                .add(2.0)
                .mul(smallWavesFrequency)
                .mul(i),
            time.mul(smallWavesSpeed)
        )

        const wave = mx_noise_float(
            noise, 1, 0
        )
        .mul(smallWavesMultiplier)
        .div(i)
        .abs()

        elevation.subAssign(wave)
    })

    position.z.assign(elevation)

    vElevation.assign(elevation)
    return position
})

waterMaterial.positionNode = waterVertex()

// Water fragment shader

debugObject.depthColor = "#035b6c"

const uDepthColor = uniform(new THREE.Color(debugObject.depthColor))
const uColorOffset = uniform(0.25)
const uColorMultiplier = uniform(2.0)

const waterFragment = Fn( () => {
    const elevationStrength = vElevation.mul(uColorMultiplier).add(uColorOffset)

    const mixedColor = mix(uDepthColor, positionLocal, elevationStrength)

    return vec4(mixedColor, 1.0)
})

waterMaterial.colorNode = waterFragment()

// Debug water

// Vertex Debug
pane.addBinding(waterMaterial, 'wireframe', {label: 'Water Wireframe'})
pane.addBinding(uBigWavesElavation, 'value', {min: 0, max: 1, step: 0.001, label:'Big Waves Elevation'})
pane.addBinding(uBigWavesFrequency, 'value', {min: 0, max: 25, step: 0.5, label:'Big Waves Frequency'})
pane.addBinding(uBigWavesSpeed, 'value', {min: 0, max: 4, step: 0.001, label:'Big Waves Speed'})

pane.addBinding(smallWavesIteration, 'value', {min: 1, max: 25, step: 1, label:'Small Waves Iteration'})
pane.addBinding(smallWavesSpeed, 'value', {min: 0, max: 1, step: 0.001, label:'Small Waves Speed'})
pane.addBinding(smallWavesFrequency, 'value', {min: 0, max: 25, step: 0.001, label:'Small Waves Frequency'})
pane.addBinding(smallWavesMultiplier, 'value', {min: 0, max: 1, step: 0.001, label:'Small Waves Multiplier'})


// Color Debug
pane.addBinding(debugObject, 'depthColor', {label: 'Depth Color'}).on('change', () => {
    uDepthColor.value.set(debugObject.depthColor)
})

pane.addBinding(uColorOffset, 'value', {min: 0, max: 1, step: 0.001, label:'Color Offset'})
pane.addBinding(uColorMultiplier, 'value', {min: 0, max: 10, step: 0.1, label:'Color Multiplier'})


const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial()
)
//scene.add(cube)


const pointLight = new THREE.PointLight(0xFFFFFF, 15)
pointLight.position.set(0, 1, 0)
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