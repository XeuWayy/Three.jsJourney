import * as THREE from 'three/webgpu'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {Pane} from "tweakpane";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import {
    cameraNormalMatrix,
    cameraPosition, cameraViewMatrix, cameraWorldMatrix, div, dot,
    Fn, fract, If, lessThan, mix,
    mod, modelWorldMatrix,
    mul, normalGeometry, normalLocal,
    normalView, normalWorld, positionGeometry,
    positionLocal, positionView, positionViewDirection,
    positionWorld, sin, smoothstep,
    sub,
    time,
    uniform, vec2, vec3,
    vec4
} from "three/tsl";

/**
 * Base
 */
// Debug
const debugObject = {}
const pane = new Pane({title: ' 👽 Three.js Journey - Hologram 👽'})

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
const camera = new THREE.PerspectiveCamera(25, sizes.width / sizes.height, 0.1, 100)
camera.position.set(7, 7, 7)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const rendererParameters = {}
rendererParameters.clearColor = '#1d1f2a'

const renderer = new THREE.WebGPURenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor(rendererParameters.clearColor)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

pane.addBinding(rendererParameters, 'clearColor', {label: "Render clear color"}).on('change', () =>{
        renderer.setClearColor(rendererParameters.clearColor)
    })

/**
 * Material
 */
const material = new THREE.MeshBasicNodeMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
})

// Vertex node
const random2d = Fn(([vector]) => {
    return fract(sin(dot(vector.xy, vec2(12.9898, 78.233))).mul(43758.5453))
})

material.positionNode = Fn(() => {

    const position = positionLocal.toVar()

    const glitchTime = time.sub(positionWorld.y).toConst()
    const glitchStrength = smoothstep(
        0.3,
        1.0,
        div(sin(glitchTime).add(sin(glitchTime.mul(3.45)).add(sin(glitchTime.mul(8.76)))), 3.0)
    ).mul(0.25)


    position.x.subAssign(mul(random2d([position.xz.add(time)]).sub(0.5), glitchStrength))
    position.z.subAssign(mul(random2d([position.zx.add(time)]).sub(0.5), glitchStrength))


    return position
})()

// Fragment node
debugObject.color = '#00ff00'
const color = uniform(new THREE.Color(0x00ff00))

material.fragmentNode = Fn(() => {



    const normal = normalWorld.toVar() //modelWorldMatrix.mul(vec4(normalLocal, 0.0)).xyz.normalize().toVar()
    If(lessThan(dot(normalWorld, cameraPosition), 0.0), () => {
        normal.mulAssign(-1.0)
    })


    const stripes = mod(positionWorld.y.sub(time.mul(0.02)).mul(20), 1.0).pow(3.0)

    const viewDirection = positionWorld.sub(cameraPosition).normalize().toVar()

    const fresnel = dot(viewDirection, normal).add(1).pow(4.0)

    const falloff = smoothstep(0.8, 0.0, fresnel).toConst()

    const holographic = stripes.mul(fresnel).add(fresnel.mul(1.25)).mul(falloff)



    return vec4(color, holographic);

})()

// DEBUG

pane.addBinding(debugObject, 'color', {label: "Material color"}).on('change', () => {
    color.value.set(debugObject.color)
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